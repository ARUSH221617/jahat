import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const course = await db.course.findUnique({
      where: {
        id: id,
      },
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

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    const currencySetting = await db.setting.findUnique({
      where: { key: "currency" }
    });
    const currency = currencySetting?.value || "IRR";

    const mappedCourse = {
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
    };

    return NextResponse.json(mappedCourse);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
