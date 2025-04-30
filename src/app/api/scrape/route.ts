import { NextResponse } from 'next/server';
// Removed Cheerio and SrpProductInfo imports as they are not used

// Removed parkersSelectors as parsing is removed

export async function POST(request: Request) {
    const apiKey = process.env.SCRAPINGBEE_API_KEY;

    if (!apiKey) {
        console.error('ScrapingBee API key not found.');
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        // --- Get URL from Request Body ---
        const { url: targetUrl }: { url: string } = await request.json();

        if (!targetUrl || typeof targetUrl !== 'string') {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        try {
            new URL(targetUrl);
        } catch {
            return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
        }

        console.log(`Attempting simple fetch for: ${targetUrl}`);

        // --- Call ScrapingBee API ---
        const params = new URLSearchParams({
            api_key: apiKey,
            url: targetUrl,
            render_js: 'true', // Keep JS rendering enabled
        });
        const scrapingBeeUrl = `https://app.scrapingbee.com/api/v1/?${params.toString()}`;
        const scrapingResponse = await fetch(scrapingBeeUrl);

        console.log(`ScrapingBee response status for ${targetUrl}: ${scrapingResponse.status}`);

        if (!scrapingResponse.ok) {
            let errorBody = 'Failed to fetch from ScrapingBee';
            try {
                // Try to get error details from ScrapingBee response if possible
                const beeError = await scrapingResponse.json(); 
                errorBody = beeError.message || beeError.error || JSON.stringify(beeError);
            } catch { 
                // If response isn't JSON, try getting text
                try {
                     errorBody = await scrapingResponse.text();
                } catch { /* Ignore if text also fails */ }
            }
            throw new Error(`ScrapingBee API error (${scrapingResponse.status}): ${errorBody}`);
        }

        // --- Get Raw HTML Content --- 
        const htmlResult = await scrapingResponse.text();

        // --- Return Raw HTML in JSON --- 
        // Mimics the structure from the OG route file
        return NextResponse.json({ result: htmlResult }); 

    } catch (error: unknown) {
        console.error('Error in /api/scrape route:', error);
        let errorMessage = 'An unexpected error occurred during scraping.';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
} 