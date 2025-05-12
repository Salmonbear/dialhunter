import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Watch } from "@/interfaces/Watch"; // Import Watch interface
import { getAllWatches } from "@/lib/data"; // Import the real fetch function

// Helper functions (can be shared)
const formatPrice = (price: number, currency: string) => {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency, minimumFractionDigits: 0 }).format(price);
}

const getConditionClass = (condition: string) => {
    switch (condition.toLowerCase()) {
        case 'new': return 'new';
        case 'used - excellent': return 'used-excellent';
        case 'used - good': return 'used-good';
        default: return '';
    }
}

export default async function Home() {
  // Fetch all watches, but only take the first 4 for the featured section
  const allWatches: Watch[] = await getAllWatches();
  const featuredWatches = allWatches.slice(0, 4);

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <h1>Find Your Next Luxury Timepiece</h1>
          <p>Search thousands of pre-owned luxury watches from trusted sellers worldwide.</p>
          <form className="search-bar" action="/search-results" method="GET">
            <input type="search" name="query" placeholder="Search by brand, model, or reference..." />
            <button type="submit" className="button-primary">Search</button>
          </form>
        </section>

        <section className="featured-watches">
          <h2>Featured Watches from Trusted Retailers</h2>
          <div className="watch-grid">
            {featuredWatches.map((watch) => (
              // Link the card to the product page
              <Link key={watch.id} href={`/products/${watch.id}`} className="watch-card">
                <Image
                  src={watch.image}
                  alt={`${watch.brand} ${watch.model}`}
                  width={300}
                  height={225}
                  style={{ objectFit: "cover" }}
                />
                <h3>{watch.brand}</h3>
                <p>{watch.model}</p>
                <span className={`condition ${getConditionClass(watch.condition)}`}>
                  {watch.condition}
                </span>
                 {/* Use watch.currency for formatting */}
                <p className="price">{formatPrice(watch.price, watch.currency)}</p>
              </Link>
            ))}
          </div>
          <Link href="/search" className="view-all">
            View All Watches
          </Link>
          <p className="secure-info">🔒 Secure listings from verified sellers</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
