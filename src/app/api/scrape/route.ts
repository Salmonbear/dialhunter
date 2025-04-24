import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const apiKey = process.env.SCRAPINGBEE_API_KEY;

  if (!apiKey) {
    console.error('ScrapingBee API key not found in environment variables.');
    return NextResponse.json({ error: 'Server configuration error: API key missing.' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const targetUrl = body.url;

    if (!targetUrl || typeof targetUrl !== 'string') {
      return NextResponse.json({ error: 'URL is required in the request body.' }, { status: 400 });
    }

    // Basic validation for URL format (optional but recommended)
    try {
      new URL(targetUrl);
    } catch (_) {
      return NextResponse.json({ error: 'Invalid URL format provided.' }, { status: 400 });
    }

    console.log(`Attempting to scrape URL: ${targetUrl}`);

    // --- Call ScrapingBee API --- 
    // Adjust parameters based on ScrapingBee documentation and your needs
    const params = new URLSearchParams({
      api_key: apiKey,
      url: targetUrl,
      // Add other parameters as needed, e.g.:
      // render_js: 'true', 
      // block_resources: 'false' 
    });

    const scrapingBeeUrl = `https://app.scrapingbee.com/api/v1/?${params.toString()}`;

    const scrapingResponse = await fetch(scrapingBeeUrl);

    console.log(`ScrapingBee response status for ${targetUrl}: ${scrapingResponse.status}`);

    if (!scrapingResponse.ok) {
        let errorBody = 'Failed to fetch from ScrapingBee';
        try {
             // Try to parse error from ScrapingBee response
            const beeError = await scrapingResponse.json();
            errorBody = beeError.message || beeError.error || JSON.stringify(beeError);
        } catch { /* Ignore parsing error */ }
        
      throw new Error(`ScrapingBee API error (${scrapingResponse.status}): ${errorBody}`);
    }

    // --- Process Response --- 
    // ScrapingBee might return HTML, JSON, or other formats depending on request parameters.
    // Assuming you want the raw HTML content for now.
    const responseData = await scrapingResponse.text(); // Use .json() if you expect JSON directly

    // Return the result to the client
    return NextResponse.json({ result: responseData });

  } catch (error: any) {
    console.error('Error in /api/scrape route:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred during scraping.' }, { status: 500 });
  }
} 