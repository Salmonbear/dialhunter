'use client'; // Mark as a Client Component due to styled-jsx
import React, { useState } from 'react';

// Assume an icon component or SVG imports for ✅, 👍, 👎, 🛡️ (warranty), 🔄 (returns), ⭐ (rating)
// For now, using text placeholders like [icon]

interface WatchProduct {
  id: string;
  title: string;
  brandName: string;
  price?: string;
  imageUrl?: string;
  description?: string;
  specifications?: {
    gender?: string;
    condition?: { [key: string]: string } | string;
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
  imageURLs?: string[];
  supplierURL?: string;

  // MVP Fields from new image context
  price_delta_text?: string; // e.g., "Fair -3% vs 6-mo median"
  has_seller_warranty?: boolean;
  warranty_details?: string; // e.g., "12-mo warranty"
  return_policy_summary?: string; // e.g., "14-day returns"
  seller_rating_summary?: string; // e.g., "4.8 ⭐"
}

interface WatchProductDisplayProps {
  watch: WatchProduct | null;
}

const WatchProductDisplay: React.FC<WatchProductDisplayProps> = ({ watch }) => {
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<'helpful' | 'not_helpful' | null>(null);

  if (!watch) {
    return <p>Watch not found.</p>;
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email for under-market alert:', email);
    setEmailSubmitted(true);
    setEmail('');
    setTimeout(() => setEmailSubmitted(false), 3000); 
  };

  const handleFeedback = (type: 'helpful' | 'not_helpful') => {
    setFeedback(type);
    console.log('Price score feedback:', type);
  };

  const getConditionChips = () => {
    if (!watch.specifications || !watch.specifications.condition) return [];
    const condition = watch.specifications.condition;
    if (typeof condition === 'string') return [condition];
    if (typeof condition === 'object') {
      return Object.values(condition).slice(0, 3); // Max 3 chips from condition object
    }
    return [];
  };
  const conditionChips = getConditionChips();

  // Placeholder data merging for UI development, based on new image
  const displayWatch = {
    ...watch,
    price_delta_text: watch.price_delta_text || "Fair -3% vs 6-mo median",
    has_seller_warranty: watch.has_seller_warranty === undefined ? true : watch.has_seller_warranty,
    warranty_details: watch.warranty_details || "12-mo warranty",
    // Example: Constructing a more iconic seller trust summary
    // In a real app, this logic or data structure might be more robust.
    seller_trust_items: [
        watch.warranty_details || "12-mo warranty",
        watch.return_policy_summary || "14-day returns",
        watch.seller_rating_summary || "4.8 ⭐ (100+)"
    ].filter(Boolean)
  };

  const keySpecs = [
    { label: "Model", value: displayWatch.specifications?.model },
    { label: "Year", value: displayWatch.specifications?.year },
    { label: "Case Material", value: displayWatch.specifications?.case_material },
    { label: "Case Size", value: displayWatch.specifications?.case_size },
    { label: "Movement", value: displayWatch.specifications?.movement },
    { label: "Dial", value: displayWatch.specifications?.dial }
  ].filter(spec => spec.value); // Only include specs that have a value

  return (
    <div className="watch-product-page-mvp">
      <div className="product-main-content">
        <div className="product-image-gallery">
          {displayWatch.imageURLs && displayWatch.imageURLs.length > 0 ? (
            <img src={displayWatch.imageURLs[0]} alt={displayWatch.title} className="main-product-image" />
          ) : displayWatch.imageUrl ? (
            <img src={displayWatch.imageUrl} alt={displayWatch.title} className="main-product-image" />
          ) : (
            <div className="image-placeholder">No Image Available</div>
          )}
          {conditionChips.length > 0 && (
            <div className="condition-chips-strip">
              {conditionChips.map((chip, index) => (
                <span key={index} className="condition-chip">{chip}</span>
              ))}
            </div>
          )}
        </div>

        <div className="product-info-column">
          <h1>{displayWatch.title}</h1>
          <h2>{displayWatch.brandName}</h2>
          
          {displayWatch.price && <p className="product-price">{displayWatch.price}</p>}

          {displayWatch.supplierURL && 
            <a href={displayWatch.supplierURL} target="_blank" rel="noopener noreferrer" className="view-listing-button">
                View Listing on Source
            </a>
          }

          {/* Key Specifications Section */}
          {keySpecs.length > 0 && (
            <div className="key-specs-section">
              <h3>At a Glance</h3>
              <ul className="key-specs-list">
                {keySpecs.map(spec => (
                  <li key={spec.label} className="key-spec-item">
                    <span className="key-spec-label">{spec.label}:</span>
                    <span className="key-spec-value">{String(spec.value)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Priority 1: Confidence badge + price delta UNDER price */}
          <div className="confidence-section">
            {displayWatch.price_delta_text && (
              <div className="confidence-badge">
                {displayWatch.price_delta_text}
                {displayWatch.has_seller_warranty && <span className="warranty-check"> ✅</span>}
              </div>
            )}

            {/* Priority 5: Feedback widget UNDER badge */}
            <div className="feedback-widget-inline">
              <span>Helpful?</span>
              <button onClick={() => handleFeedback('helpful')} className={`thumb-btn ${feedback === 'helpful' ? 'selected' : ''}`} aria-label="Helpful">
                👍
              </button>
              <button onClick={() => handleFeedback('not_helpful')} className={`thumb-btn ${feedback === 'not_helpful' ? 'selected' : ''}`} aria-label="Not helpful">
                👎
              </button>
            </div>
          </div>
          
          {/* Priority 2: Email capture inline UNDER badge (and feedback) */}
          <div className="email-capture-inline">
            {emailSubmitted ? (
              <p className="email-success-message">Thanks! We'll notify you.</p>
            ) : (
              <form onSubmit={handleEmailSubmit} className="email-form-inline">
                <label htmlFor="email-alert-input" className="email-form-label">Want alerts when similar 'Fair/Better' {displayWatch.brandName}s drop? Enter email.</label>
                <div className="email-input-group">
                  <input 
                    id="email-alert-input"
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required 
                  />
                  <button type="submit">Notify Me</button>
                </div>
              </form>
            )}
          </div>

          {/* Priority 3: Seller Trust Summary (3-icon strip) */}
          {displayWatch.seller_trust_items.length > 0 && (
            <div className="seller-trust-summary">
              {displayWatch.seller_trust_items.map((item, index) => (
                <span key={index} className="trust-item">
                  {/* Placeholder for icons. E.g., item.includes('warranty') ? '🛡️' : '' */} 
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .watch-product-page-mvp {
          max-width: 1000px; margin: 0 auto; padding: 15px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #333;
        }
        .product-main-content {
          display: flex; gap: 25px; margin-bottom: 20px;
        }
        .product-image-gallery {
          flex: 0 0 50%; /* Approx 50% width */
          max-width: 450px;
        }
        .main-product-image {
          width: 100%; border-radius: 6px; border: 1px solid #e0e0e0;
          display: block; /* Remove extra space below image */
        }
        .image-placeholder { width: 100%; height: 400px; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 6px; color: #777;}
        
        .condition-chips-strip {
          display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px;
        }
        .condition-chip {
          background-color: #f0f0f0; color: #555; padding: 5px 10px;
          border-radius: 15px; font-size: 0.8em; white-space: nowrap;
        }

        .product-info-column {
          flex: 1; display: flex; flex-direction: column;
        }
        .product-info-column h1 { font-size: 1.8em; margin:0 0 2px 0; line-height: 1.25; font-weight: 600; }
        .product-info-column h2 { font-size: 1.15em; font-weight: normal; color: #4a4a4a; margin:0 0 12px 0; }
        .product-price { font-size: 1.6em; font-weight: bold; color: #000; margin:0 0 8px 0; }

        .confidence-section {
          margin-bottom: 15px;
        }
        .confidence-badge {
          background-color: #eef7ff; /* Lighter blue */
          border: 1px solid #cce4ff; 
          color: #1d3959; 
          padding: 6px 10px; border-radius: 4px; font-size: 0.85em;
          display: inline-block; /* To keep it tight */
        }
        .warranty-check { color: green; margin-left: 5px; font-weight: bold; }

        .feedback-widget-inline {
          display: inline-flex; /* Align with badge if on same line */
          align-items: center;
          gap: 5px; margin-left: 15px; font-size: 0.85em;
        }
        .feedback-widget-inline .thumb-btn {
          background: none; border: 1px solid transparent; cursor: pointer; padding: 3px;
          font-size: 1.1em; /* Make thumbs slightly larger */ 
          line-height: 1;
        }
        .feedback-widget-inline .thumb-btn.selected {
          /* Optional: add a subtle background or border for selected */
           border-radius: 4px; background-color: #007bff1a;
        }

        .email-capture-inline { margin-bottom: 20px; }
        .email-form-label { display: block; font-size: 0.9em; margin-bottom: 6px; color: #333;}
        .email-input-group {
          display: flex; gap: 8px;
        }
        .email-capture-inline input[type="email"] {
          flex-grow: 1; padding: 9px 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 0.9em;
        }
        .email-capture-inline button {
          padding: 9px 15px; background-color: #28a745; color: white; border: none;
          border-radius: 4px; cursor: pointer; font-weight: 500; font-size: 0.9em;
          white-space: nowrap;
        }
        .email-capture-inline button:hover { background-color: #218838; }
        .email-success-message { color: #28a745; font-weight: 500; font-size: 0.9em; }

        .seller-trust-summary {
          display: flex; gap: 10px; align-items: center; flex-wrap: wrap;
          padding: 10px; background-color: #f8f8f8; border-radius: 4px;
          margin-bottom: 20px; font-size: 0.85em;
        }
        .trust-item {
          color: #333; padding-right:10px;
          /* border-right: 1px solid #ddd; Remove border for cleaner chip look */
        }
        /* .trust-item:last-child { border-right: none; } */

        .key-specs-section {
          background-color: #f9f9f9; /* Subtle background */
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        .key-specs-section h3 {
          font-size: 1.1em; color: #333; margin-top: 0; margin-bottom: 12px;
        }
        .key-specs-list {
          list-style: none; padding: 0; margin: 0;
          font-size: 0.9em;
        }
        .key-spec-item {
          display: flex; 
          justify-content: space-between; /* Pushes label and value apart */
          padding: 6px 0; /* Add some vertical spacing */
          border-bottom: 1px solid #eee; /* Separator line */
        }
        .key-spec-item:last-child { border-bottom: none; }
        .key-spec-label { font-weight: 500; color: #444; margin-right: 10px; }
        .key-spec-value { color: #111; text-align: right; }

        .view-listing-button {
          display: block; /* Make it full width of its container if needed, or inline-block */
          width: 100%;
          padding: 12px 20px; background-color: #007bff; color: white;
          border: none; border-radius: 5px; font-size: 1em; cursor: pointer; text-decoration: none;
          text-align: center; transition: background-color 0.2s; margin-top: auto; /* Pushes to bottom if info-column has space */
        }
        .view-listing-button:hover { background-color: #0056b3; }

        /* Mobile stacking */
        @media (max-width: 768px) {
          .product-main-content {
            flex-direction: column;
          }
          .product-image-gallery {
            flex: 0 0 auto; /* Reset flex basis */
            max-width: 100%; /* Allow full width */
          }
          .product-info-column h1 { font-size: 1.6em; }
          .product-price { font-size: 1.4em; }
          .confidence-badge, .feedback-widget-inline, .email-capture-inline input, .email-capture-inline button {
            font-size: 0.9em; /* Slightly smaller on mobile */
          }
          .seller-trust-summary { flex-direction: column; align-items: flex-start; gap: 5px; }
          .key-spec-item { flex-direction: column; align-items: flex-start; }
          .key-spec-value { text-align: left; margin-top: 2px; }
        }
      `}</style>
    </div>
  );
};

export default WatchProductDisplay; 