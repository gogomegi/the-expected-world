"use client";

import { Fragment } from "react";

interface TickerItem {
  year: string;
  label: string;
  excerpt: string;
  colorClass: string;
}

interface MarqueeTickerProps {
  items: TickerItem[];
}

export default function MarqueeTicker({ items }: MarqueeTickerProps) {
  const doubled = [...items, ...items];

  return (
    <div className="ticker-strip">
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <Fragment key={i}>
            <div className="ticker-item">
              <span className={`ticker-year ${item.colorClass}`}>
                {item.year}
              </span>
              <span className="ticker-text">{item.excerpt}</span>
              <span className="ticker-dot" />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
