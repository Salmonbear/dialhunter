import fs from 'fs/promises';
import path from 'path';
import { Watch } from '@/interfaces/Watch';

// Define the structure matching the JSON file more closely for initial parsing
interface JsonProduct {
  supplierURL: string;
  imageURLs: string[];
  title: string;
  price: string; // e.g., "£3,250.00", "$13,900", "€2,475"
  availability: string;
  description: string;
  productID: string;
  categories: string[];
  tags: string[];
  specifications: {
    gender?: string;
    condition?: { // Can be object or string (need to handle)
      case?: string;
      bracelet?: string;
      dial?: string;
      glass?: string;
    } | string; 
    brand: string;
    series?: string;
    model: string; // Usually reference number
    year?: string; // e.g., "02/02/2007", "c.1966", "1984"
    box?: string; // "Yes" / "No"
    papers?: string; // "Yes" / "No"
    case_material?: string;
    case_size?: string; // e.g., "41mm"
    bracelet_material?: string;
    dial?: string; // Description
    movement?: string;
    features?: string;
    water_resistance?: string; // e.g., "300 metres"
    movement_condition?: string;
    additional_information?: string;
    items_included?: string; 
    caliber?: string;
    display?: string;
    department?: string;
    with_original_box?: string; // "Yes" / "No"
    with_papers?: string; // "Yes" / "No"
    customised?: string; // "Yes" / "No"
    bezel?: string;
    bezel_condition?: string;
  };
}

interface JsonData {
  products: JsonProduct[];
}

// Updated path to the new JSON file location
const dataFilePath = path.join(process.cwd(), 'data', 'watches.json'); // Changed from 'public'

// Helper to parse price string (handles £, $, €)
const parsePrice = (priceStr: string): { price: number, currency: string } => {
    const cleanedStr = priceStr.replace(/[,GBP]/g, '').trim(); // Remove commas, GBP, and trim
    let currency = 'GBP'; // Default
    let amountStr = cleanedStr;

    if (priceStr.includes('£')) {
        currency = 'GBP';
        amountStr = cleanedStr.replace('£', '');
    } else if (priceStr.includes('$')) {
        currency = 'USD';
        amountStr = cleanedStr.replace('$', '');
    } else if (priceStr.includes('€')) {
        currency = 'EUR';
        amountStr = cleanedStr.replace('€', '');
    }
    
    const price = parseFloat(amountStr);
    return { price: isNaN(price) ? 0 : price, currency }; // Return 0 if parsing fails
};

// Helper to parse year string
const parseYear = (yearStr?: string): number | undefined => {
    if (!yearStr) return undefined;
    const cleanedYear = yearStr.replace(/c\.|[\/\s]/g, ''); // Remove "c.", slashes, spaces
    const year = parseInt(cleanedYear, 10);
    // Basic sanity check for a plausible year
    return !isNaN(year) && year > 1800 && year < 2100 ? year : undefined;
};

// Helper to determine a single condition string
// Pass the whole product to access availability
const getPrimaryCondition = (product: JsonProduct): string => { 
    const spec = product.specifications;
    if (typeof spec.condition === 'string') {
        return spec.condition; // Already a string
    }
    if (typeof spec.condition === 'object') {
        // Prioritize overall condition if available, otherwise combine? Or just pick one?
        // Let's try to be simple: check 'case' first as a proxy.
        return spec.condition.case || 'Used'; // Default to 'Used' if object exists but case is missing
    }
    // Check availability from the root product object as a fallback
    if (product.availability?.toLowerCase().includes('new')) return 'New'; 
    return 'Used'; // Default assumption
}

// Transform function: JsonProduct -> Watch
const transformProductToWatch = (product: JsonProduct, index: number): Watch => {
    const { price, currency } = parsePrice(product.price);
    const year = parseYear(product.specifications.year);
    // Pass the whole product to getPrimaryCondition
    const condition = getPrimaryCondition(product); 

    // Attempt to parse ID, fallback to index if fails
    let id = parseInt(product.productID, 10);
    if (isNaN(id)) {
        console.warn(`Could not parse productID "${product.productID}" to number. Using index ${index} as fallback ID.`);
        id = index; // Use array index as a fallback ID - ensure uniqueness
    }

    return {
        id: id, // Use parsed or fallback ID
        brand: product.specifications.brand || 'Unknown Brand', // Ensure brand exists
        model: product.title, // Use title as model for now, maybe refine later
        reference: product.specifications.model, // Use spec.model as reference
        price: price,
        currency: currency,
        condition: condition, // Get simplified condition
        year: year,
        case_material: product.specifications.case_material,
        case_diameter: product.specifications.case_size, // Map case_size
        movement: product.specifications.movement,
        description: product.description,
        image: product.imageURLs && product.imageURLs.length > 0 ? product.imageURLs[0] : '/placeholder.jpg', // Use first image or a placeholder
        listingSource: product.supplierURL, // Use supplier URL
        // Optional fields from Watch interface that might not directly map:
        dealerName: undefined, // Could potentially parse from URL or add later
        dealerURL: product.supplierURL, 
    };
};


/**
 * Reads watches.json, parses, validates, and transforms the data.
 */
