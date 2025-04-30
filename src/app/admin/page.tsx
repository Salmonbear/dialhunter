'use client'; // Make this a Client Component

import { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from './admin.module.css'; // We'll create this CSS module

export default function AdminPage() {
  const [urlToScrape, setUrlToScrape] = useState<string>('https://parkersjewellers.co.uk/brand/rolex/vintage-rolex-watches/');
  const [scrapeResult, setScrapeResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copyButtonText, setCopyButtonText] = useState<string>('Copy'); // State for copy button text

  const handleScrape = async () => {
    setIsLoading(true);
    setError(null);
    setScrapeResult(null);

    try {
      // Call the generic /api/scrape endpoint again
      const response = await fetch('/api/scrape', { // <-- Reverted Endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send only the URL
        body: JSON.stringify({ url: urlToScrape }), // <-- Reverted Body
      });

      // Basic error check - expects JSON response
      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || JSON.stringify(errorData);
        } catch (parseError) {
          console.error("Failed to parse error response as JSON:", parseError);
        }
        throw new Error(errorMsg);
      }

      // Expect *any* JSON data and display it
      const data = await response.json();
      setScrapeResult(JSON.stringify(data, null, 2)); // Display raw JSON

    } catch (err: unknown) {
      console.error("Scraping error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while scraping.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!scrapeResult) return;

    try {
      await navigator.clipboard.writeText(scrapeResult);
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy'), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopyButtonText('Failed');
       setTimeout(() => setCopyButtonText('Copy'), 2000);
    }
  };

  return (
    <>
      <Header />
      <main className={styles.adminContainer}>
        <h1>Admin - Scraper Test</h1>

        <div className={styles.inputGroup}>
          <label htmlFor="urlInput">URL to Scrape:</label>
          <input
            type="url"
            id="urlInput"
            value={urlToScrape}
            onChange={(e) => setUrlToScrape(e.target.value)}
            placeholder="https://example.com"
          />
          <button onClick={handleScrape} disabled={isLoading}>
            {isLoading ? 'Scraping...' : 'Scrape URL'}
          </button>
        </div>

        {error && (
          <div className={styles.errorBox}>
            <p>Error:</p>
            <pre>{error}</pre>
          </div>
        )}

        {scrapeResult && (
          <div className={styles.resultBox}>
            <div className={styles.resultHeader}>
              <h2>Scraping Result:</h2>
              <button onClick={handleCopy} className={styles.copyButton}>
                {copyButtonText}
              </button>
            </div>
            <pre>{scrapeResult}</pre>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
} 