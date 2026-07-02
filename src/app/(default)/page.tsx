"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Compass,
  Ruler,
  Calculator,
  Brain,
  GraduationCap,
  CalendarRange,
  Activity,
  Headphones,
  Star,
  Users,
  Play,
  ArrowLeft,
  Sparkles,
  FileText,
  Clock,
  ArrowUpRight
} from "lucide-react";

// Local static data matching the exact required math tutoring details
const grades = [
  { id: "grade-7", title: "پایه هفتم", icon: BookOpen, color: "from-blue-500/10 to-indigo-500/10", border: "hover:border-blue-500", text: "text-blue-600", accentBg: "bg-blue-50" },
  { id: "grade-8", title: "پایه هشتم", icon: Compass, color: "from-cyan-500/10 to-blue-500/10", border: "hover:border-cyan-500", text: "text-cyan-600", accentBg: "bg-cyan-50" },
  { id: "grade-9", title: "پایه نهم", icon: Ruler, color: "from-indigo-500/10 to-purple-500/10", border: "hover:border-indigo-500", text: "text-indigo-600", accentBg: "bg-indigo-50" },
  { id: "grade-10", title: "پایه دهم", icon: Calculator, color: "from-purple-500/10 to-pink-500/10", border: "hover:border-purple-500", text: "text-purple-600", accentBg: "bg-purple-50" },
  { id: "grade-11", title: "پایه یازدهم", icon: Brain, color: "from-rose-500/10 to-orange-500/10", border: "hover:border-rose-500", text: "text-rose-600", accentBg: "bg-rose-50" },
  { id: "grade-12", title: "پایه دوازدهم", icon: GraduationCap, color: "from-amber-500/10 to-yellow-500/10", border: "hover:border-amber-500", text: "text-amber-600", accentBg: "bg-amber-50" },
];

const mathCourses = [
  {
    id: "math-9",
    title: "دوره جامع ریاضی نهم",
    instructor: "استاد احمدی",
    price: "۱,۹۰۰,۰۰۰ تومان",
    originalPrice: "۲,۵۰۰,۰۰۰ تومان",
    duration: "۳۶ ساعت آموزش",
    level: "متوسطه اول",
    badge: "ویژه امتحانات نهایی",
    thumbnail: "/images/math_course_card.jpg"
  },
  {
    id: "math-10",
    title: "دوره جامع ریاضی دهم (تجربی و ریاضی)",
    instructor: "استاد علوی",
    price: "۲,۲۰۰,۰۰۰ تومان",
    originalPrice: "۲,۸۰۰,۰۰۰ تومان",
    duration: "۴۲ ساعت آموزش",
    level: "متوسطه دوم",
    badge: "پرفروش‌ترین",
    thumbnail: "/images/math_course_card.jpg"
  },
  {
    id: "math-11",
    title: "حسابان یازدهم تخصصی رشته ریاضی",
    instructor: "استاد حسینی",
    price: "۲,۵۰۰,۰۰۰ تومان",
    originalPrice: "۳,۱۰۰,۰۰۰ تومان",
    duration: "۴۸ ساعت آموزش",
    level: "متوسطه دوم",
    badge: "کنکور و تشریحی",
    thumbnail: "/images/math_course_card.jpg"
  }
];

const whyChooseUs = [
  {
    title: "Qualified Teachers (دبیران با‌تجربه)",
    description: "تدریس توسط اساتید مطرح و گزینش‌شدۀ کشور با سال‌ها تجربۀ درخشان آموزشی در مدارس برتر.",
    icon: GraduationCap,
    bgColor: "bg-blue-50 text-blue-600"
  },
  {
    title: "Organized Plan (برنامه‌ریزی منظم)",
    description: "برنامه درسی زمان‌بندی شده و گام‌به‌گام برای پوشش کامل مطالب، از اولین جلسه تا شب امتحان.",
    icon: CalendarRange,
    bgColor: "bg-cyan-50 text-cyan-600"
  },
  {
    title: "Step-by-Step Training (آموزش گام‌به‌گام)",
    description: "تدریس مفاهیم از سطح پایه تا پیشرفته، به همراه حل تمرین‌ها و نمونه سوالات امتحانی فراوان.",
    icon: Activity,
    bgColor: "bg-indigo-50 text-indigo-600"
  },
  {
    title: "Support (پشتیبانی و رفع اشکال)",
    description: "پشتیبانی مستمر آنلاین توسط رتبه‌های برتر کنکور جهت پاسخگویی به سوالات و رفع اشکال در طول دوره.",
    icon: Headphones,
    bgColor: "bg-purple-50 text-purple-600"
  }
];

