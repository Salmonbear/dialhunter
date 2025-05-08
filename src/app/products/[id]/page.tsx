'use client'; // Mark as Client Component due to styled-jsx
import { notFound } from 'next/navigation';
import Link from 'next/link'; // Import Link
import WatchProductDisplay_COMPONENT from '@/components/WatchProductDisplay';
import Header_COMPONENT from '@/components/Header'; // Assuming a shared Header component exists
import Footer_COMPONENT from '@/components/Footer'; // Assuming a shared Footer component exists
// Adjust path to be relative from the src directory, or ensure tsconfig paths handle @/data/
import watchDataJson from '../../../../data/watches.json'; // Corrected path

interface RawWatchProduct {
  supplierURL?: string;
  imageURLs?: string[];
  title: string;
  price?: string;
  availability?: string;
  description?: string;
  productID: string;
  categories?: string[];
  tags?: string[];
  specifications: {
    gender?: string;
    condition?: { [key: string]: string } | string;
    brand?: string; // Added brand here as it's in specifications in the JSON
    model?: string;
    year?: string;
    box?: string;
    papers?: string;
    case_material?: string;
    case_size?: string;
    bracelet_material?: string;
    dial?: string;
    movement?: string;
    [key: string]: any;
  };
}

interface WatchProduct {
  id: string;
  title: string;
  brandName: string;
  price?: string;
  imageUrl?: string;
  description?: string;
  specifications?: RawWatchProduct['specifications']; // Use the same type
  imageURLs?: string[];
  supplierURL?: string;
}

const typedWatchData: { products: RawWatchProduct[] } = watchDataJson as { products: RawWatchProduct[] };

async function getWatchById(id: string): Promise<WatchProduct | null> {
  const product = typedWatchData.products.find((p: RawWatchProduct) => p.productID === id); // Added type for p
  if (!product) {
    return null;
  }
  return {
    id: product.productID,
    title: product.title,
    brandName: product.specifications.brand || 'N/A', 
    price: product.price,
    imageUrl: product.imageURLs && product.imageURLs.length > 0 ? product.imageURLs[0] : undefined,
    description: product.description,
    specifications: product.specifications,
    imageURLs: product.imageURLs,
    supplierURL: product.supplierURL
  };
}

interface ProductPageProps {
  params: {
    id: string; 
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const watch = await getWatchById(params.id);

  if (!watch) {
    notFound(); 
  }

  return (
    <>
      <Header_COMPONENT />
      <main className="product-page-container">
        <div className="back-to-results-link-container">
          <Link href="/search-results" className="back-to-results-link">
            &larr; Back to results
          </Link>
        </div>
        <WatchProductDisplay_COMPONENT watch={watch} />
      </main>
      <Footer_COMPONENT />
      <style jsx global>{`
        .product-page-container {
          /* You might want to add some overall padding or max-width here if not handled by individual components */
        }
        .back-to-results-link-container {
          max-width: 1000px; /* Align with WatchProductDisplay max-width */
          margin: 0 auto; /* Center it if content is narrower */
          padding: 15px 15px 0px 15px; /* Padding around the link, none at bottom */
        }
        .back-to-results-link {
          display: inline-block;
          margin-bottom: 10px; /* Space below the link */
          color: #007bff;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95em;
        }
        .back-to-results-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
}

// Optional: If you want to pre-render these pages at build time (Static Site Generation - SSG)
// export async function generateStaticParams() {
//   const products = typedWatchData.products;
//   return products.map(product => ({
//     id: product.productID,
//   }));
// } 