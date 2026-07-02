import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { bookSchema, bookUpdateSchema } from "@/lib/validations";

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

    const books = await db.book.findMany({
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

    const totalCount = await db.book.count({
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

    const mappedBooks = books.map(b => ({
      id: b.id,
      productId: b.productId,
      title: b.product.title,
      description: b.product.description,
      price: b.product.price,
      thumbnail: b.product.thumbnail,
      author: b.author || "",
      pages: b.pages || 0,
      pdfUrl: b.pdfUrl || "",
      category: b.product.categories[0]?.name || "Unknown",
      categoryId: b.product.categories[0]?.id || "",
      currency,
      createdAt: b.product.createdAt,
      updatedAt: b.product.updatedAt,
    }));

    return NextResponse.json({
      books: mappedBooks,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== 'admin' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = bookSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 });
    }

    const { title, description, price, categoryId, author, pages, pdfUrl, thumbnail } = result.data;

    // 1. Create parent Product
    const product = await db.product.create({
      data: {
        title,
        description,
        price,
        thumbnail: thumbnail || "",
        type: "BOOK",
        categories: { connect: { id: categoryId } },
      }
    });

    // 2. Create Book subtype record
    const book = await db.book.create({
      data: {
        author,
        pages,
        pdfUrl,
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

    const mappedBook = {
      id: book.id,
      productId: book.productId,
      title: book.product.title,
      description: book.product.description,
      price: book.product.price,
      thumbnail: book.product.thumbnail,
      author: book.author || "",
      pages: book.pages || 0,
      pdfUrl: book.pdfUrl || "",
      category: book.product.categories[0]?.name || "Unknown",
      categoryId: book.product.categories[0]?.id || "",
      currency,
      createdAt: book.product.createdAt,
      updatedAt: book.product.updatedAt,
    };

    return NextResponse.json(mappedBook, { status: 201 });
  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== 'admin' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = bookUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 });
    }

    const { id, title, description, price, categoryId, author, pages, pdfUrl, thumbnail } = result.data;

    const existingBook = await db.book.findUnique({ where: { id } });
    if (!existingBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // 1. Update Product
    await db.product.update({
      where: { id: existingBook.productId },
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

    // 2. Update Book subtype
    const updatedBook = await db.book.update({
      where: { id },
      data: {
        author: author || undefined,
        pages: pages !== undefined ? pages : undefined,
        pdfUrl: pdfUrl !== undefined ? pdfUrl : undefined,
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

    const mappedBook = {
      id: updatedBook.id,
      productId: updatedBook.productId,
      title: updatedBook.product.title,
      description: updatedBook.product.description,
      price: updatedBook.product.price,
      thumbnail: updatedBook.product.thumbnail,
      author: updatedBook.author || "",
      pages: updatedBook.pages || 0,
      pdfUrl: updatedBook.pdfUrl || "",
      category: updatedBook.product.categories[0]?.name || "Unknown",
      categoryId: updatedBook.product.categories[0]?.id || "",
      currency,
      createdAt: updatedBook.product.createdAt,
      updatedAt: updatedBook.product.updatedAt,
    };

    return NextResponse.json(mappedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 });
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
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
    }

    const book = await db.book.findUnique({ where: { id } });
    if (book) {
      await db.product.delete({
        where: { id: book.productId },
      });
    }

    return NextResponse.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
  }
}
