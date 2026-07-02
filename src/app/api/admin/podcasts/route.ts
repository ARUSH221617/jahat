import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { podcastSchema, podcastUpdateSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== 'admin' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    const podcasts = await db.podcast.findMany({
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
        }
      },
    });

    const totalCount = await db.podcast.count({
      where: {
        product: {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
          ],
        }
      },
    });

    const currencySetting = await db.setting.findUnique({ where: { key: "currency" } });
    const currency = currencySetting?.value || "IRR";

    const mappedPodcasts = podcasts.map(p => ({
      id: p.id,
      productId: p.productId,
      title: p.product.title,
      description: p.product.description,
      price: p.product.price,
      thumbnail: p.product.thumbnail,
      host: p.host || "",
      episodes: p.episodes || 0,
      audioUrl: p.audioUrl || "",
      category: p.product.categories[0]?.name || "Unknown",
      categoryId: p.product.categories[0]?.id || "",
      currency,
      createdAt: p.product.createdAt,
      updatedAt: p.product.updatedAt,
    }));

    return NextResponse.json({
      podcasts: mappedPodcasts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return NextResponse.json({ error: "Failed to fetch podcasts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== 'admin' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = podcastSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 });
    }

    const { title, description, price, categoryId, host, episodes, audioUrl, thumbnail } = result.data;

    // 1. Create parent Product
    const product = await db.product.create({
      data: {
        title,
        description,
        price,
        thumbnail: thumbnail || "",
        type: "PODCAST",
        categories: { connect: { id: categoryId } },
      }
    });

    // 2. Create Podcast subtype record
    const podcast = await db.podcast.create({
      data: {
        host,
        episodes,
        audioUrl,
        productId: product.id,
      },
      include: {
        product: {
          include: {
            categories: true,
          }
        }
      }
    });

    const currencySetting = await db.setting.findUnique({ where: { key: "currency" } });
    const currency = currencySetting?.value || "IRR";

    const mappedPodcast = {
      id: podcast.id,
      productId: podcast.productId,
      title: podcast.product.title,
      description: podcast.product.description,
      price: podcast.product.price,
      thumbnail: podcast.product.thumbnail,
      host: podcast.host || "",
      episodes: podcast.episodes || 0,
      audioUrl: podcast.audioUrl || "",
      category: podcast.product.categories[0]?.name || "Unknown",
      categoryId: podcast.product.categories[0]?.id || "",
      currency,
      createdAt: podcast.product.createdAt,
      updatedAt: podcast.product.updatedAt,
    };

    return NextResponse.json(mappedPodcast, { status: 201 });
  } catch (error) {
    console.error("Error creating podcast:", error);
    return NextResponse.json({ error: "Failed to create podcast" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== 'admin' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = podcastUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 });
    }

    const { id, title, description, price, categoryId, host, episodes, audioUrl, thumbnail } = result.data;

    const existingPodcast = await db.podcast.findUnique({ where: { id } });
    if (!existingPodcast) {
      return NextResponse.json({ error: "Podcast not found" }, { status: 404 });
    }

    // 1. Update Product
    await db.product.update({
      where: { id: existingPodcast.productId },
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

    // 2. Update Podcast subtype
    const updatedPodcast = await db.podcast.update({
      where: { id },
      data: {
        host: host || undefined,
        episodes: episodes !== undefined ? episodes : undefined,
        audioUrl: audioUrl !== undefined ? audioUrl : undefined,
      },
      include: {
        product: {
          include: {
            categories: true,
          }
        }
      }
    });

    const currencySetting = await db.setting.findUnique({ where: { key: "currency" } });
    const currency = currencySetting?.value || "IRR";

    const mappedPodcast = {
      id: updatedPodcast.id,
      productId: updatedPodcast.productId,
      title: updatedPodcast.product.title,
      description: updatedPodcast.product.description,
      price: updatedPodcast.product.price,
      thumbnail: updatedPodcast.product.thumbnail,
      host: updatedPodcast.host || "",
      episodes: updatedPodcast.episodes || 0,
      audioUrl: updatedPodcast.audioUrl || "",
      category: updatedPodcast.product.categories[0]?.name || "Unknown",
      categoryId: updatedPodcast.product.categories[0]?.id || "",
      currency,
      createdAt: updatedPodcast.product.createdAt,
      updatedAt: updatedPodcast.product.updatedAt,
    };

    return NextResponse.json(mappedPodcast);
  } catch (error) {
    console.error("Error updating podcast:", error);
    return NextResponse.json({ error: "Failed to update podcast" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== 'admin' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Podcast ID is required" }, { status: 400 });
    }

    const podcast = await db.podcast.findUnique({ where: { id } });
    if (podcast) {
      await db.product.delete({
        where: { id: podcast.productId },
      });
    }

    return NextResponse.json({ message: "Podcast deleted successfully" });
  } catch (error) {
    console.error("Error deleting podcast:", error);
    return NextResponse.json({ error: "Failed to delete podcast" }, { status: 500 });
  }
}
