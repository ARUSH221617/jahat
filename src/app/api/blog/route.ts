import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "3");
    const category = searchParams.get("category") || undefined;

    const where: any = {
      published: true,
    };

    if (category) {
      where.categories = { some: { slug: category } };
    }

    const posts = await db.post.findMany({
      where,
      take: limit,
      orderBy: { publishedAt: "desc" },
      include: {
        author: { select: { name: true } },
        categories: { select: { name: true, slug: true } },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("[BLOG_PUBLIC_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
