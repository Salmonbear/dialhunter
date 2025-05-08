import React from 'react';

// Define Props for sub-components if they were separate, for now inline
// interface FeatureItemProps {
//   title: string;
//   description: string;
// }

// interface FeatureSectionProps {
//   title: string;
//   subtitle?: string;
//   items: FeatureItemProps[];
//   imageSrc?: string;
//   imageAlt?: string;
//   layout?: 'image-left' | 'image-right';
//   bgColor?: string;
// }

const WatchPlatformHomepage: React.FC = () => {
  const platformName = "Dialhunter";

  return (
    <div className="watch-platform-homepage">
      {/* Header */}
      <header className="main-header">
        <nav className="main-nav">
          <a href="/" className="logo">{platformName}</a>
          <div className="nav-links">
            <a href="/discover">Discover Deals</a>
            <a href="/pricing">Market Insights</a>
            <input type="search" placeholder={`Search Rolex, Omega...`} className="nav-search-input" />
            <button className="nav-button-save-search">Save Search</button>
            <button className="nav-button-alerts">Get Alerts</button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              <span>Find & Compare</span> Deals on Pre-Owned Luxury Watches.
            </h1>
            <p>
              We scan and analyze thousands of listings daily from the fragmented resale market, bringing you transparency and confidence to discover undervalued timepieces.
            </p>
            <div className="hero-search">
              <input type="search" placeholder="E.g., Rolex Submariner 16610, Omega Speedmaster..." />
              <button>Search Watches</button>
            </div>
          </div>
          <div className="hero-image-grid">
            {/* Placeholder for dynamic grid of watch images */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="hero-image-item">
                {/* Replace with actual watch image thumbnails */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Watch image placeholder {i+1}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Brands Section */}
      <section className="trusted-brands-section">
        <div className="trusted-brands-content">
          <h3>DISCOVER DEALS FROM TOP LUXURY BRANDS</h3>
          <div className="brand-logos">
            {['ROLEX', 'PATEK PHILIPPE', 'OMEGA', 'AUDEMARS PIGUET', 'CARTIER', 'IWC'].map(brand => (
              <span key={brand} className="brand-logo-item">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section 1 */}
      <section className="feature-section-one">
        <div className="feature-content-one">
          <div className="feature-visual-one">
            <p>[Visual: Cleaned & Aggregated Watch Listings UI]</p>
          </div>
          <div className="feature-text-one">
            <h2>
              Your <span>AI-Powered Deal Scanner.</span> Cut Through the Noise.
            </h2>
            <p>
              {platformName} automatically gathers, cleans, and standardizes listings from numerous sources. Our AI helps identify true value and surfaces opportunities you might otherwise miss.
            </p>
            <ul className="feature-list">
              <li><span className="checkmark">✔</span> AI-Cleaned & Verified Listing Data</li>
              <li><span className="checkmark">✔</span> Comprehensive Cross-Platform Deal Comparison</li>
              <li><span className="checkmark">✔</span> Real-time Price & Availability Alerts</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Section 2 */}
      <section className="feature-section-two">
        <div className="feature-content-two">
          <div className="feature-text-two">
            <h3>FOR COLLECTORS, VALUE BUYERS & ENTHUSIASTS</h3>
            <h2>Uncover Hidden Gems & Rare Finds With Confidence</h2>
            <p>Access an extensive, curated database of used and vintage watches. Our advanced filters (condition, box/papers, year, rarity signals) and proprietary Deal Score (e.g., Fair, Good, Under Market) empower you to pinpoint your desired timepiece and purchase with trust.</p>
            <ul className="feature-list">
              <li><span className="checkmark">✔</span> Proprietary Deal Scoring (Fair, Good, Under Market)</li>
              <li><span className="checkmark">✔</span> Advanced Vintage, Condition & Provenance Filters</li>
              <li><span className="checkmark">✔</span> Track Specific References & Get Instant Alerts</li>
            </ul>
          </div>
          <div className="feature-visual-two">
            <p>[Visual: Watch Detail Page with Deal Score & Filters]</p>
          </div>
        </div>
      </section>

      {/* Feature Section 3 */}
      <section className="feature-section-three">
        <div className="feature-content-three">
          <div className="feature-visual-three">
            <p>[Visual: Personalized Alerts & Market Insights Dashboard]</p>
          </div>
          <div className="feature-text-three">
            <h3>FOR FLIPPERS & SEMI-PROS</h3>
            <h2>Gain a Market Edge. Act Faster.</h2>
            <p>Get privileged access to newly listed deals and undervalued pieces. {platformName} helps you analyze short-term market movements and identify profitable opportunities before the crowd.</p>
            <ul className="feature-list">
              <li><span className="checkmark">✔</span> First-Access Deal Alerts (Email, Push, SMS options)</li>
              <li><span className="checkmark">✔</span> Identify Undervalued Configurations & Seller Fatigue Signals</li>
              <li><span className="checkmark">✔</span> Monitor Cross-Market Arbitrage Opportunities</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Content Showcase Section */}
      <section className="content-showcase-section">
        <div className="showcase-content">
          <h2>Today's Top Deals & Recently Spotted Steals</h2>
          <p>Our AI constantly scans the market. Here are some of the latest finds that stand out.</p>
          <div className="filter-buttons">
            {['UNDER MARKET', 'GOOD DEALS', 'VINTAGE GEMS', 'ROLEX', 'OMEGA', 'PATEK PHILIPPE'].map(filter => (
              <button key={filter} className="filter-button">{filter}</button>
            ))}
          </div>
          <div className="watch-card-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="watch-card">
                <div className="watch-card-image">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="watch-card-details">
                  <div className="watch-card-header">
                    <h4>Watch Model Name {i+1}</h4>
                    <span className={`deal-score deal-score-${i%3 === 0 ? 'undermarket' : i%3 === 1 ? 'good' : 'fair'}`}>
                      {i%3 === 0 ? 'UNDER MARKET' : i%3 === 1 ? 'GOOD DEAL' : 'FAIR PRICE'}
                    </span>
                  </div>
                  <p className="watch-card-brand-ref">Brand Name - Ref. XXXX</p>
                  <p className="watch-card-price">$ {Math.floor(Math.random() * 10000 + 1000)}</p>
                  <p className="watch-card-source">Source: Chrono24 Listing</p>
                </div>
              </div>
            ))}
          </div>
          <div className="showcase-actions">
            <button className="button-primary">Explore All Deals</button>
            <a href="/pricing" className="link-secondary">View Pro Plans</a>
          </div>
        </div>
      </section>

      {/* Upgrade/Pro Section */}
      <section className="pro-features-section">
        <div className="pro-features-content">
          <h2>Upgrade Your Hunt with {platformName} Pro</h2>
          <p>Unlock powerful tools and gain an unfair advantage in the luxury watch market.</p>
          <div className="pro-feature-grid">
            {[
              { title: "Full Historical Listing Archive", description: "Access millions of past listings for deep market research and price validation." },
              { title: "Advanced Deal Filters & Scoring Logic", description: "Fine-tune discovery with customizable parameters and deeper scoring insights." },
              { title: "Unlimited Saved Searches & Instant Alerts", description: "Never miss a deal with priority notifications across multiple channels." },
              { title: "In-Depth Market Trend Analytics", description: "Understand pricing history, model popularity, and investment potential over time." },
              { title: "Personalized Deal Dashboards & Watchlists", description: "Organize, track, and manage your targeted watches and searches efficiently." },
              { title: "Early Access to New Features & Data Sources", description: "Be the first to benefit from our latest platform innovations and integrations." },
            ].map(feature => (
              <div key={feature.title} className="pro-feature-card">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="pro-features-action">
            <button className="button-primary">Upgrade to Pro</button>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="final-cta-section">
        <div className="cta-content">
          <h2>Stop Missing Deals. Start Your {platformName} Today.</h2>
          <p>
            Get the clarity and confidence to navigate the pre-owned luxury watch market. Sign up for free deal alerts and discover your next timepiece with an edge.
          </p>
          <button className="button-primary-inverted">Get Started with Free Alerts</button>
          <a href="/pricing" className="link-secondary-inverted">See Pro Plans →</a>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
};

export default WatchPlatformHomepage; 
