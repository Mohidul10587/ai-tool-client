"use client"

import { useEffect, useState } from "react"

type Ad = { id: number; url: string; description: string }

export function FeaturedAdsDisplay({ ads }: { ads: Ad[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (ads.length <= 1) return
    const timer = setInterval(() => setCurrent((c) => (c + 1) % ads.length), 10000)
    return () => clearInterval(timer)
  }, [ads.length])

  if (!ads.length) return null

  const ad = ads[current]

  return (
    <a
      href={ad.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm transition-colors hover:bg-emerald-100"
    >
      <span className="shrink-0 rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
        Ad
      </span>
      <span className="truncate text-gray-700">{ad.description}</span>
    </a>
  )
}