const mathTestimonials = [
  {
    id: "test-1",
    name: "زهرا محمدی",
    role: "دانش‌آموز پایه نهم - معدل ۲۰",
    content: "آموزش‌های استاد احمدی در دوره ریاضی نهم به قدری ساده و مفهومی بود که ترس همیشگی من از ریاضی کاملاً برطرف شد و توانستم نمره ۲۰ بگیرم. بسیار سپاسگزارم.",
    rating: 5,
  },
  {
    id: "test-2",
    name: "امیرحسین رضایی",
    role: "دانش‌آموز پایه دوازدهم تجربی",
    content: "نکته‌های تستی و روش‌های حل سریع مسائل هندسه و حسابان در دوره‌ها فوق‌العاده کاربردی هستند. در آزمون‌های آزمایشی پیشرفت چشمگیری داشتم.",
    rating: 5,
  },
  {
    id: "test-3",
    name: "دکتر علی علوی",
    role: "ولی دانش‌آموز پایه هشتم",
    content: "برنامه‌ریزی منظم، پیگیری پشتیبان‌ها و تدریس گام‌به‌گام اساتید جهت واقعاً بی‌نظیر است. فرزندم انگیزه و علاقه زیادی به حل مسائل ریاضی پیدا کرده است.",
    rating: 5,
  }
];

