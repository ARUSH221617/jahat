import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { courseSchema, courseUpdateSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const session = await auth();

    if (!session?.user?.id || (session.user.role !== 'admin' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Get courses with optional search on the product parent
    const courses = await db.course.findMany({
      where: {
        product: {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
          ],
        }
      },
      skip,
      take: limit,
      orderBy: { product: { createdAt: "desc" } },
      include: {
        product: {
          include: {
            categories: true,
          }
        },
        instructor: true,
        level: true,
      },
    });

    // Get total count for pagination
    const totalCount = await db.course.count({
      where: {
        product: {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
          ],
        }
      },
    });

    const currencySetting = await db.setting.findUnique({
      where: { key: "currency" }
    });
    const currency = currencySetting?.value || "IRR";

    const mappedCourses = courses.map(c => ({
      id: c.id,
      productId: c.productId,
      title: c.product.title,
      description: c.product.description,
      price: c.product.price,
      thumbnail: c.product.thumbnail,
      duration: c.duration,
      instructorId: c.instructorId,
      instructor: c.instructor,
      category: c.product.categories[0]?.name || "Unknown",
      categoryId: c.product.categories[0]?.id || "",
      level: c.level.name,
      levelId: c.level.id,
      currency,
      createdAt: c.product.createdAt,
      updatedAt: c.product.updatedAt,
    }));

    return new Response(
      JSON.stringify({
        courses: mappedCourses,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching courses:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch courses" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    const session = await auth();

    if (!session?.user?.id || (session.user.role !== 'admin' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const result = courseSchema.safeParse(body);
    if (!result.success) {
      return new Response(
        JSON.stringify({ error: "Validation failed", details: result.error.format() }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { title, description, instructorId, price, categoryId, levelId, duration, thumbnail } = result.data;

    // 1. Create parent Product
    const product = await db.product.create({
      data: {
        title,
        description,
        price,
        thumbnail: thumbnail || "",
        type: "COURSE",
        categories: { connect: { id: categoryId } },
      }
    });

    // 2. Create Course subtype record
    const course = await db.course.create({
      data: {
        duration,
        instructorId,
        levelId,
        productId: product.id,
      },
      include: {
        product: {
          include: {
            categories: true,
          }
        },
        instructor: true,
        level: true,
      }
    });

    const currencySetting = await db.setting.findUnique({ where: { key: "currency" } });
    const currency = currencySetting?.value || "IRR";

    const mappedCourse = {
      id: course.id,
      title: course.product.title,
      description: course.product.description,
      price: course.product.price,
      thumbnail: course.product.thumbnail,
      duration: course.duration,
      instructorId: course.instructorId,
      instructor: course.instructor,
      category: course.product.categories[0]?.name || "Unknown",
      categoryId: course.product.categories[0]?.id || "",
      level: course.level.name,
      levelId: course.level.id,
      currency,
      createdAt: course.product.createdAt,
      updatedAt: course.product.updatedAt,
    };

    return new Response(JSON.stringify(mappedCourse), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return new Response(JSON.stringify({ error: "Failed to create course" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify admin session
    const session = await auth();

    if (!session?.user?.id || (session.user.role !== 'admin' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const result = courseUpdateSchema.safeParse(body);
    if (!result.success) {
       return new Response(
        JSON.stringify({ error: "Validation failed", details: result.error.format() }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { id, title, description, instructorId, price, categoryId, levelId, duration, thumbnail } = result.data;

    // Fetch existing course to get productId
    const existingCourse = await db.course.findUnique({
      where: { id }
    });

    if (!existingCourse) {
      return new Response(JSON.stringify({ error: "Course not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 1. Update parent Product
    await db.product.update({
      where: { id: existingCourse.productId },
      data: {
        title: title || undefined,
        description: description || undefined,
        price: price !== undefined ? price : undefined,
        thumbnail: thumbnail || undefined,
        categories: categoryId ? {
          set: [],
          connect: [{ id: categoryId }]
        } : undefined,
      }
    });

    // 2. Update Course subtype
    const updatedCourse = await db.course.update({
      where: { id },
      data: {
        instructorId: instructorId || undefined,
        levelId: levelId || undefined,
        duration: duration || undefined,
      },
      include: {
        product: {
          include: {
            categories: true,
          }
        },
        instructor: true,
        level: true,
      }
    });

    const currencySetting = await db.setting.findUnique({ where: { key: "currency" } });
    const currency = currencySetting?.value || "IRR";

    const mappedCourse = {
      id: updatedCourse.id,
      title: updatedCourse.product.title,
      description: updatedCourse.product.description,
      price: updatedCourse.product.price,
      thumbnail: updatedCourse.product.thumbnail,
      duration: updatedCourse.duration,
      instructorId: updatedCourse.instructorId,
      instructor: updatedCourse.instructor,
      category: updatedCourse.product.categories[0]?.name || "Unknown",
      categoryId: updatedCourse.product.categories[0]?.id || "",
      level: updatedCourse.level.name,
      levelId: updatedCourse.level.id,
      currency,
      createdAt: updatedCourse.product.createdAt,
      updatedAt: updatedCourse.product.updatedAt,
    };

    return new Response(JSON.stringify(mappedCourse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating course:", error);
    return new Response(JSON.stringify({ error: "Failed to update course" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin session
    const session = await auth();

    if (!session?.user?.id || (session.user.role !== 'admin' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Course ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch course to get productId
    const course = await db.course.findUnique({
      where: { id }
    });

    if (course) {
      // Deleting the parent product will cascade delete the Course record
      await db.product.delete({
        where: { id: course.productId },
      });
    }

    return new Response(
      JSON.stringify({ message: "Course deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting course:", error);
    return new Response(JSON.stringify({ error: "Failed to delete course" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
