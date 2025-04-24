import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Watch } from "@/interfaces/Watch";
import { getFilteredWatches, getUniqueBrands, getUniqueConditions } from "@/lib/data";

// Helper functions (consider moving to a utils file later)
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

// Define component props including searchParams
interface SearchPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Search Page Component
export default async function SearchPage({ searchParams }: SearchPageProps) {

  // Extract filter values from searchParams
  const query = typeof searchParams?.query === 'string' ? searchParams.query : undefined;
  const brand = typeof searchParams?.brand === 'string' ? searchParams.brand : undefined;
  const condition = typeof searchParams?.condition === 'string' ? searchParams.condition : undefined;
  const priceMax = typeof searchParams?.priceMax === 'string' ? parseInt(searchParams.priceMax, 10) : undefined;

  // Fetch filtered watches and unique filter options concurrently
  const [searchResults, uniqueBrands, uniqueConditions] = await Promise.all([
    getFilteredWatches({
      query,
      brand,
      condition,
      priceMax: isNaN(priceMax as number) ? undefined : priceMax,
    }),
    getUniqueBrands(),
    getUniqueConditions()
  ]);

  return (
    <>
      <Header />
      <main>
        <h1>Search Watches</h1>
        <div className="search-page">
          <aside className="filters">
            <h2>
              <span className="filter-icon">▼</span> Filters
              {/* Link to clear filters - reset search params */}
              <Link href="/search" className="clear-all">Clear All</Link>
            </h2>

            {/* --- Filters --- */}
            {/* Use GET method for form submission to update URL search params */}
            <form method="GET" action="/search">
              <div className="filter-group">
                <label htmlFor="search-term">Search</label>
                {/* Set defaultValue from searchParams */}
                <input type="search" id="search-term" name="query" defaultValue={query || ''} />
              </div>

              <div className="filter-group">
                <label htmlFor="brand">Brand</label>
                <select id="brand" name="brand" defaultValue={brand || ''}>
                  <option value="">All Brands</option>
                   {/* Dynamically generate brand options */}
                  {uniqueBrands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group price-range">
                <label htmlFor="priceMax">Price Range (Max)</label> {/* Added htmlFor */} 
                <div className="range-values">
                  <span>£0</span>
                  {/* Display current max price dynamically */}
                  <span>{priceMax ? formatPrice(priceMax, 'GBP') : '£200,000+'}</span>
                </div>
                {/* Set defaultValue from searchParams */}
                <input
                  type="range"
                  id="priceMax" // Added id
                  min="0"
                  max="200000" // Adjust max as needed
                  step="1000" // Added step for better control
                  defaultValue={priceMax || 200000} // Default to max if not set
                  className="slider"
                  name="priceMax"
                />
              </div>

              <div className="filter-group">
                <label htmlFor="condition">Condition</label>
                <select id="condition" name="condition" defaultValue={condition || ''}>
                  <option value="">All Conditions</option>
                  {/* Dynamically generate condition options */}
                  {uniqueConditions.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Button to trigger form submission (GET request) */}
              <button type="submit">Apply Filters</button>
            </form>
          </aside>

          <section className="search-results">
            <div className="watch-grid">
              {searchResults.length > 0 ? (
                searchResults.map((watch) => (
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
                    <p className="price">{formatPrice(watch.price, watch.currency)}</p>
                  </Link>
                ))
              ) : (
                <p>No watches found matching your criteria.</p>
              )}
            </div>
            {/* Add pagination controls later if needed */}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
} 