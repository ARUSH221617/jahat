import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== "admin" && session.user.role !== "ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const levels = await db.courseLevel.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(levels);
  } catch (error) {
    console.error("[COURSE_LEVELS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== "admin" && session.user.role !== "ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/gi, '-').replace(/^-+|-+$/g, '');

    const level = await db.courseLevel.create({
      data: { name, slug },
    });

    return NextResponse.json(level);
  } catch (error) {
    console.error("[COURSE_LEVELS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
