import { z } from 'zod';

// User Schema
export const userSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6).optional(), // Changed to optional to allow invite flow/admin creation without password
  role: z.string().default('user'),
});

export const userUpdateSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Course Schema
export const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  levelId: z.string().min(1, "Level is required"),
  duration: z.string().min(1, "Duration is required"),
  thumbnail: z.string().optional().or(z.literal("")),
  price: z.coerce.number().min(0).default(0),
  instructorId: z.string().min(1, "Instructor is required"),
});

export const courseUpdateSchema = courseSchema.partial().extend({
  id: z.string(),
});

// Product Schema
export const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0).default(0),
  thumbnail: z.string().optional().or(z.literal("")),
  type: z.enum(["COURSE", "BOOK", "PODCAST", "BUNDLE"]).default("BOOK"),
  categoryIds: z.array(z.string()).default([]),
  tags: z.string().optional(),
  // Subtype specific fields
  courseId: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  pages: z.coerce.number().optional().nullable(),
  host: z.string().optional().nullable(),
  episodes: z.coerce.number().optional().nullable(),
  // Bundle items
  courseIds: z.array(z.string()).optional(),
  bookIds: z.array(z.string()).optional(),
  podcastIds: z.array(z.string()).optional(),
});

export const productUpdateSchema = productSchema.partial().extend({
  id: z.string().optional(),
});

// Certificate Schema
export const certificateSchema = z.object({
  userId: z.string().min(1),
  courseId: z.string().min(1),
  status: z.string().default('valid'),
});

export const certificateUpdateSchema = z.object({
  id: z.string(),
  status: z.string().optional(),
});

// Testimonial Schema
export const testimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  content: z.string().min(1),
  avatar: z.string().optional().or(z.literal("")), // Relaxed url() validation
});

export const testimonialUpdateSchema = testimonialSchema.partial().extend({
  id: z.string(),
});

// Contact Schema
export const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  message: z.string().min(1),
  subject: z.string().optional(),
});

// Book Schema
export const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  author: z.string().optional().or(z.literal("")),
  pages: z.coerce.number().min(0).default(0),
  pdfUrl: z.string().optional().or(z.literal("")),
  thumbnail: z.string().optional().or(z.literal("")),
  price: z.coerce.number().min(0).default(0),
});

export const bookUpdateSchema = bookSchema.partial().extend({
  id: z.string(),
});

// Podcast Schema
export const podcastSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  host: z.string().optional().or(z.literal("")),
  episodes: z.coerce.number().min(0).default(0),
  audioUrl: z.string().optional().or(z.literal("")),
  thumbnail: z.string().optional().or(z.literal("")),
  price: z.coerce.number().min(0).default(0),
});

export const podcastUpdateSchema = podcastSchema.partial().extend({
  id: z.string(),
});
