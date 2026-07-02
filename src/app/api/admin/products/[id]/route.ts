import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { productUpdateSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const product = await db.product.findUnique({
      where: { id: params.id },
      include: {
        categories: true,
        tags: true,
        books: true,
        podcasts: true,
        bundleItems: true,
        courses: {
          include: {
            instructor: { select: { id: true, name: true } },
            level: true,
          }
        }
      },
    });

    if (!product) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_GET_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await request.json();
    const body = productUpdateSchema.parse(json);

    // Parse tags
    const tagNames = body.tags
      ? body.tags.split(",").map(t => t.trim()).filter(t => t.length > 0)
      : [];

    const tagsConnect = [];
    for (const name of tagNames) {
      const slug = name.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/gi, '-').replace(/^-+|-+$/g, '');
      tagsConnect.push({
        where: { slug },
        create: { name, slug },
      });
    }

    const bundleProductIds = [
      ...(body.courseIds || []),
      ...(body.bookIds || []),
      ...(body.podcastIds || []),
    ];

    // Update base product
    const product = await db.product.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        price: body.price,
        thumbnail: body.thumbnail,
        type: body.type,
        categories: {
          set: [],
          connect: body.categoryIds?.map(id => ({ id })) || [],
        },
        tags: {
          set: [],
          connectOrCreate: tagsConnect,
        },
        bundleItems: body.type === "BUNDLE" ? {
          set: bundleProductIds.map(id => ({ id }))
        } : {
          set: []
        }
      },
    });

    // Update or create subtype specifics
    if (body.type === "BOOK") {
      const existingBook = await db.book.findFirst({ where: { productId: product.id } });
      if (existingBook) {
        await db.book.update({
          where: { id: existingBook.id },
          data: {
            author: body.author || "Unknown Author",
            pages: body.pages || 0,
          },
        });
      } else {
        await db.book.create({
          data: {
            productId: product.id,
            author: body.author || "Unknown Author",
            pages: body.pages || 0,
          },
        });
      }
    } else if (body.type === "PODCAST") {
      const existingPodcast = await db.podcast.findFirst({ where: { productId: product.id } });
      if (existingPodcast) {
        await db.podcast.update({
          where: { id: existingPodcast.id },
          data: {
            host: body.host || "Unknown Host",
            episodes: body.episodes || 0,
          },
        });
      } else {
        await db.podcast.create({
          data: {
            productId: product.id,
            host: body.host || "Unknown Host",
            episodes: body.episodes || 0,
          },
        });
      }
    } else if (body.type === "COURSE") {
      if (body.courseId) {
        await db.course.update({
          where: { id: body.courseId },
          data: { productId: product.id },
        });
      }
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_PUT_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.product.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
