import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type'); // "BOOK", "PODCAST", "BUNDLE"
    const search = searchParams.get('search');

    const where: any = {
      type: type ? type : { in: ["BOOK", "PODCAST", "BUNDLE"] }, // Default to non-course products
    };
    
    if (category && category !== 'All') {
      where.categories = { some: { slug: category } };
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const products = await db.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        categories: true,
        tags: true,
        books: true,
        podcasts: true,
      }
    });

    const currencySetting = await db.setting.findUnique({
      where: { key: "currency" }
    });
    const currency = currencySetting?.value || "IRR";

    const mappedProducts = products.map(product => ({
      ...product,
      currency
    }));

    return NextResponse.json(mappedProducts);
  } catch (error) {
    console.error('Error fetching public products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
