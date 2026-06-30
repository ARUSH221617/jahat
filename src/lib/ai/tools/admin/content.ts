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

// Post (Blog)
export const createPost = tool({
  description: "Create a new blog post. Requires admin privileges.",
  parameters: z.object({
    title: z.string(),
    slug: z.string(),
    content: z.string(),
    excerpt: z.string().optional(),
    featuredImagePrompt: z.string().optional(),
    featuredImageUrl: z.string().optional(),
    published: z.boolean().default(false),
  }),
  execute: async ({ title, slug, content, excerpt, featuredImagePrompt, featuredImageUrl, published }) => {
    const session = await checkAdmin();

    let featuredImage = featuredImageUrl || null;
    if (!featuredImage && featuredImagePrompt) {
        try {
            featuredImage = await generateImage(featuredImagePrompt);
        } catch (e) {
            console.error("Failed to generate featured image", e);
        }
    }

    try {
        const post = await db.post.create({
            data: {
                title,
                slug,
                content,
                excerpt,
                featuredImage,
                published,
                authorId: session.user.id,
                publishedAt: published ? new Date() : null,
            }
        });
        return { success: true, post };
    } catch (e: any) {
        return { error: `Failed to create post: ${e.message}` };
    }
  }
});

export const updatePost = tool({
    description: "Update a blog post. Requires admin privileges.",
    parameters: z.object({
      id: z.string(),
      title: z.string().optional(),
      content: z.string().optional(),
      excerpt: z.string().optional(),
      published: z.boolean().optional(),
      featuredImagePrompt: z.string().optional(),
      featuredImageUrl: z.string().optional(),
    }),
    execute: async ({ id, title, content, excerpt, published, featuredImagePrompt, featuredImageUrl }) => {
      await checkAdmin();
      const data: any = {};
      if (title) data.title = title;
      if (content) data.content = content;
      if (excerpt) data.excerpt = excerpt;
      if (published !== undefined) {
          data.published = published;
          if (published) data.publishedAt = new Date();
      }

      if (featuredImageUrl) {
          data.featuredImage = featuredImageUrl;
      } else if (featuredImagePrompt) {
          try {
              data.featuredImage = await generateImage(featuredImagePrompt);
          } catch (e) {}
      }

      try {
          const post = await db.post.update({ where: { id }, data });
          return { success: true, post };
      } catch (e: any) {
          return { error: `Failed to update post: ${e.message}` };
      }
    }
});

export const readPosts = tool({
    description: "List blog posts. Requires admin privileges.",
    parameters: z.object({
      query: z.string().optional(),
      limit: z.number().default(10),
    }),
    execute: async ({ query, limit }) => {
        await checkAdmin();
        const where: any = {};
        if (query) {
            where.OR = [
                { title: { contains: query, mode: "insensitive" } },
                { content: { contains: query, mode: "insensitive" } },
            ];
        }
        const posts = await db.post.findMany({ where, take: limit, orderBy: { createdAt: "desc" } });
        return { posts };
    }
});

// Testimonials
export const createTestimonial = tool({
    description: "Create a testimonial. Requires admin privileges.",
    parameters: z.object({
        name: z.string(),
        role: z.string(),
        content: z.string(),
        avatarPrompt: z.string().optional(),
        avatarUrl: z.string().optional(),
    }),
    execute: async ({ name, role, content, avatarPrompt, avatarUrl }) => {
        await checkAdmin();
        let avatar = avatarUrl || "";
        if (!avatar && avatarPrompt) {
            try {
                avatar = await generateImage(avatarPrompt);
            } catch (e) {
                avatar = "https://placehold.co/100x100";
            }
        } else if (!avatar) {
             avatar = "https://placehold.co/100x100";
        }

        const testimonial = await db.testimonial.create({
            data: { name, role, content, avatar }
        });
        return { success: true, testimonial };
    }
});

export const readTestimonials = tool({
    description: "List testimonials.",
    parameters: z.object({ limit: z.number().default(10) }),
    execute: async ({ limit }) => {
        await checkAdmin();
        const testimonials = await db.testimonial.findMany({ take: limit, orderBy: { createdAt: "desc" } });
        return { testimonials };
    }
});


// Contacts
export const readContacts = tool({
    description: "Read contact form submissions.",
    parameters: z.object({ limit: z.number().default(10) }),
    execute: async ({ limit }) => {
        await checkAdmin();
        const contacts = await db.contact.findMany({ take: limit, orderBy: { createdAt: "desc" } });
        return { contacts };
    }
});
