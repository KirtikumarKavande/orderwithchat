import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import Product from '../../../../lib/models/Product';
import runGeminiScript from '../../../../utilis/geminiScript';

export async function POST(request: Request) {
  try {
    const { message, page = 1, limit = 32 } = await request.json();
    const skip = (page - 1) * limit;

    await connectDB();

    const prompt = `
      Given the following product search query: "${message}"
      Convert this natural language query into a structured search criteria.
      Only respond with a JSON object containing these fields:
      - sku (string, optional): If a specific SKU is mentioned
      - category (string, optional): Product category mentioned
      - maxPrice (number, optional): Maximum price mentioned
      - minPrice (number, optional): Minimum price mentioned
      - keywords (string[], optional): Important search terms
      Consider variations in category names (e.g., 'electronics' could match 'Electronic Accessories')
    `;

    const response = await runGeminiScript(prompt);
    let geminiResponse = response.replace(/```json\s*|\s*```/g, '').trim();
    
    let searchCriteria;
    try {
      searchCriteria = JSON.parse(geminiResponse);
      console.log('Gemini response:', searchCriteria);
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return NextResponse.json(
        { error: 'Invalid search criteria generated' },
        { status: 400 }
      );
    }

    const conditions: any[] = [];

    if (searchCriteria.maxPrice) {
      conditions.push({
        $expr: {
          $lte: [
            {
              $cond: {
                if: { $eq: [{ $type: "$VariantPrice" }, "string"] },
                then: { $toDouble: "$VariantPrice" },
                else: "$VariantPrice"
              }
            },
            Number(searchCriteria.maxPrice)
          ]
        }
      });
    }

    if (searchCriteria.minPrice) {
      conditions.push({
        $expr: {
          $gte: [
            {
              $cond: {
                if: { $eq: [{ $type: "$VariantPrice" }, "string"] },
                then: { $toDouble: "$VariantPrice" },
                else: "$VariantPrice"
              }
            },
            Number(searchCriteria.minPrice)
          ]
        }
      });
    }

    const searchTerms = [
      ...(searchCriteria.keywords || []),
      searchCriteria.category
    ].filter(Boolean);

    if (searchTerms.length > 0) {
 
      const searchPattern = searchTerms.map(term => 
        term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') 
      ).join('|');
      
      conditions.push({
        $or: [
          { Title: { $regex: searchPattern, $options: 'i' } },
          { Type: { $regex: searchPattern, $options: 'i' } },
          { SKU: { $regex: searchPattern, $options: 'i' } }
        ]
      });
    }

    // Handle specific SKU if provided
    if (searchCriteria.sku) {
      conditions.push({
        SKU: new RegExp(searchCriteria.sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      });
    }

    const mongoQuery = conditions.length > 0 ? { $and: conditions } : {};

    console.log('Final MongoDB Query:', JSON.stringify(mongoQuery, null, 2));

    // Execute the query
    const totalItems = await Product.countDocuments(mongoQuery);
    const totalPages = Math.ceil(totalItems / limit);
    
    const products = await Product.find(mongoQuery)
      .skip(skip)
      .limit(limit)
      .lean()
      .then(products => products.map(product => ({
        _id: product._id,
        Title: product.Title || '',
        ImageSrc: product.ImageSrc || '',
        VariantPrice: product.VariantPrice || '0',
        SKU: product.SKU || '',
        Type: product.Type || ''
      })));

    return NextResponse.json({
      products,
      totalPages,
      currentPage: page,
      totalItems,
      searchCriteria,
      query: mongoQuery
    });
    
  } catch (error) {
    console.error('Error processing chat search:', error);
    return NextResponse.json(
      { error: 'Failed to process search request' },
      { status: 500 }
    );
  }
}