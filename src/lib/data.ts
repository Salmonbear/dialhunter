import fs from 'fs/promises';
import path from 'path';
import { Watch } from '@/interfaces/Watch';

// Get the full path to the JSON file
const dataFilePath = path.join(process.cwd(), 'public', 'watches.json');

/**
 * Reads and parses the watches.json file.
 * Caching isn't implemented here, but Next.js might cache 
 * the result automatically depending on how it's used (e.g., in Server Components).
 */
async function readData(): Promise<Watch[]> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const data = JSON.parse(fileContent);
    // Basic validation (check if it's an array)
    if (!Array.isArray(data)) {
        console.error('Error: watches.json does not contain a valid JSON array.');
        return [];
    }
    return data as Watch[];
  } catch (error) {
    console.error('Error reading or parsing watches.json:', error);
    return []; // Return empty array on error
  }
}

/**
 * Fetches all watches from the JSON file.
 */
export async function getAllWatches(): Promise<Watch[]> {
  return await readData();
}

/**
 * Fetches a single watch by its ID.
 * @param id The ID of the watch to fetch.
 * @returns The watch object or null if not found.
 */
export async function getWatchById(id: string | number): Promise<Watch | null> {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  if (isNaN(numericId)) {
    return null; // Invalid ID format
  }

  const allWatches = await readData();
  const watch = allWatches.find(w => w.id === numericId);
  return watch || null;
}

// --- Filtering Logic ---

// Define filter criteria interface
interface FilterCriteria {
  query?: string;
  brand?: string;
  condition?: string;
  priceMax?: number;
  // Add other potential filters like minPrice, year, etc.
}

/**
 * Fetches watches based on filter criteria.
 * @param filters Object containing filter keys and values.
 * @returns An array of filtered watch objects.
 */
export async function getFilteredWatches(filters: FilterCriteria): Promise<Watch[]> {
  let watches = await readData();

  // Apply text query filter (searches brand, model, reference, description)
  if (filters.query) {
    const queryLower = filters.query.toLowerCase();
    watches = watches.filter(watch =>
      watch.brand.toLowerCase().includes(queryLower) ||
      watch.model.toLowerCase().includes(queryLower) ||
      (watch.reference && watch.reference.toLowerCase().includes(queryLower)) ||
      (watch.description && watch.description.toLowerCase().includes(queryLower))
    );
  }

  // Apply brand filter
  if (filters.brand) {
    watches = watches.filter(watch => watch.brand.toLowerCase() === filters.brand?.toLowerCase());
  }

  // Apply condition filter
  if (filters.condition) {
      // Convert stored condition to a comparable format if needed, e.g., slug
      const normalizeCondition = (cond: string) => cond.toLowerCase().replace(/\s+/g, '-');
      watches = watches.filter(watch => normalizeCondition(watch.condition) === filters.condition?.toLowerCase());
  }

  // Apply max price filter
  if (filters.priceMax) {
    watches = watches.filter(watch => watch.price <= filters.priceMax!); // Non-null assertion ok due to check
  }

  // Add more filters here as needed...

  return watches;
}

// --- Data Aggregation ---

/**
 * Extracts unique brand names from the watch data.
 * @returns An array of unique brand strings.
 */
export async function getUniqueBrands(): Promise<string[]> {
  const watches = await readData();
  const brands = new Set(watches.map(watch => watch.brand));
  return Array.from(brands).sort(); // Sort alphabetically
}

/**
 * Extracts unique condition values from the watch data.
 * Returns slugs for use in select options.
 * @returns An array of unique condition strings (slugified).
 */
export async function getUniqueConditions(): Promise<{value: string, label: string}[]> {
    const watches = await readData();
    const conditionsMap = new Map<string, string>(); // Use a Map to store slug -> original label

    watches.forEach(watch => {
        const label = watch.condition;
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