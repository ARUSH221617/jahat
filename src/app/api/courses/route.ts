import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { product: { title: { contains: search } } },
        { product: { description: { contains: search } } },
        { instructor: { name: { contains: search } } }
      ];
    }

    if (category && category !== 'All') {
      where.product = {
        categories: { some: { slug: category } }
      };
    }

    const courses = await db.course.findMany({
      where,
      orderBy: { product: { createdAt: 'desc' } },
      include: {
        product: {
          include: {
            categories: true,
          }
        },
        instructor: {
          select: {
            name: true,
          }
        },
        level: true,
      }
    });

    const currencySetting = await db.setting.findUnique({
      where: { key: "currency" }
    });
    const currency = currencySetting?.value || "IRR";

    const mappedCourses = courses.map(course => ({
      id: course.id,
      title: course.product.title,
      description: course.product.description,
      price: course.product.price,
      thumbnail: course.product.thumbnail,
      duration: course.duration,
      instructor: course.instructor,
      category: course.product.categories[0]?.name || "Unknown",
      level: course.level.name,
      currency,
      createdAt: course.product.createdAt,
      updatedAt: course.product.updatedAt,
    }));

    return NextResponse.json(mappedCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
