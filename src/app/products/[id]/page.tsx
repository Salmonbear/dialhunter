import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Watch } from "@/interfaces/Watch";
import { notFound } from 'next/navigation';
import { getWatchById } from "@/lib/data"; // Import the real fetch function

// Helper function for price formatting (could be shared)
const formatPrice = (price: number, currency: string) => {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency, minimumFractionDigits: 0 }).format(price);
}

// Define component props including params
interface ProductPageProps {
  params: { id: string };
}

// Generate dynamic metadata (optional but good for SEO)
export async function generateMetadata({ params }: ProductPageProps) {
  // Use the real fetch function here too
  const watch = await getWatchById(params.id);
  if (!watch) {
    return { title: 'Watch Not Found' };
  }
  return {
    title: `${watch.brand} ${watch.model} - DialHunter`,
    description: watch.description || `Details for ${watch.brand} ${watch.model}`,
  };
}

// Product Page Component
export default async function ProductPage({ params }: ProductPageProps) {
  // Use the real fetch function
  const watch = await getWatchById(params.id);

  // If watch not found, show 404 page
  if (!watch) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="product-page">
        <div className="product-image">
          <Image
            src={watch.image}
            alt={`${watch.brand} ${watch.model}`}
            width={600} // Adjust width as needed
            height={600} // Adjust height for 1:1 ratio
            priority // Prioritize loading main product image
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="product-details">
          <h1>{watch.brand}</h1>
          <h2>{watch.model}</h2>
          {watch.reference && <p className="reference">Ref: {watch.reference}</p>}

          <hr />

          <h3><span className="icon">ⓘ</span> Details</h3>
          <ul className="details-list">
            <li><span>Condition:</span> <strong>{watch.condition}</strong></li>
            {watch.year && <li><span>Year:</span> <strong>{watch.year}</strong></li>}
            {watch.case_material && <li><span>Case Material:</span> <strong>{watch.case_material}</strong></li>}
            {watch.case_diameter && <li><span>Case Diameter:</span> <strong>{watch.case_diameter}</strong></li>}
            {watch.movement && <li><span>Movement:</span> <strong>{watch.movement}</strong></li>}
             {watch.listingSource && <li><span>Source:</span> <strong>{watch.listingSource}</strong></li>}
             {watch.dealerName && <li><span>Dealer:</span> <strong>{watch.dealerName}</strong></li>}
          </ul>

          {watch.description && (
            <>
              <hr />
              <h3><span className="icon">📄</span> Description</h3>
              <p>{watch.description}</p>
            </>
          )}

          <div className="price-contact">
            <p className="price">{formatPrice(watch.price, watch.currency)}</p>
             {/* Link to dealer URL if available, otherwise just a button */}
            {watch.dealerURL && watch.dealerURL !== '#' ? (
                <Link href={watch.dealerURL} target="_blank" rel="noopener noreferrer" className="contact-seller">
                    Contact Seller / Make Offer
                </Link>
            ) : (
                <button className="contact-seller">Contact Seller / Make Offer</button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 