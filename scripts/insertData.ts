import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import connectDB from '../lib/db';
import Product from '../lib/models/Product';
import mongoose from 'mongoose';
dotenv.config({ path: '.env.local' });

async function insertData() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const jsonPath = path.join(__dirname, '../data/products.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    const transformedData = jsonData.map((item:any) => ({
      Handle: item.Handle,
      Title: item.Title,
      Body: item.Body,
      Vendor: item.Vendor,
      Type: item.Type,
      Tags: item.Tags,
      Option1Name: item['Option1 Name'],
      Option1Value: item['Option1 Value'],
      Option2Name: item['Option2 Name'],
      Option2Value: item['Option2 Value'],
      Option3Name: item['Option3 Name'],
      Option3Value: item['Option3 Value'],
      VariantSKU: item['Variant SKU'],
      VariantGrams: item['Variant Grams'],
      VariantInventoryTracker: item['Variant Inventory Tracker'],
      VariantInventoryQty: item['Variant Inventory Qty'],
      VariantInventoryPolicy: item['Variant Inventory Policy'],
      VariantFulfillmentService: item['Variant Fulfillment Service'],
      VariantPrice: item['Variant Price'],
      VariantCompareAtPrice: item['Variant Compare At Price'],
      ImageSrc: item['Image Src']
    }));

    await Product.deleteMany({});
    console.log('Cleared existing products');

    const result = await Product.insertMany(transformedData);
    console.log(`Inserted ${result.length} products`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

insertData();