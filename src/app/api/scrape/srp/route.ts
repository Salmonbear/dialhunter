import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { SrpSelectors, SrpProductInfo } from '@lib/scrapingTypes'; // Use new alias

export async function POST(request: Request) {
  const apiKey = process.env.SCRAPINGBEE_API_KEY;

  if (!apiKey) {
    console.error('ScrapingBee API key not found.');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    // --- Get URL and Selectors from Request Body ---
    const { url: targetUrl, selectors }: { url: string; selectors: SrpSelectors } = await request.json();

    if (!targetUrl || typeof targetUrl !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }
    if (!selectors || typeof selectors !== 'object') {
        return NextResponse.json({ error: 'SRP selectors are required' }, { status: 400 });
    }
     // Basic validation (can be expanded)
    if (!selectors.productListItem || !selectors.title || !selectors.price || !selectors.link || !selectors.imageUrl) {
        return NextResponse.json({ error: 'Missing required SRP selectors' }, { status: 400 });
    }

    try {
      new URL(targetUrl);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    console.log(`Attempting to scrape SRP: ${targetUrl}`);

    // --- Call ScrapingBee API ---
    const params = new URLSearchParams({
      api_key: apiKey,
      url: targetUrl,
      // render_js: 'true', // Keep rendering JS often needed for modern sites
      // block_resources: 'false' // Consider blocking css/images if not needed for selectors
    });
    const scrapingBeeUrl = `https://app.scrapingbee.com/api/v1/?${params.toString()}`;
    const scrapingResponse = await fetch(scrapingBeeUrl);

    console.log(`ScrapingBee SRP response status for ${targetUrl}: ${scrapingResponse.status}`);

    if (!scrapingResponse.ok) {
      let errorBody = 'Failed to fetch from ScrapingBee';
      try {
        const beeError = await scrapingResponse.json();
        errorBody = beeError.message || beeError.error || JSON.stringify(beeError);
      } catch { /* Ignore */ }
      throw new Error(`ScrapingBee API error (${scrapingResponse.status}): ${errorBody}`);
    }

    const htmlContent = await scrapingResponse.text();

    // --- Parse SRP HTML with Cheerio using provided selectors ---
    const $ = cheerio.load(htmlContent);
    const products: SrpProductInfo[] = [];
    const imageAttribute = selectors.imageAttribute || 'src'; // Default to src if not provided

    // Use the provided selector for the list items
    $(selectors.productListItem).each((index, element) => {
      const productElement = $(element);

      // Use provided selectors for details
      const title = productElement.find(selectors.title).first().text().trim() || null;
      const price = productElement.find(selectors.price).first().text().trim() || null;
      let link = productElement.find(selectors.link).first().attr('href') || null;
      let imageUrl = productElement.find(selectors.imageUrl).first().attr(imageAttribute) || null;
      
       // Fallback for image if primary attribute fails
      if (!imageUrl && imageAttribute !== 'src') {
          imageUrl = productElement.find(selectors.imageUrl).first().attr('src') || null;
      }
      
      // Ensure link is absolute
      if (link && !link.startsWith('http')) {
        try {
            const base = new URL(targetUrl);
            link = new URL(link, base.origin).toString();
        } catch (e) {
            console.warn(`Could not construct absolute URL for link: ${link}`, e);
            link = null; // Invalidate if construction fails
        }
      }

      // Only add if we have a link, as that's essential for the next step
      if (link) {
        products.push({
          title,
          price,
          link, // Already validated/made absolute
          imageUrl,
        });
      }
    });

    // Return the parsed product data
    return NextResponse.json({ products });

  } catch (error: unknown) {
    console.error('Error in /api/scrape/srp route:', error);
    let errorMessage = 'An unexpected error occurred during SRP scraping.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 