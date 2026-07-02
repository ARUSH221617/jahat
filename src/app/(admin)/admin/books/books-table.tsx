"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

export interface BookAdminData {
  id: string;
  productId: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  author: string;
  pages: number;
  pdfUrl: string;
  category: string;
  categoryId: string;
  currency?: string;
  createdAt: string;
  updatedAt: string;
}

export function getBooksColumns(
  onEdit?: (book: BookAdminData) => void,
  onDelete?: (book: BookAdminData) => void
) {
  return [
    {
      key: "title",
      title: "Title",
      render: (book: BookAdminData) => <div className="font-medium">{book.title}</div>,
    },
    {
      key: "author",
      title: "Author",
      render: (book: BookAdminData) => book.author || "N/A",
    },
    {
      key: "category",
      title: "Category",
      render: (book: BookAdminData) => book.category,
    },
    {
      key: "pages",
      title: "Pages",
      render: (book: BookAdminData) => `${book.pages} pages`,
    },
    {
      key: "price",
      title: "Price",
      render: (book: BookAdminData) => {
        const price = book.price || 0;
        const currency = book.currency || "IRR";
        const displayPrice = currency === "IRT" ? price / 10 : price;
        return (
          <div className="font-medium">
            {displayPrice.toLocaleString()} {currency}
          </div>
        );
      },
    },
    {
      key: "pdfUrl",
      title: "PDF File",
      render: (book: BookAdminData) => {
        if (!book.pdfUrl) return <span className="text-slate-400 text-xs">No PDF</span>;
        return (
          <a
            href={book.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#219ebc] hover:underline"
          >
            Open File <ExternalLink className="h-3 w-3" />
          </a>
        );
      },
    },
    {
      key: "createdAt",
      title: "Created At",
      render: (book: BookAdminData) => new Date(book.createdAt).toLocaleDateString(),
    },
  ];
}
