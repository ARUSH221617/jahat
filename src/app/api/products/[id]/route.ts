import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const product = await db.product.findUnique({
      where: { id: params.id },
      include: {
        categories: true,
        tags: true,
        books: true,
        podcasts: true,
        bundleItems: {
          include: {
            categories: true,
            books: true,
            podcasts: true,
            courses: {
              include: {
                instructor: { select: { name: true } },
                level: true
              }
            }
          }
        },
        courses: {
          include: {
            instructor: { select: { name: true } },
            level: true
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const currencySetting = await db.setting.findUnique({
      where: { key: "currency" }
    });
    const currency = currencySetting?.value || "IRR";

    return NextResponse.json({
      ...product,
      currency
    });
  } catch (error) {
    console.error('Error fetching public product detail:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
