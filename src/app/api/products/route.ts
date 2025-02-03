// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import Product from '../../../../lib/models/Product';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '32');
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    await connectDB();

    const searchQuery = search
      ? {
          $or: [
            { Title: { $regex: search, $options: 'i' } },
            { 'Variant SKU': { $regex: search, $options: 'i' } },
          ],
        }
      : {};
// pagination

    const totalItems = await Product.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalItems / limit);
    const products = await Product.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .lean(); 

    return NextResponse.json({
      products,
      totalPages,
      currentPage: page,
      totalItems,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
