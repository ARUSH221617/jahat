"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Loader2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";

const Footer = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
    subject: "ارتباط سریع از پاورقی",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.message.trim()
    ) {
      toast({
        title: "خطا در ارسال",
        description: "لطفاً تمامی فیلدها را به درستی پر کنید.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a syntactically valid email format for backend validation compatibility
      const sanitizedPhone = formData.phone.trim().replace(/\s+/g, "");
      const emailValue = `${sanitizedPhone}@phone.com`;
      const enrichedMessage = `شماره تلفن: ${formData.phone}\n\nپیام:\n${formData.message}`;

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: emailValue,
          message: enrichedMessage,
          subject: formData.subject,
        }),
      });

      if (response.ok) {
        toast({
          title: "پیام با موفقیت ارسال شد!",
          description: "کارشناسان ما به زودی با شما تماس خواهند گرفت.",
        });
        setFormData({
          name: "",
          phone: "",
          message: "",
          subject: "ارتباط سریع از پاورقی",
        });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast({
        title: "خطا در برقراری ارتباط",
        description: "ارسال پیام با خطا مواجه شد. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative mt-16 md:mt-40" dir="rtl">
      {/* Quick Contact Form */}
      <div className="w-[calc(100%-2rem)] max-w-6xl mx-auto rounded-3xl p-6 md:p-8 bg-white shadow-2xl z-10 relative -mb-16 md:-mb-24 md:absolute md:-top-24 md:left-1/2 md:-translate-x-1/2 border border-gray-100">
        <h2 className="font-bold text-2xl text-primary mb-4 text-center md:text-start">
          ارتباط سریع
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
        >
          <div className="md:col-span-3">
            <Label
              htmlFor="footer-name"
              className="text-teal-900 font-bold mb-1.5 block text-sm"
            >
              نام و نام خانوادگی
            </Label>
            <Input
              id="footer-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="مثال: علی رضایی"
              dir="rtl"
              required
              className="w-full bg-cyan-50 placeholder:text-cyan-600/50 placeholder:text-center text-shadow-primary-foreground border-0 focus:bg-cyan-100 focus:border-cyan-100 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none transition-colors rounded-4xl py-6 px-12"
            />
          </div>
          <div className="md:col-span-3">
            <Label
              htmlFor="footer-phone"
              className="text-teal-900 font-bold mb-1.5 block text-sm"
            >
              شماره تلفن
            </Label>
            <Input
              id="footer-phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
              required
              className="w-full bg-cyan-50 placeholder:text-cyan-600/50 placeholder:text-center text-shadow-primary-foreground border-0 focus:bg-cyan-100 focus:border-cyan-100 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none transition-colors rounded-4xl py-6 px-12"
            />
          </div>
          <div className="md:col-span-6">
            <Label
              htmlFor="footer-message"
              className="text-teal-900 font-bold mb-1.5 block text-sm"
            >
              پیام شما
            </Label>
            <div className="relative flex items-center">
              <textarea
                id="footer-message"
                name="message"
                value={formData.message}
                rows={1}
                onChange={handleInputChange}
                placeholder="من مى خواستم در مورد شيوه مطالعه ومسير..."
                required
                dir="rtl"
                className="w-full overflow-hidden bg-cyan-50 placeholder:text-cyan-600/50 placeholder:text-center placeholder:text-sm text-shadow-primary-foreground border-0 focus:bg-cyan-100 focus:border-cyan-100 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none transition-colors rounded-4xl py-3 ps-12 pe-28 resize-none min-h-12 h-12"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                size={"sm"}
                className="absolute end-3 top-1/2 -translate-y-1/2 bg-cyan-500 text-white hover:bg-cyan-500/90 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 px-3 font-semibold drop-shadow-xl drop-shadow-cyan-200 rounded-2xl"
              >
                {isSubmitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                    <span>بفرست</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Main Footer Container */}
      <div className="px-4 sm:px-6 lg:px-8 pb-12 pt-24 md:pt-36 bg-primary text-white">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo-second-white.png"
                alt="Jahat Logo"
                width={125}
                height={125}
                className="w-32 h-auto"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              موسسه آموزشی جهت؛ ارائه‌دهنده دوره‌های تخصصی و کاربردی
              برنامه‌نویسی، طراحی وب، مهارت‌های اداری و کارگاه‌های آمادگی بازار
              کار.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">
              دسترسی سریع
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-sm"
                >
                  صفحه اصلی
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-sm"
                >
                  درباره ما
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-sm"
                >
                  دوره‌های آموزشی
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-sm"
                >
                  وبلاگ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-sm"
                >
                  تماس با ما
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Courses / Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">
              دوره‌های آموزشی
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/courses"
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-sm"
                >
                  برنامه‌نویسی و طراحی وب
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-sm"
                >
                  مهارت‌های هفت‌گانه کامپیوتر (ICDL)
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-sm"
                >
                  کارگاه‌های مهارتی تخصصی
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-sm"
                >
                  آمادگی آزمون‌های مهارتی
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">
              اطلاعات تماس
            </h3>
            <address className="space-y-3.5 not-italic text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
                <span className="text-gray-300 leading-relaxed">
                  ایران، خوزستان، خرمشهر
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-5 w-5 text-yellow-400 shrink-0" />
                <a
                  href="tel:+986123456789"
                  dir="ltr"
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-right"
                >
                  +۹۸ ۶۱ ۲۳۴۵ ۶۷۸۹
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-5 w-5 text-yellow-400 shrink-0" />
                <a
                  href="mailto:info@jahatintl.com"
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  info@jahatintl.com
                </a>
              </div>
            </address>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 bg-white py-4 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-sm font-semibold text-primary">
          <p>
            © {new Date().getFullYear()} کلیه حقوق این سایت متعلق به موسسه
            آموزشی جهت می‌باشد.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
