import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { tool } from "ai";
import { generateImage } from "@/lib/ai/generate-image";

const checkAdmin = async () => {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
  return session;
};

// Courses
export const createCourse = tool({
  description: "Create a new course. Requires admin privileges. Supports AI image generation for thumbnail.",
  parameters: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    level: z.string(),
    duration: z.string(),
    price: z.number(),
    instructorId: z.string().describe("ID of the instructor (User ID)"),
    thumbnailPrompt: z.string().optional().describe("Prompt to generate a thumbnail image if no URL is provided"),
    thumbnailUrl: z.string().optional(),
  }),
  execute: async ({ title, description, category: categoryName, level: levelName, duration, price, instructorId, thumbnailPrompt, thumbnailUrl }) => {
    await checkAdmin();

    let thumbnail = thumbnailUrl || "";
    if (!thumbnail && thumbnailPrompt) {
        try {
            thumbnail = await generateImage(thumbnailPrompt);
        } catch (e) {
            console.error("Failed to generate thumbnail", e);
            thumbnail = "https://placehold.co/600x400?text=Course";
        }
    } else if (!thumbnail) {
        thumbnail = "https://placehold.co/600x400?text=Course";
    }

    try {
        // 1. Get or create ProductCategory
        const categorySlug = categoryName.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/gi, '-').replace(/^-+|-+$/g, '');
        const categoryRecord = await db.productCategory.upsert({
          where: { slug: categorySlug },
          update: {},
          create: { name: categoryName, slug: categorySlug }
        });

        // 2. Get or create CourseLevel
        const levelSlug = levelName.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/gi, '-').replace(/^-+|-+$/g, '');
        const levelRecord = await db.courseLevel.upsert({
          where: { slug: levelSlug },
          update: {},
          create: { name: levelName, slug: levelSlug }
        });

        // 3. Create Product
        const product = await db.product.create({
          data: {
            title,
            description,
            price,
            thumbnail,
            type: "COURSE",
            categories: { connect: { id: categoryRecord.id } }
          }
        });

        // 4. Create Course
        const course = await db.course.create({
          data: {
            duration,
            instructorId,
            levelId: levelRecord.id,
            productId: product.id,
          },
          include: {
            product: true,
            instructor: true,
            level: true,
          }
        });

        return { success: true, course };
    } catch (error: any) {
        return { error: `Failed to create course: ${error.message}` };
    }
  },
});

export const updateCourse = tool({
  description: "Update an existing course. Requires admin privileges.",
  parameters: z.object({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    level: z.string().optional(),
    duration: z.string().optional(),
    price: z.number().optional(),
    instructorId: z.string().optional(),
    thumbnailPrompt: z.string().optional(),
    thumbnailUrl: z.string().optional(),
  }),
  execute: async ({ id, title, description, category: categoryName, level: levelName, duration, price, instructorId, thumbnailPrompt, thumbnailUrl }) => {
    await checkAdmin();

    try {
        const existingCourse = await db.course.findUnique({ where: { id } });
        if (!existingCourse) {
          return { error: "Course not found" };
        }

        const productData: any = {};
        if (title) productData.title = title;
        if (description) productData.description = description;
        if (price !== undefined) productData.price = price;

        if (thumbnailUrl) {
            productData.thumbnail = thumbnailUrl;
        } else if (thumbnailPrompt) {
            try {
                productData.thumbnail = await generateImage(thumbnailPrompt);
            } catch (e) {
                // keep old or ignore
            }
        }

        if (categoryName) {
            const categorySlug = categoryName.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/gi, '-').replace(/^-+|-+$/g, '');
            const categoryRecord = await db.productCategory.upsert({
              where: { slug: categorySlug },
              update: {},
              create: { name: categoryName, slug: categorySlug }
            });
            productData.categories = {
              set: [],
              connect: [{ id: categoryRecord.id }]
            };
        }

        // Update parent Product
        await db.product.update({
          where: { id: existingCourse.productId },
          data: productData,
        });

        const courseData: any = {};
        if (duration) courseData.duration = duration;
        if (instructorId) courseData.instructorId = instructorId;

        if (levelName) {
            const levelSlug = levelName.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/gi, '-').replace(/^-+|-+$/g, '');
            const levelRecord = await db.courseLevel.upsert({
              where: { slug: levelSlug },
              update: {},
              create: { name: levelName, slug: levelSlug }
            });
            courseData.levelId = levelRecord.id;
        }

        // Update Course subtype
        const course = await db.course.update({
            where: { id },
            data: courseData,
            include: {
              product: true,
              instructor: true,
              level: true,
            }
        });

        return { success: true, course };
    } catch (e: any) {
        return { error: `Failed to update course: ${e.message}` };
    }
  },
});

export const readCourses = tool({
  description: "List courses with optional filtering. Requires admin privileges.",
  parameters: z.object({
    query: z.string().optional().describe("Search by title or description"),
    category: z.string().optional(),
    limit: z.number().default(10),
  }),
  execute: async ({ query, category, limit }) => {
    await checkAdmin();
    const where: any = {};
    if (query) {
      where.product = {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
        ]
      };
    }
    if (category) {
      if (!where.product) where.product = {};
      where.product.categories = {
        some: { name: category }
      };
    }

    const courses = await db.course.findMany({
      where,
      take: limit,
      include: {
        product: {
          include: {
            categories: true,
          }
        },
        instructor: { select: { name: true, email: true } },
        level: true,
      },
      orderBy: { product: { createdAt: "desc" } },
    });

    const mappedCourses = courses.map(c => ({
      id: c.id,
      title: c.product.title,
      description: c.product.description,
      price: c.product.price,
      thumbnail: c.product.thumbnail,
      duration: c.duration,
      instructor: c.instructor,
      category: c.product.categories[0]?.name || "Unknown",
      level: c.level.name,
    }));

    return { courses: mappedCourses };
  },
});
