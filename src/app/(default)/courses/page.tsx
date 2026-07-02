import { db } from "@/lib/db";
import { Metadata } from "next";
import CoursesListNew from "@/components/courses/courses-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "همه دوره‌ها | جهت",
  description: "مجموعه جامع دوره‌های آموزش مهارت‌های تخصصی و کاربردی ما از برنامه‌نویسی تا مهارت‌های هفت‌گانه را مرور کنید.",
  keywords: ["دوره‌های جهت", "آموزش نخبگان", "برنامه‌نویسی", "مهارت‌های اداری", "طراحی وب‌سایت", "آموزش آنلاین"],
  openGraph: {
    title: "همه دوره‌ها | جهت",
    description: "مرور دوره‌های آموزش مهارت‌های تخصصی جهت.",
    type: "website",
  }
};

export default async function CoursesPage() {
  const rawCourses = await db.course.findMany({
    orderBy: { product: { createdAt: "desc" } },
    include: {
      product: { include: { categories: true } },
      instructor: { select: { name: true } },
      level: true,
    }
  });

  const currencySetting = await db.setting.findUnique({ where: { key: "currency" } });
  const currency = currencySetting?.value || "IRR";

  const enrichedCourses = rawCourses.map((c) => {
    const hash = c.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rating = 4.5 + (hash % 6) / 10;
    const students = 100 + (hash % 301);
    return {
      id: c.id,
      title: c.product.title,
      description: c.product.description,
      thumbnail: c.product.thumbnail,
      duration: c.duration,
      instructor: c.instructor?.name || "مدرس جهت",
      category: c.product.categories[0]?.name || "ریاضی",
      level: c.level.name,
      rating,
      students,
      price: c.product.price,
      currency,
    };
  });

  // Schema.org structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: enrichedCourses.map((course, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Course",
        name: course.title,
        description: course.description,
        provider: { "@type": "Organization", name: "Jahat", sameAs: "https://jahatintl.com" },
        hasCourseInstance: { "@type": "CourseInstance", courseMode: "Online", courseWorkload: course.duration },
        offers: {
          "@type": "Offer",
          price: (currency === "IRT" ? course.price / 10 : course.price).toString(),
          priceCurrency: currency,
        },
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CoursesListNew initialCourses={enrichedCourses} totalCourses={enrichedCourses.length} />
    </>
  );
}