const mathArticles = [
  {
    id: "art-1",
    title: "۵ گام طلایی برای بیست گرفتن در ریاضی نهم امتحانات نهایی",
    description: "بررسی بارم‌بندی، مباحث پرسوال و روش‌های اصولی مطالعه ریاضی نهم برای کسب نمره بیست در امتحان نهایی.",
    date: "۱۰ خرداد ۱۴۰۵",
    readTime: "مطالعه ۵ دقیقه‌ای",
  },
  {
    id: "art-2",
    title: "چگونه ترس و اضطراب ناشی از درس ریاضی را کنترل کنیم؟",
    description: "راهکارهای علمی و روانشناختی برای غلبه بر اضطراب ریاضی و افزایش تمرکز و یادگیری سر کلاس درس.",
    date: "۵ خرداد ۱۴۰۵",
    readTime: "مطالعه ۷ دقیقه‌ای",
  },
  {
    id: "art-3",
    title: "اهمیت و کاربرد هندسه و ریاضیات در زندگی روزمره",
    description: "نگاهی جذاب به کاربردهای واقعی فرمول‌های ریاضی و اشکال هندسی در معماری مدرن، مهندسی و هنر.",
    date: "۲ خرداد ۱۴۰۵",
    readTime: "مطالعه ۴ دقیقه‌ای",
  }
];

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [articles, setArticles] = useState<any[]>(mathArticles);
  const [courses, setCourses] = useState<any[]>(mathCourses);

  useEffect(() => {
    setIsLoaded(true);

    // Fetch latest blog posts from public API
    fetch("/api/blog?limit=3")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch");
      })
      .then((data) => {
        if (data && data.length > 0) {
          const mappedArticles = data.map((post: any) => ({
            id: post.id || post.slug,
            title: post.title,
            description: post.excerpt || (post.content ? post.content.replace(/<[^>]*>/g, '').slice(0, 120) + "..." : ""),
            date: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("fa-IR") : "۱۰ خرداد ۱۴۰۵",
            readTime: "مطالعه ۵ دقیقه‌ای",
            slug: post.slug,
            image: post.featuredImage || "/images/math_course_card.jpg",
          }));
          setArticles(mappedArticles);
        }
      })
      .catch((err) => {
        console.error("Error loading articles from API:", err);
      });

    // Fetch latest courses from public API
    fetch("/api/courses")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch courses");
      })
      .then((data) => {
        if (data && data.length > 0) {
          const mappedCourses = data.slice(0, 3).map((c: any, index: number) => {
            const isIrt = c.currency === "IRT";
            const priceVal = isIrt ? Math.floor(c.price / 10) : c.price;
            const unit = isIrt ? "تومان" : "ریال";
            const priceStr = c.price === 0 ? "رایگان" : `${priceVal.toLocaleString("fa-IR")} ${unit}`;
            const originalPriceStr = c.price === 0 
              ? "" 
              : `${Math.floor(priceVal * 1.3).toLocaleString("fa-IR")} ${unit}`;
            const badges = ["ویژه امتحانات نهایی", "پرفروش‌ترین", "دوره جدید"];
            return {
              id: c.id,
              title: c.title,
              instructor: c.instructor?.name || "مدرس جهت",
              price: priceStr,
              originalPrice: originalPriceStr,
              duration: c.duration || "آموزش جامع",
              level: c.level || "متوسطه",
              badge: badges[index % badges.length],
              thumbnail: c.thumbnail || "/images/math_course_card.jpg"
            };
          });
          setCourses(mappedCourses);
        }
      })
      .catch((err) => {
        console.error("Error loading courses from API:", err);
      });
  }, []);

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": mathTestimonials.map(testimonial => ({
      "@type": "Review",
      "itemReviewed": {
        "@type": "Organization",
        "name": "مؤسسه آموزشی جهت"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "author": {
        "@type": "Person",
        "name": testimonial.name
      },
      "reviewBody": testimonial.content
    }))
  };

  return (
    <div className="min-h-screen font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
        {/* Abstract decorative elements */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Right-to-Left Layout: Text on the right/first, Image on the left (but in RTL, flow order starts right) */}
            <div
              className={`space-y-8 order-last lg:order-first transition-all duration-1000 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="space-y-4">
                <Badge className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                  <Sparkles className="h-3.5 w-3.5 me-1.5 inline-block text-yellow-300" />
                  برترین آکادمی تخصصی ریاضیات کشور
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#004e75] leading-tight font-sans">
                  یادگیری عمیق و مفهومی
                  <span className="text-[#219ebc] block mt-2">ریاضیات با جهت</span>
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                  آموزش تخصصی ریاضی متوسطه اول و دوم (پایه‌های هفتم تا دوازدهم) با استفاده از به‌روزترین ابزارها و متدهای تدریس. مفاهیم را به‌صورت ریشه‌ای بیاموزید و نمرات خود را متحول کنید.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/courses">
                  <Button
                    size="lg"
                    className="bg-[#219ebc] hover:bg-[#1a8da9] text-white font-bold px-8 py-6 rounded-2xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
                  >
                    <BookOpen className="me-2 h-5 w-5" />
                    مشاهده دوره‌های آموزشی
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-[#004e75] text-[#004e75] hover:bg-blue-50 font-bold px-8 py-6 rounded-2xl transition-all hover:scale-105"
                  >
                    درخواست مشاوره رایگان
                    <ArrowLeft className="ms-2 h-5 w-5 animate-pulse" />
                  </Button>
                </Link>
              </div>

              {/* Trust Badge / Proof */}
              <div className="pt-4 flex items-center gap-6 border-t border-slate-100">
                <div className="flex -space-x-3 rtl:space-x-reverse">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                      <Image
                        src={`/images/kttc-45.png`}
                        width={45}
                        height={45}
                        alt="دانش‌آموز موفق"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">بیش از ۱۰,۰۰۰ دانش‌آموز راضی</p>
                  <p className="text-xs text-slate-500">کسب نمرات عالی در امتحانات نهایی و قبولی در کنکور سراسری</p>
                </div>
              </div>
            </div>

            {/* Geometry Illustration Image Container */}
            <div
              className={`relative flex justify-center order-first lg:order-last transition-all duration-1000 delay-200 ${
                isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <div className="relative w-full max-w-[480px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-100 p-4">
                <Image
                  src="/images/hero_geometry.jpg"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 480px"
                  alt="دانش‌آموز در حال کار با ابزارهای هندسه و ریاضی"
                  className="object-cover rounded-2xl"
                />
                
                {/* Floating badge inside image container */}
                <div className="absolute -bottom-2 -start-2 bg-yellow-400 text-blue-900 p-4 rounded-2xl shadow-xl border-2 border-white max-w-[170px] hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/55 rounded-xl">
                      <Calculator className="h-6 w-6 text-blue-900" />
                    </div>
                    <div>
                      <p className="font-extrabold text-sm leading-tight">تدریس تخصصی هندسه</p>
                      <p className="text-[10px] text-blue-900/80 mt-0.5">با رویکرد کاملاً تشریحی</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner: Horizontal Blue Bar */}
      <section className="bg-[#004e75] text-white py-6 shadow-lg relative z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-x divide-white/10 rtl:divide-x-reverse text-center">
            <div className="space-y-1">
              <div className="flex justify-center mb-1 text-cyan-400">
                <Users className="h-6 w-6" />
              </div>
              <p className="text-2xl md:text-3xl font-extrabold">۱۰,۰۰۰+</p>
              <p className="text-xs md:text-sm text-cyan-100">دانش‌آموزان موفق</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-center mb-1 text-cyan-400">
                <BookOpen className="h-6 w-6" />
              </div>
              <p className="text-2xl md:text-3xl font-extrabold">۱۵+</p>
              <p className="text-xs md:text-sm text-cyan-100">دوره‌های تخصصی ریاضی</p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-center mb-1 text-cyan-400">
                <Clock className="h-6 w-6" />
              </div>
              <p className="text-2xl md:text-3xl font-extrabold">۲۰۰+</p>
              <p className="text-xs md:text-sm text-cyan-100">ساعت آموزش ویدیویی</p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-center mb-1 text-cyan-400">
                <Star className="h-6 w-6 fill-cyan-400" />
              </div>
              <p className="text-2xl md:text-3xl font-extrabold">۹۹٪</p>
              <p className="text-xs md:text-sm text-cyan-100">رضایت دانش‌آموزان</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grade-Level Selection Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-extrabold text-[#004e75]">
              انتخاب پایه تحصیلی
            </h2>
            <div className="h-1.5 w-24 bg-[#219ebc] mx-auto rounded-full" />
            <p className="text-slate-500 font-medium">
              پایه تحصیلی خود را انتخاب کنید تا به دوره‌های تخصصی و نمونه سوالات مرتبط دسترسی پیدا کنید
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {grades.map((grade) => {
              const IconComponent = grade.icon;
              return (
                <Link key={grade.id} href={`/courses?grade=${grade.id}`} className="group">
                  <div className={`h-full p-6 rounded-3xl border border-slate-100 bg-white text-center flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 ${grade.border}`}>
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${grade.color} ${grade.text} transition-transform duration-300 group-hover:scale-110`}>
                      <IconComponent className="h-7 w-7" />
                    </div>
                    <span className="font-extrabold text-[#004e75] text-base group-hover:text-[#219ebc] transition-colors duration-200">
                      {grade.title}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      آموزش جامع + تست
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Best-Selling Courses Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="space-y-4 text-center md:text-start">
              <h2 className="text-3xl font-extrabold text-[#004e75]">
                پرفروش‌ترین دوره‌های ریاضی
              </h2>
              <div className="h-1.5 w-24 bg-[#219ebc] mx-auto md:mx-0 rounded-full" />
              <p className="text-slate-500 font-medium max-w-xl">
                محبوب‌ترین و موثرترین دوره‌های آموزشی ما با تدریس مفهومی اساتید مطرح ریاضی کشور
              </p>
            </div>
            
            <Link href="/courses" className="mt-6 md:mt-0 self-center">
              <Button variant="outline" className="border-2 border-[#219ebc] text-[#219ebc] hover:bg-cyan-50 font-bold px-6 py-5 rounded-xl">
                مشاهده همه دوره‌ها
                <ArrowLeft className="ms-2 h-4 w-4 rtl:rotate-180" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-slate-100 bg-white group flex flex-col h-full"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {course.badge && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-[#219ebc] hover:bg-[#219ebc] text-white font-bold rounded-lg px-2.5 py-1">
                        {course.badge}
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-6 flex flex-col flex-grow justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">{course.level}</span>
                      <span>{course.duration}</span>
                    </div>
                    
                    <CardTitle className="text-lg font-extrabold text-[#004e75] leading-snug group-hover:text-[#219ebc] transition-colors">
                      {course.title}
                    </CardTitle>

                    <div className="flex items-center gap-2 text-sm text-slate-500 pt-1">
                      <GraduationCap className="h-4.5 w-4.5 text-[#219ebc]" />
                      <span className="font-bold">مدرس: {course.instructor}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-right">
                      {course.originalPrice && (
                        <p className="text-xs text-slate-400 line-through font-medium">{course.originalPrice}</p>
                      )}
                      <p className="text-base font-extrabold text-[#004e75]">{course.price}</p>
                    </div>

                    <Link href={`/courses/${course.id}`}>
                      <Button className="bg-[#004e75] hover:bg-[#003855] text-white font-bold rounded-xl px-4 py-2 text-xs transition-colors">
                        ثبت‌نام دوره
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-extrabold text-[#004e75]">
              چرا آکادمی ریاضی جهت؟
            </h2>
            <div className="h-1.5 w-24 bg-[#219ebc] mx-auto rounded-full" />
            <p className="text-slate-500 font-medium">
              ما بهترین بستر را برای یادگیری اصولی و عمیق ریاضیات و کسب موفقیت تحصیلی شما آماده کرده‌ایم
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="p-6 rounded-3xl border border-slate-100 bg-white flex flex-col gap-4 transition-all duration-300 hover:shadow-lg">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.bgColor}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="font-extrabold text-base text-[#004e75] pt-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Video & Samples Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Dark Video Player */}
            <div className="lg:col-span-6 order-last lg:order-first">
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center group cursor-pointer">
                {/* Overlay pattern/image to simulate a video */}
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity brightness-50" style={{ backgroundImage: `url('/images/math_course_card.jpg')` }} />
                
                {/* Mathematical floating graphics */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/60 to-transparent z-0" />
                
                {/* Glassmorphic Play Button */}
                <div className="relative z-10 w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
                  <Play className="h-8 w-8 text-white fill-white translate-x-[-1px] rtl:translate-x-[1px]" />
                </div>

                {/* Simulated video interface */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-white/80 font-medium">
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span>پخش نمونه تدریس</span>
                  </div>
                  <span className="bg-black/40 backdrop-blur-sm px-2.5 py-1.5 rounded-lg">۰۴:۱۲</span>
                </div>
              </div>
            </div>

            {/* Right Column: Detailed List */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-4">
                <Badge className="bg-blue-600 text-white font-bold rounded-lg px-2.5 py-1 text-xs">
                  نمونه تدریس رایگان
                </Badge>
                <h2 className="text-3xl font-extrabold text-[#004e75]">
                  کیفیت آموزش را بسنجید
                </h2>
                <div className="h-1.5 w-24 bg-[#219ebc] rounded-full" />
                <p className="text-slate-500 font-medium leading-relaxed">
                  ما به کیفیت آموزش خود ایمان داریم. پیش از تهیه هر دوره، می‌توانید ویدیوها و نمونه تدریس مباحث دشوار ریاضی را به صورت رایگان تماشا کنید تا با لحن و شیوه تدریس اساتید ما آشنا شوید:
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#219ebc]/10 text-[#219ebc] font-bold flex items-center justify-center shrink-0 text-sm">
                    ۱
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#004e75] text-base mb-1">تدریس مفهومی مبحث هم‌نهشتی مثلث‌ها</h4>
                    <p className="text-xs text-slate-400">حل مساله‌ها به زبان ساده به همراه رسم اشکال هندسی تعاملی</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#219ebc]/10 text-[#219ebc] font-bold flex items-center justify-center shrink-0 text-sm">
                    ۲
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#004e75] text-base mb-1">تکنیک‌های تست‌زنی هندسه و اتحادها</h4>
                    <p className="text-xs text-slate-400">آموزش ترفندهای محاسباتی بدون فرمول‌های سخت و تکراری</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#219ebc]/10 text-[#219ebc] font-bold flex items-center justify-center shrink-0 text-sm">
                    ۳
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#004e75] text-base mb-1">حل تشریحی نمونه سوالات امتحان نهایی خرداد</h4>
                    <p className="text-xs text-slate-400">تحلیل کامل روش تصحیح اوراق و پاسخ به شیوۀ طراحان امتحانات</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-extrabold text-[#004e75]">
              نظرات دانش‌آموزان و والدین
            </h2>
            <div className="h-1.5 w-24 bg-[#219ebc] mx-auto rounded-full" />
            <p className="text-slate-500 font-medium">
              داستان موفقیت دانش‌آموزان آکادمی جهت را از زبان خودشان بشنوید
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mathTestimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="hover:shadow-xl transition-all duration-300 border-slate-100 bg-white flex flex-col justify-between"
              >
                <CardContent className="p-8 space-y-6 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-slate-600 italic leading-relaxed text-sm">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-extrabold flex items-center justify-center shrink-0">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <p className="font-extrabold text-[#004e75] text-sm">{testimonial.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="space-y-4 text-center md:text-start">
              <h2 className="text-3xl font-extrabold text-[#004e75]">
                آخرین مطالب و مقالات وبلاگ
              </h2>
              <div className="h-1.5 w-24 bg-[#219ebc] mx-auto md:mx-0 rounded-full" />
              <p className="text-slate-500 font-medium max-w-xl">
                راهنماهای آموزشی، مقالات انگیزشی و ترفندهای مطالعه ریاضی برای دانش‌آموزان و والدین
              </p>
            </div>
            
            <Link href="/blog" className="mt-6 md:mt-0 self-center">
              <Button variant="outline" className="border-2 border-[#219ebc] text-[#219ebc] hover:bg-cyan-50 font-bold px-6 py-5 rounded-xl">
                مشاهده همه مقالات
                <ArrowLeft className="ms-2 h-4 w-4 rtl:rotate-180" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card
                key={article.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-100 bg-white group flex flex-col h-full"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src={article.image || "/images/math_course_card.jpg"}
                    alt={article.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-102"
                  />
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-slate-700 font-semibold rounded-lg px-2.5 py-1 text-[10px] shadow-sm">
                    {article.date}
                  </div>
                </div>

                <CardContent className="p-6 flex flex-col flex-grow justify-between">
                  <div className="space-y-3">
                    <CardTitle className="text-base font-extrabold text-[#004e75] leading-snug group-hover:text-[#219ebc] transition-colors line-clamp-2">
                      {article.title}
                    </CardTitle>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                      {article.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#219ebc] font-bold">
                    <span>{article.readTime}</span>
                    <Link href={`/blog/${article.slug || article.id}`} className="flex items-center gap-1 hover:underline">
                      <span>مطالعه مقاله</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Action / CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-indigo-800 text-white relative overflow-hidden">
        {/* Background glow overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent opacity-50" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold max-w-2xl mx-auto leading-tight">
            آماده‌اید نمره ریاضی خود را به اوج برسانید؟
          </h2>
          <p className="text-lg text-blue-100 max-w-xl mx-auto">
            به جمع هزاران دانش‌آموز موفقی بپیوندید که درس ریاضی را با متدهای نوین آکادمی جهت آموخته‌اند.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-extrabold px-8 py-6 rounded-2xl transition-transform hover:scale-105 shadow-xl"
              >
                همین حالا ثبت‌نام کنید
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-extrabold px-8 py-6 rounded-2xl transition-transform hover:scale-105"
              >
                مشاوره و ارزیابی رایگان
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
