import { expect, test } from "@playwright/test";

test.describe("Contact Page E2E", () => {
  test("should load the contact page, submit the form, and show success toast", async ({ page }) => {
    // Go to contact page
    await page.goto("/contact");

    // Verify contact page content
    await expect(page.locator("h1")).toContainText("ارتباط با ما");
    await expect(page.locator("text=ارسال پیام به ما")).toBeVisible();

    // Fill form
    await page.fill("#name", "کاربر تستی ای تو ای");
    await page.fill("#email", "e2e-user@example.com");
    await page.fill("#phone", "09123456789");
    await page.fill("#subject", "بررسی عملکرد فرم تماس");
    await page.fill("#message", "این یک پیام تستی فرستاده شده از تست E2E است.");

    // Submit form
    await page.click("button[type='submit']");

    // Verify toast notification appears
    const toast = page.getByTestId("toast");
    await expect(toast).toBeVisible({ timeout: 15000 });
    await expect(toast).toContainText("پیام با موفقیت ارسال شد!");

    // Verify form fields are cleared after successful submit
    await expect(page.locator("#name")).toHaveValue("");
    await expect(page.locator("#email")).toHaveValue("");
    await expect(page.locator("#phone")).toHaveValue("");
    await expect(page.locator("#subject")).toHaveValue("");
    await expect(page.locator("#message")).toHaveValue("");
  });
});
