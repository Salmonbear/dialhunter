'use client'; // Needs to be a client component for useState and event handlers
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link'; // Import Link from Next.js
// We can import a shared Header and Footer if they exist, or define them locally/later.
// import Header from './Header'; 
// import Footer from './Footer';

import watchDataJson from '../../data/watches.json'; // Corrected path from src/components

interface RawWatchProduct {
  productID: string;
  title: string;
  imageURLs?: string[];
  price?: string;
  specifications: {
    brand?: string;
    condition?: { [key: string]: string } | string;
    year?: string;
    [key: string]: any;
  };
  // other fields from your JSON...
}

const typedWatchData: { products: RawWatchProduct[] } = watchDataJson as { products: RawWatchProduct[] };

interface SearchResultItem {
  id: string;
  imageUrl?: string; 
  brandName: string;
  title: string;
  price?: string; 
  // Add other fields needed for filtering/display
  priceNumeric?: number; // For easier sorting/filtering
  year?: number;
  conditionSimple?: string; // A simplified condition string for filtering
}

const allWatchesMaster: SearchResultItem[] = typedWatchData.products.map(product => {
  let priceNumeric: number | undefined = undefined;
  if (product.price) {
    const cleanedPrice = product.price.replace(/[^\d.-]/g, ''); // Remove currency symbols, commas
    priceNumeric = parseFloat(cleanedPrice);
    if (isNaN(priceNumeric)) priceNumeric = undefined;
  }
  
  let year: number | undefined = undefined;
  if (product.specifications.year) {
    const yearMatch = product.specifications.year.match(/\d{4}/); // Extract 4-digit year
    if (yearMatch) year = parseInt(yearMatch[0]);
  }

  let conditionSimple = 'N/A';
  if (typeof product.specifications.condition === 'string') {
    conditionSimple = product.specifications.condition;
  } else if (typeof product.specifications.condition === 'object') {
    // Example: take the first value from condition object, or join them
    conditionSimple = Object.values(product.specifications.condition).join(', ');
  }

  return {
    id: product.productID,
    brandName: product.specifications.brand || 'N/A',
    title: product.title,
    imageUrl: product.imageURLs && product.imageURLs.length > 0 ? product.imageURLs[0] : 'https://via.placeholder.com/200x250?text=No+Image',
    price: product.price,
    priceNumeric: priceNumeric,
    year: year,
    conditionSimple: conditionSimple
  };
});

