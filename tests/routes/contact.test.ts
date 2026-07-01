import { expect, test } from "@playwright/test";

test.describe("/api/contact", () => {
  test("should successfully submit a contact message with valid data", async ({ request }) => {
    const payload = {
      name: "تست کننده سیستم",
      email: "test.system@example.com",
      phone: "09123456789",
      subject: "تست اتوماتیک",
      message: "این یک پیام آزمایشی ارسال شده توسط تست خودکار است.",
    };

    const response = await request.post("/api/contact", {
      data: payload,
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.id).toBeDefined();
  });

  test("should return 400 validation error when email is invalid", async ({ request }) => {
    const payload = {
      name: "تست کننده سیستم",
      email: "invalid-email-format",
      subject: "تست اتوماتیک",
      message: "این یک پیام آزمایشی است.",
    };

    const response = await request.post("/api/contact", {
      data: payload,
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Validation failed");
    expect(body.details).toBeDefined();
  });

  test("should return 400 validation error when name is missing", async ({ request }) => {
    const payload = {
      email: "test.system@example.com",
      subject: "تست اتوماتیک",
      message: "این یک پیام آزمایشی است.",
    };

    const response = await request.post("/api/contact", {
      data: payload,
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Validation failed");
  });

  test("should successfully retrieve contact messages", async ({ request }) => {
    const response = await request.get("/api/contact");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });
});
