// Define the structure of a Watch object

export interface Watch {
  id: number;
  brand: string;
  model: string;
  reference?: string; // Optional field
  price: number;
  currency: string;
  condition: string;
  year?: number; // Optional field
  case_material?: string; // Optional field
  case_diameter?: string; // Optional field
  movement?: string; // Optional field
  description?: string; // Optional field
  image: string;
  listingSource?: string; // Optional field
  dealerName?: string; // Optional field
  dealerURL?: string; // Optional field
} 