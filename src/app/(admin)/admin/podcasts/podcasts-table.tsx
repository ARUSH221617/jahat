"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

export interface PodcastAdminData {
  id: string;
  productId: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  host: string;
  episodes: number;
  audioUrl: string;
  category: string;
  categoryId: string;
  currency?: string;
  createdAt: string;
  updatedAt: string;
}

export function getPodcastsColumns(
  onEdit?: (podcast: PodcastAdminData) => void,
  onDelete?: (podcast: PodcastAdminData) => void
) {
  return [
    {
      key: "title",
      title: "Title",
      render: (podcast: PodcastAdminData) => <div className="font-medium">{podcast.title}</div>,
    },
    {
      key: "host",
      title: "Host",
      render: (podcast: PodcastAdminData) => podcast.host || "N/A",
    },
    {
      key: "category",
      title: "Category",
      render: (podcast: PodcastAdminData) => podcast.category,
    },
    {
      key: "episodes",
      title: "Episodes",
      render: (podcast: PodcastAdminData) => `${podcast.episodes} episodes`,
    },
    {
      key: "price",
      title: "Price",
      render: (podcast: PodcastAdminData) => {
        const price = podcast.price || 0;
        const currency = podcast.currency || "IRR";
        const displayPrice = currency === "IRT" ? price / 10 : price;
        return (
          <div className="font-medium">
            {displayPrice.toLocaleString()} {currency}
          </div>
        );
      },
    },
    {
      key: "audioUrl",
      title: "Audio Link",
      render: (podcast: PodcastAdminData) => {
        if (!podcast.audioUrl) return <span className="text-slate-400 text-xs">No Audio</span>;
        return (
          <a
            href={podcast.audioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#219ebc] hover:underline"
          >
            Play Audio <ExternalLink className="h-3 w-3" />
          </a>
        );
      },
    },
    {
      key: "createdAt",
      title: "Created At",
      render: (podcast: PodcastAdminData) => new Date(podcast.createdAt).toLocaleDateString(),
    },
  ];
}
