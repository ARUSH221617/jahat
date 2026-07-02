import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { productSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    const where: any = {
      type: { not: "COURSE" },
      OR: [
        { title: { contains: search } },
        { description: { contains: search } },
      ],
    };

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          categories: true,
          tags: true,
          books: true,
          podcasts: true,
          bundleItems: true,
          courses: {
            include: {
              instructor: { select: { name: true } },
              level: true,
            }
          }
        },
      }),
      db.product.count({ where }),
    ]);

    // Expose global currency setting to the client
    const currencySetting = await db.setting.findUnique({
      where: { key: "currency" }
    });
    const currency = currencySetting?.value || "IRR";

    const productsWithCurrency = products.map(product => ({
      ...product,
      currency
    }));

    return NextResponse.json({
      products: productsWithCurrency,
      pagination: {
        totalCount: total,
        totalPages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await request.json();
    const body = productSchema.parse(json);

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

    // Create base product
    const product = await db.product.create({
      data: {
        title: body.title,
        description: body.description,
        price: body.price,
        thumbnail: body.thumbnail || "",
        type: body.type,
        categories: {
          connect: body.categoryIds?.map(id => ({ id })) || [],
        },
        tags: {
          connectOrCreate: tagsConnect,
        },
        bundleItems: body.type === "BUNDLE" ? {
          connect: bundleProductIds.map(id => ({ id }))
        } : undefined,
      },
    });

    // Create subtype-specific records
    if (body.type === "BOOK") {
      await db.book.create({
        data: {
          productId: product.id,
          author: body.author || "Unknown Author",
          pages: body.pages || 0,
        },
      });
    } else if (body.type === "PODCAST") {
      await db.podcast.create({
        data: {
          productId: product.id,
          host: body.host || "Unknown Host",
          episodes: body.episodes || 0,
        },
      });
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
    console.error("[PRODUCTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