// Props for the SearchResultsPage, e.g., initial query or filters
interface SearchResultsPageProps {
  initialQuery?: string;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ initialQuery }) => {
  const platformName = "Dialhunter"; // Define platform name for consistency

  const [searchQuery, setSearchQuery] = useState(initialQuery || "");
  const [results, setResults] = useState<SearchResultItem[]>(allWatchesMaster);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [filterYear, setFilterYear] = useState<string>('');

  const uniqueBrands = useMemo(() => {
    const brands = new Set(allWatchesMaster.map(watch => watch.brandName));
    return Array.from(brands).sort();
  }, []);

  const uniqueConditions = useMemo(() => {
    // Simple way to get some condition keywords. This could be more sophisticated.
    const conditions = new Set<string>();
    allWatchesMaster.forEach(watch => {
        if(watch.conditionSimple) {
            // Example: split by common separators if it's a compound string, or use as is
            watch.conditionSimple.split(/[,.]\s*/).forEach(c => {
                if(c.trim().length > 2 && c.trim().length < 20) conditions.add(c.trim()); // Basic sanity check for keyword length
            })
        }
    });
    return Array.from(conditions).sort().slice(0, 10); // Limit for UI
  }, []);

  const applyFilters = () => {
    let filtered = allWatchesMaster;

    // Text search
    if (searchQuery) {
      filtered = filtered.filter(watch => 
        watch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        watch.brandName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(watch => selectedBrands.includes(watch.brandName));
    }

    // Price filter
    const minP = parseFloat(minPrice);
    const maxP = parseFloat(maxPrice);
    if (!isNaN(minP)) {
      filtered = filtered.filter(watch => watch.priceNumeric !== undefined && watch.priceNumeric >= minP);
    }
    if (!isNaN(maxP)) {
      filtered = filtered.filter(watch => watch.priceNumeric !== undefined && watch.priceNumeric <= maxP);
    }
    
    // Year filter
    const yearF = parseInt(filterYear);
    if (!isNaN(yearF) && yearF > 1000) { // Basic year validation
        filtered = filtered.filter(watch => watch.year === yearF);
    }

    // Condition filter (simple substring match for selected keywords)
    if (selectedConditions.length > 0) {
        filtered = filtered.filter(watch => 
            selectedConditions.some(cond => watch.conditionSimple?.toLowerCase().includes(cond.toLowerCase()))
        );
    }

    setResults(filtered);
    setCurrentPage(1); 
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBrands([]);
    setMinPrice('');
    setMaxPrice('');
    setFilterYear('');
    setSelectedConditions([]);
    setResults(allWatchesMaster);
    setCurrentPage(1);
  };

  useEffect(() => {
    // Re-apply filters if any filter state (excluding searchQuery itself for this example) changes
    // Or, you might prefer to only apply filters on explicit button click (current setup)
  }, [selectedBrands, minPrice, maxPrice, filterYear, selectedConditions]); 

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleConditionChange = (condition: string) => {
    setSelectedConditions(prev => 
        prev.includes(condition) ? prev.filter(c => c !== condition) : [...prev, condition]
    );
  };

  const totalPages = Math.ceil(results.length / itemsPerPage);
  const currentResults = results.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="search-results-page">
      <header className="main-header"> 
        <nav className="main-nav">
          <a href="/" className="logo">{platformName}</a> 
          <div className="nav-links">
            <a href="/brands">Brands</a>
            <a href="/pricing">Pricing</a> 
            <form onSubmit={(e) => { e.preventDefault(); applyFilters(); }} className="header-search-form">
              <input 
                type="search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search watches, brands..." 
                className="header-search-input" 
              />
              <button type="submit" className="header-search-button">Search</button>
            </form>
            {/* <a href="/gb" className="nav-link-country">GB ▼</a> Country selector might be different for watches */}
            <button className="nav-button-signin">Sign in</button>
            <button className="nav-button-signup">Sign up</button>
          </div>
        </nav>
      </header>

      <main className="search-content-area">
        <aside className="filters-sidebar">
          <div className="filter-actions-top">
            <h3>Filters</h3>
            <button onClick={clearFilters} className="clear-filters-button">Clear All</button>
          </div>
          
          <div className="filter-group">
            <h4>Brands</h4>
            {uniqueBrands.map(brand => (
              <label key={brand} className="filter-checkbox">
                <input 
                  type="checkbox" 
                  value={brand} 
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                /> {brand}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Price Range</h4>
            <div className="price-range-inputs">
              <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min price" />
              <span>-</span>
              <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max price" />
            </div>
          </div>

          <div className="filter-group">
            <h4>Year</h4>
            <input type="number" value={filterYear} onChange={(e) => setFilterYear(e.target.value)} placeholder="Enter year (e.g., 2020)" />
          </div>

          <div className="filter-group">
            <h4>Condition Keywords</h4>
            {uniqueConditions.map(cond => (
                <label key={cond} className="filter-checkbox">
                    <input 
                        type="checkbox" 
                        value={cond} 
                        checked={selectedConditions.includes(cond)}
                        onChange={() => handleConditionChange(cond)}
                    /> {cond}
                </label>
            ))}
          </div>
          
          <button onClick={applyFilters} className="apply-filters-button">Apply Filters</button>
        </aside>

        <section className="results-display-area">
          <div className="results-summary">
            <p>Showing {currentResults.length} of {results.length} listings for "{searchQuery || 'all watches'}"</p> 
          </div>

          <div className="results-grid">
            {currentResults.map(item => (
              <Link key={item.id} href={`/products/${item.id}`} passHref legacyBehavior>
                <a className="result-card-link">
                  <div className="result-card">
                    {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="result-card-image" />}
                    <div className="result-card-info">
                      <span className="result-card-brand">{item.brandName}</span>
                      {item.price && <span className="result-card-price">{item.price}</span>}
                    </div>
                    <h4 className="result-card-title">{item.title}</h4>
                  </div>
                </a>
              </Link>
            ))}
          </div>

          <div className="pagination-controls">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)}>&lt;</button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button 
                key={i} 
                className={currentPage === i + 1 ? 'active' : ''}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(c => c + 1)}>&gt;</button>
          </div>
        </section>
      </main>

      {/* Footer copied from WatchPlatformHomepage.tsx and adapted */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-column footer-about">
            <h3>{platformName}</h3>
            <p>The intelligent discovery engine for used and vintage luxury watches. We help you find deals with confidence and clarity.</p>
          </div>
          <div className="footer-column footer-links">
            <h4>Watch Types</h4>
            <ul>
              <li><a href="#">Vintage Classics</a></li>
              <li><a href="#">Neo-Vintage</a></li>
              <li><a href="#">Modern Pre-Owned</a></li>
              <li><a href="#">Dive Watches</a></li>
              <li><a href="#">Chronographs</a></li>
            </ul>
          </div>
          <div className="footer-column footer-links">
            <h4>Popular Brands</h4>
            <ul>
              <li><a href="#">All Brands</a></li>
              <li><a href="#">Rolex</a></li>
              <li><a href="#">Omega</a></li>
              <li><a href="#">Patek Philippe</a></li>
              <li><a href="#">Audemars Piguet</a></li>
            </ul>
          </div>
          <div className="footer-column footer-links">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
            </ul>
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} {platformName}. All rights reserved. Your trusted partner in watch discovery.</p>
        </div>
      </footer>

      {/* Basic Styling - In a real app, this would be in a separate CSS file */}
      <style jsx global>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          background-color: #f8f9fa;
          color: #333;
        }
        .search-results-page {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        /* Header Styles (Simplified) */
        .main-header {
          background-color: #fff;
          border-bottom: 1px solid #e0e0e0;
          padding: 10px 20px;
        }
        .main-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }
        .logo {
          font-weight: bold;
          font-size: 1.5em;
          text-decoration: none;
          color: #333;
        }
        .nav-links {
          display: flex;
          align-items: center;
        }
        .nav-links a, .nav-links button {
          margin-left: 15px;
          text-decoration: none;
          color: #555;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.9em;
        }
        .nav-links a:hover, .nav-links button:hover {
          color: #007bff;
        }
        .header-search-input {
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 0.9em;
          min-width: 250px; /* Give search input more space */
          margin-right: 5px;
        }
        .header-search-button {
          padding: 8px 15px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .header-search-button:hover {
          background-color: #0056b3;
        }
        .nav-button-signin, .nav-button-signup {
          padding: 8px 12px;
          border-radius: 4px;
        }
        .nav-button-signin {
          border: 1px solid #007bff;
          color: #007bff;
        }
        .nav-button-signup {
          background-color: #007bff;
          color: white;
        }

        /* Main Content Area */
        .search-content-area {
          display: flex;
          max-width: 1200px; 
          margin: 20px auto;
          padding: 0 20px;
          gap: 20px; 
          flex-grow: 1;
        }

        /* Filters Sidebar */
        .filters-sidebar {
          width: 250px; 
          background-color: #fff;
          padding: 15px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          height: fit-content; 
        }
        .filters-sidebar h3, .filters-sidebar h4 {
          margin-top: 0;
          margin-bottom: 10px;
        }
        .filters-sidebar h4 { font-size: 0.9em; color: #555; }
        .filter-group {
          margin-bottom: 20px;
          border-bottom: 1px solid #eee;
          padding-bottom: 15px;
        }
        .filter-group:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .filter-group button, .filter-group select, .filter-group input[type="date"] {
          width: 100%;
          padding: 8px;
          margin-bottom: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 0.9em;
        }
        .filter-group .date-inputs { display: flex; gap: 5px; margin-bottom: 5px; }
        .filter-group small { font-size: 0.8em; color: #777; display: block; margin-top: 5px; }
        .filter-checkbox {
          display: block;
          margin-bottom: 5px;
          font-size: 0.9em;
        }
        .save-search-button {
          width: 100%;
          padding: 10px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        .save-search-button:hover { background-color: #218838; }


        /* Results Display Area */
        .results-display-area {
          flex-grow: 1; 
        }
        .results-summary {
          margin-bottom: 15px;
          font-size: 0.9em;
          color: #555;
        }
        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
          gap: 20px;
        }
        .result-card-link {
          text-decoration: none; /* Remove underline from link */
          color: inherit; /* Inherit text color */
          display: block; /* Make the link a block to contain the card */
        }
        .result-card {
          background-color: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          overflow: hidden; 
          transition: box-shadow 0.2s ease-in-out;
        }
        .result-card:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .result-card-image {
          width: 100%;
          height: 250px; 
          object-fit: cover; 
          display: block;
        }
        .result-card-info {
          padding: 10px;
          font-size: 0.8em;
          color: #777;
          display: flex;
          justify-content: space-between;
        }
        .result-card-price {
            font-weight: bold;
            color: #333;
        }
        .result-card-title {
          font-size: 0.9em;
          font-weight: normal; 
          color: #333;
          padding: 0 10px 10px 10px;
          margin: 0;
          min-height: 40px; 
        }

        /* Pagination */
        .pagination-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 30px;
          padding: 10px 0;
        }
        .pagination-controls button {
          background: #fff;
          border: 1px solid #ccc;
          padding: 8px 12px;
          margin: 0 3px;
          cursor: pointer;
          border-radius: 4px;
        }
        .pagination-controls button:hover {
          background-color: #f0f0f0;
        }
        .pagination-controls button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
        .pagination-controls button.active {
          background-color: #007bff;
          color: white;
          border-color: #007bff;
        }

        /* Footer Styles (Simplified) - These should align with WatchPlatformHomepage or be shared */
        .main-footer {
          background-color: #fff; 
          color: #555; 
          padding: 30px 20px;
          border-top: 1px solid #e0e0e0;
          font-size: 0.9em;
        }
        .footer-content {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap; 
          max-width: 1200px;
          margin: 0 auto;
          gap: 20px;
        }
        .footer-column {
          flex: 1;
          min-width: 180px; 
          margin-bottom: 20px; 
        }
        .footer-column.footer-about p {
            font-size: 0.9em; /* Matching WatchPlatformHomepage */
            line-height: 1.6;
        }
        .footer-column h3 {
          font-size: 1.2em;
          margin-bottom: 10px;
          color: #333;
        }
        .footer-column h4 {
          font-size: 1em;
          margin-top: 0; /* Adjusted from 15px to align better if it's the first element after h3 or for grouped links */
          margin-bottom: 8px;
          color: #333;
        }
        .footer-column ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-column ul li a {
          color: #555;
          text-decoration: none;
          line-height: 1.8;
        }
        .footer-column ul li a:hover {
          text-decoration: underline;
          color: #007bff;
        }
        .footer-copyright {
          text-align: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eee; 
          font-size: 0.85em;
          color: #777;
        }
        
        /* Responsive adjustments (very basic) */
        @media (max-width: 768px) {
          .search-content-area {
            flex-direction: column;
          }
          .filters-sidebar {
            width: 100%;
            margin-bottom: 20px;
          }
          .results-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }
          .nav-links .header-search-form { display: none; } 
        }

        .filter-actions-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .filter-actions-top h3 { margin: 0; }
        .clear-filters-button {
          background: none; border: none; color: #007bff; cursor: pointer; font-size: 0.85em; padding: 5px;
        }
        .clear-filters-button:hover { text-decoration: underline; }
        .filters-sidebar input[type="number"] {
          width: 100%; padding: 8px; margin-bottom: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 0.9em;
        }
        .price-range-inputs {
          display: flex; align-items: center; gap: 5px;
        }
        .price-range-inputs span { margin: 0 5px; }
        .apply-filters-button {
          width: 100%; padding: 10px; background-color: #007bff; color: white;
          border: none; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 10px;
        }
        .apply-filters-button:hover { background-color: #0056b3; }
        /* Ensure enough specificity or remove conflicting styles for .filter-group button if any */

      `}</style>
    </div>
  );
};

export default SearchResultsPage; 