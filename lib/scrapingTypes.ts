// Types related to scraping

// Selectors needed for scraping an SRP
export interface SrpSelectors {
  productListItem: string; 
  title: string;         
  price: string;         
  link: string;          
  imageUrl: string;      
  imageAttribute?: string; 
}

// Basic info extracted from each item on an SRP
export interface SrpProductInfo {
  title: string | null;
  price: string | null;
  link: string | null; 
  imageUrl: string | null;
}

// Selectors needed for scraping a PDP
export interface PdpSelectors {
  title: string;
  price: string;
  description: string;   
  specificationsTable: string; 
  specRowKey: string;    
  specRowValue: string;  
  mainImage: string;     
  imageAttribute?: string;
  sku?: string;          
}

// Detailed info extracted from a PDP
export interface PdpProductDetails {
  title: string | null;
  price: string | null;
  description: string | null;
  specifications: { [key: string]: string };
  mainImageUrl: string | null;
  sku: string | null; 
} 