async function readAndTransformData(): Promise<Watch[]> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const jsonData: JsonData = JSON.parse(fileContent);

    // Validate root structure
    if (!jsonData || !Array.isArray(jsonData.products)) {
      console.error('Error: watches.json does not contain a root object with a "products" array.');
      return [];
    }

    // Transform each product
    const transformedWatches = jsonData.products.map(transformProductToWatch);
    
    // Check for duplicate IDs after transformation
    const ids = new Set<number>();
    const uniqueWatches: Watch[] = [];
    for (const watch of transformedWatches) {
        if (ids.has(watch.id)) {
            console.warn(`Duplicate ID found after transformation: ${watch.id}. Skipping duplicate.`);
            // Potentially assign a new unique ID here if needed, e.g., based on index again
        } else {
            ids.add(watch.id);
            uniqueWatches.push(watch);
        }
    }

    return uniqueWatches;

  } catch (error) {
    console.error('Error reading, parsing, or transforming watches.json:', error);
    return []; // Return empty array on error
  }
}

/**
 * Fetches all watches, using the transformed data.
 */
export async function getAllWatches(): Promise<Watch[]> {
  return await readAndTransformData(); // Use the new function
}

/**
 * Fetches a single watch by its ID (using transformed data).
 * @param id The ID of the watch to fetch (should match the transformed ID).
 * @returns The watch object or null if not found.
 */
export async function getWatchById(id: string | number): Promise<Watch | null> {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  if (isNaN(numericId)) {
    return null; // Invalid ID format
  }

  const allWatches = await readAndTransformData(); // Use the new function
  const watch = allWatches.find(w => w.id === numericId);
  return watch || null;
}

// --- Filtering Logic ---

// Define filter criteria interface
interface FilterCriteria {
  query?: string;
  brand?: string;
  condition?: string; // This should now match the simplified condition string
  priceMax?: number;
  // Add other potential filters like minPrice, year, etc.
}

/**
 * Fetches watches based on filter criteria (using transformed data).
 * @param filters Object containing filter keys and values.
 * @returns An array of filtered watch objects.
 */
export async function getFilteredWatches(filters: FilterCriteria): Promise<Watch[]> {
  let watches = await readAndTransformData(); // Use the new function

  // Apply text query filter (searches brand, model, reference, description)
  if (filters.query) {
    const queryLower = filters.query.toLowerCase();
    watches = watches.filter(watch =>
      (watch.brand && watch.brand.toLowerCase().includes(queryLower)) ||
      (watch.model && watch.model.toLowerCase().includes(queryLower)) || // model is now title
      (watch.reference && watch.reference.toLowerCase().includes(queryLower)) || // reference is spec.model
      (watch.description && watch.description.toLowerCase().includes(queryLower))
    );
  }

  // Apply brand filter
  if (filters.brand) {
    watches = watches.filter(watch => watch.brand?.toLowerCase() === filters.brand?.toLowerCase());
  }

  // Apply condition filter (now simpler as condition is a single string)
  if (filters.condition) {
      // The filter value is already expected to be a slug e.g., "used-excellent"
      // The transformed data now has simplified conditions like "New", "Used - Excellent" etc.
      // We need to normalize the *data* condition for comparison or adjust the filter value expectation
      const normalizeCondition = (cond: string) => cond.toLowerCase().replace(/\s+/g, '-'); // Normalize data condition to slug
      watches = watches.filter(watch => normalizeCondition(watch.condition) === filters.condition?.toLowerCase());
  }

  // Apply max price filter
  if (filters.priceMax !== undefined && !isNaN(filters.priceMax)) { // Check if it's a valid number
    watches = watches.filter(watch => watch.price <= filters.priceMax!); 
  }

  // Add more filters here as needed...

  return watches;
}

// --- Data Aggregation ---

/**
 * Extracts unique brand names from the transformed watch data.
 * @returns An array of unique brand strings.
 */
export async function getUniqueBrands(): Promise<string[]> {
  const watches = await readAndTransformData(); // Use the new function
  const brands = new Set(watches.map(watch => watch.brand).filter(b => !!b)); // Filter out undefined/null brands
  return Array.from(brands as Set<string>).sort();
}

/**
 * Extracts unique condition values from the transformed watch data.
 * Returns slugs and labels for use in select options.
 * @returns An array of unique condition objects.
 */
export async function getUniqueConditions(): Promise<{value: string, label: string}[]> {
    const watches = await readAndTransformData(); // Use the new function
    const conditionsMap = new Map<string, string>(); // Use a Map to store slug -> original label

    watches.forEach(watch => {
        const label = watch.condition; // Use the simplified condition
        if (!label) return; // Skip if condition is undefined

        // Create a URL-friendly slug (e.g., "Used - Excellent" -> "used-excellent")
        const value = label.toLowerCase().replace(/\s+/g, '-');
        if (!conditionsMap.has(value)) {
            conditionsMap.set(value, label);
        }
    });

    // Convert map to array of objects and sort
    return Array.from(conditionsMap.entries())
        .map(([value, label]) => ({ value, label }))
        .sort((a, b) => a.label.localeCompare(b.label)); // Sort by original label
} 