"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  GraduationCap,
  Users,
  BookOpen,
  Award,
  Quote,
  Star,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

const categoryMap: { [key: string]: string } = {
  "Teaching Skills": "مهارت‌های تدریس",
  "Psychology": "روانشناسی",
  "Management": "مدیریت",
  "Technology": "فناوری",
  "Curriculum": "برنامه درسی",
  "Special Education": "آموزش استثنایی",
  "Assessment": "ارزشیابی",
  "Leadership": "رهبری",
  "Early Education": "آموزش ابتدایی"
};

const levelMap: { [key: string]: string } = {
  "Beginner": "مبتدی",
  "Intermediate": "متوسط",
  "Advanced": "پیشرفته"
};

const statistics = [
  { icon: GraduationCap, value: "۱,۲۰۰+", label: "مدرسین تربیت‌شده" },
  { icon: BookOpen, value: "۵۰+", label: "برنامه‌های آموزشی" },
  { icon: Award, value: "۲۰+", label: "سال‌های درخشش" },
  { icon: Users, value: "۹۸٪", label: "میزان رضایت" },
];

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  type CourseType = {
    id: string;
    title: string;
    description: string;
    category: string;
    level: string;
    duration: string;
    instructor: string;
    thumbnail?: string;
  };

  const [featuredCourses, setFeaturedCourses] = useState<CourseType[]>([]);
  type TestimonialType = {
    id: string;
    name: string;
    role: string;
    content: string;
    avatar?: string;
  };

  const [testimonials, setTestimonials] = useState<TestimonialType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsLoaded(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch courses
      const coursesResponse = await fetch("/api/courses");
      if (coursesResponse.ok) {
        let coursesData = await coursesResponse.json();

        // Process courses to handle potential nested instructor objects
        coursesData = coursesData.map((course: any) => ({
          ...course,
          instructor:
            typeof course.instructor === "object" && course.instructor?.name
              ? course.instructor.name
              : course.instructor || "Unknown Instructor",
        }));

        setFeaturedCourses(coursesData.slice(0, 3)); // Show first 3 courses
      }

      // Fetch testimonials
      const testimonialsResponse = await fetch("/api/testimonials");
      if (testimonialsResponse.ok) {
        let testimonialsData = await testimonialsResponse.json();

        // Process testimonials to ensure proper structure
        testimonialsData = testimonialsData.map((testimonial: any) => ({
          ...testimonial,
          name:
            typeof testimonial.name === "string"
              ? testimonial.name
              : testimonial.name?.toString() || "Unknown",
          role:
            typeof testimonial.role === "string"
              ? testimonial.role
              : testimonial.role?.toString() || "Unknown Role",
        }));

        setTestimonials(testimonialsData.slice(0, 3)); // Show first 3 testimonials
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const testimonialSchema = testimonials.map(testimonial => ({
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
  }));

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": testimonialSchema
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-blue-50 to-indigo-100 pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              className={`space-y-8 ${
                isLoaded ? "animate-fade-in" : "opacity-0"
              }`}
            >
              <div className="space-y-4">
                <Badge className="bg-yellow-400 text-blue-900 hover:bg-yellow-300">
                  آموزش مهارت‌های نوین و آکادمیک
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  توانمندسازی استعدادها برای
                  <span className="text-blue-600"> دنیای فردا</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  مؤسسه آموزشی جهت - دروازه شما به سوی تعالی حرفه‌ای و رشد شغلی در دنیای واقعی. به بیش از ۱,۲۰۰ شرکت‌کننده‌ای بپیوندید که مسیر شغلی خود را با برنامه‌های نوآورانه ما متحول کرده‌اند.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/courses">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                  >
                    <BookOpen className="me-2 h-5 w-5" />
                    مشاهده دوره‌ها
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3"
                  >
                    <ArrowRight className="me-2 h-5 w-5 rtl:rotate-180" />
                    درباره جهت
                  </Button>
                </Link>
              </div>
            </div>
            <div
              className={`relative ${
                isLoaded ? "animate-fade-in-delay" : "opacity-0"
              }`}
            >
              <div className="relative z-10">
                <Image
                  src="/images/hero.png"
                  width={400}
                  height={400}
                  alt="دانشجویان در کلاس درس"
                  className="rounded-2xl shadow-2xl w-full z-0"
                />
              </div>
              <div className="absolute -bottom-6 -start-6 z-10 bg-yellow-400 text-blue-900 p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <Award className="h-8 w-8" />
                  <div>
                    <p className="font-bold text-lg">۲۰+ سال</p>
                    <p className="text-sm">سابقه درخشان</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Jahat Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Image
              src="/images/about.png"
              width={400}
              height={400}
              alt="پردیس جهت"
              className="rounded-xl shadow-lg w-full"
            />
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  درباره مؤسسه آموزشی جهت
                </h2>
                <div className="h-1 w-20 bg-yellow-400 rounded"></div>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                مجموعه جهت با چشم‌انداز ایجاد یک سیستم خودکفا و نخبه‌پرور، در خط مقدم آموزش مهارت‌ها قرار دارد. ماموریت ما تجهیز دانش‌آموزان به مهارت‌های مدرن طراحی وب، برنامه‌نویسی، مهارت‌های اداری و آمادگی آزمون کنکور است.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                ما ارزش‌های آموزشی سنتی را با فناوری‌های نوآورانه تدریس ترکیب می‌کنیم تا تجربه‌های یادگیری تحول‌آفرینی ایجاد کنیم که به مدرسان برای الهام‌بخشی به نسل بعدی توانایی ببخشد.
              </p>
              <Link href="/about">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  مطالعه درباره تاریخچه جهت
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              دوره‌های ویژه
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              محبوب‌ترین برنامه‌های ما را که برای ارتقای مهارت‌های شما طراحی شده‌اند، کشف کنید
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading
              ? // Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-6 space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))
              : featuredCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="hover:shadow-xl transition-shadow duration-300 bg-white"
                  >
                    <CardHeader className="p-0">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      ) : (
                         <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                            <BookOpen className="h-12 w-12 text-gray-400" />
                         </div>
                      )}
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{categoryMap[course.category] || course.category}</Badge>
                        <Badge variant="outline">{levelMap[course.level] || course.level}</Badge>
                      </div>
                      <CardTitle className="text-xl text-gray-900">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 line-clamp-3">
                        {course.description}
                      </CardDescription>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{course.instructor}</span>
                        <span>{course.duration}</span>
                      </div>
                      <Link href={`/courses/${course.id}`}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          مشاهده دوره
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/courses">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                مشاهده تمام دوره‌ها
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold">
              تاثیر ما در قالب اعداد
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              دو دهه درخشش در آموزش و توسعه حرفه‌ای مهارت‌ها
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="bg-yellow-400 text-blue-900 p-4 rounded-full">
                    <stat.icon className="h-8 w-8" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl lg:text-4xl font-bold">{stat.value}</p>
                  <p className="text-blue-100">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              نظرات دانش‌آموختگان ما
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              از زبان دانشجویانی بشنوید که مسیر شغلی خود را با جهت متحول کرده‌اند
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading
              ? // Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardContent className="p-6 space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-12 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))
              : testimonials.map((testimonial) => (
                  <Card
                    key={testimonial.id}
                    className="p-6 hover:shadow-lg transition-shadow duration-300"
                  >
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <Quote className="h-8 w-8 text-blue-600 opacity-20" />
                      <p className="text-gray-600 italic leading-relaxed">
                        "{testimonial.content}"
                      </p>
                      <div className="flex items-center space-x-3 pt-4 border-t">
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {testimonial.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-linear-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              برای متحول کردن آینده شغلی خود آماده‌اید؟
            </h2>
            <p className="text-xl text-blue-100">
              به هزاران دانش‌آموز و کارآموزی بپیوندید که پیش از این گام بعدی را در توسعه حرفه‌ای خود برداشته‌اند.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button
                  size="lg"
                  className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-8 py-3"
                >
                  <CheckCircle className="me-2 h-5 w-5" />
                  ثبت‌نام کنید
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3"
                >
                  تماس با ما
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
