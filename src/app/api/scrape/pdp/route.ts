import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { PdpSelectors, PdpProductDetails } from '@lib/scrapingTypes'; // Use alias

export async function POST(request: Request) {
    const apiKey = process.env.SCRAPINGBEE_API_KEY;

    if (!apiKey) {
        console.error('ScrapingBee API key not found.');
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        // --- Get URL and Selectors from Request Body ---
        const { url: targetUrl, selectors }: { url: string; selectors: PdpSelectors } = await request.json();

        if (!targetUrl || typeof targetUrl !== 'string') {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }
        if (!selectors || typeof selectors !== 'object') {
            return NextResponse.json({ error: 'PDP selectors are required' }, { status: 400 });
        }
        // Basic validation - check mandatory fields from PdpSelectors
        if (!selectors.title || !selectors.price || !selectors.description || !selectors.specificationsTable || !selectors.specRowKey || !selectors.specRowValue || !selectors.mainImage) {
             return NextResponse.json({ error: 'Missing one or more required PDP selectors (title, price, description, specificationsTable, specRowKey, specRowValue, mainImage)' }, { status: 400 });
        }

        try {
            new URL(targetUrl);
        } catch {
            return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
        }

        console.log(`Attempting to scrape PDP: ${targetUrl}`);

        // --- Call ScrapingBee API ---
        const params = new URLSearchParams({
            api_key: apiKey,
            url: targetUrl,
            // render_js: 'true',
            // block_resources: 'false'
        });
        const scrapingBeeUrl = `https://app.scrapingbee.com/api/v1/?${params.toString()}`;
        const scrapingResponse = await fetch(scrapingBeeUrl);

        console.log(`ScrapingBee PDP response status for ${targetUrl}: ${scrapingResponse.status}`);

        if (!scrapingResponse.ok) {
            let errorBody = 'Failed to fetch from ScrapingBee';
            try {
                const beeError = await scrapingResponse.json();
                errorBody = beeError.message || beeError.error || JSON.stringify(beeError);
            } catch { /* Ignore */ }
            throw new Error(`ScrapingBee API error (${scrapingResponse.status}): ${errorBody}`);
        }

        const htmlContent = await scrapingResponse.text();

        // --- Parse PDP HTML with Cheerio using provided selectors ---
        const $ = cheerio.load(htmlContent);
        const imageAttribute = selectors.imageAttribute || 'src'; // Default to src

        const details: PdpProductDetails = {
            title: null,
            price: null,
            description: null,
            specifications: {}, // Initialize as empty object
            mainImageUrl: null,
            sku: null,
        };

        // Extract Title, Price, Description (Mandatory based on validation)
        details.title = $(selectors.title).first().text().trim() || null;
        details.price = $(selectors.price).first().text().trim() || null;
        details.description = $(selectors.description).first().text().trim() || null;

        // Extract Main Image URL (Mandatory selector based on validation)
        details.mainImageUrl = $(selectors.mainImage).first().attr(imageAttribute) || null;
         // Fallback for image if primary attribute fails
        if (!details.mainImageUrl && imageAttribute !== 'src') {
            details.mainImageUrl = $(selectors.mainImage).first().attr('src') || null;
        }

        // Extract SKU (Optional)
        if (selectors.sku) {
            details.sku = $(selectors.sku).first().text().trim() || null;
        }

        // Extract Specifications (Mandatory selectors based on validation)
        const specs: Record<string, string> = {};
        // Find the container for specifications
        const specContainer = $(selectors.specificationsTable).first();
        if (specContainer.length) {
            // Iterate over each key element within the container
            specContainer.find(selectors.specRowKey).each((i, keyElement) => {
                const key = $(keyElement).text().trim();
                // Attempt to find the corresponding value. This assumes a structure
                // where the value element is findable relative to the key element
                // e.g., the next sibling, or within the same parent row.
                // Using .next() as a guess, might need refinement based on actual HTML.
                // A safer approach might involve .parent().find(valueSelector)
                // or similar depending on structure.
                let value = $(keyElement).next(selectors.specRowValue).text().trim();
                // If .next() didn't work, try finding within the parent (common for tr > td structure)
                if (!value) {
                    value = $(keyElement).parent().find(selectors.specRowValue).text().trim();
                }
                // TODO: Add more robust strategies for finding the value relative to the key if needed

                if (key && value) {
                    specs[key] = value;
                }
            });
        }
        details.specifications = specs; // Assign the collected specs (could be {} if none found)


        // Return the parsed product details
        return NextResponse.json({ details });

    } catch (error: unknown) {
        console.error('Error in /api/scrape/pdp route:', error);
        let errorMessage = 'An unexpected error occurred during PDP scraping.';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
} 