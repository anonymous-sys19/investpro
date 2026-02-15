"use client";

import { useEffect } from "react";

export interface AdSenseProps {
  adSlot: string; // ID del anuncio (ej: "1234567890")
  adFormat?: "auto" | "rectangle" | "vertical" | "horizontal";
  fullWidth?: boolean;
  responsive?: boolean;
}

/**
 * Componente para mostrar anuncios de Google AdSense
 *
 * Ejemplos:
 * <AdSense adSlot="1234567890" />
 * <AdSense adSlot="9876543210" adFormat="rectangle" />
 */
export function AdSense({
  adSlot,
  adFormat = "auto",
  fullWidth = true,
  responsive = true,
}: AdSenseProps) {
  useEffect(() => {
    try {
      // @ts-ignore - adsbygoogle es global variable
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.warn("AdSense script not loaded yet");
    }
  }, []);

  return (
    <div className="adsense-container my-4">
      <ins
        className={`adsbygoogle ${
          fullWidth ? "block" : "inline-block"
        } text-center`}
        data-ad-client="ca-pub-9277496105560766"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}

/**
 * Anuncio de bloque horizontal (ideal para footer/sidebar)
 */
export function AdSenseHorizontal({ adSlot }: { adSlot: string }) {
  return (
    <AdSense
      adSlot={adSlot}
      adFormat="horizontal"
      fullWidth={true}
      responsive={true}
    />
  );
}

/**
 * Anuncio cuadrado (ideal para sidebars)
 */
export function AdSenseSquare({ adSlot }: { adSlot: string }) {
  return (
    <AdSense
      adSlot={adSlot}
      adFormat="rectangle"
      fullWidth={false}
      responsive={false}
    />
  );
}

/**
 * Anuncio vertical (ideal para sidebars)
 */
export function AdSenseVertical({ adSlot }: { adSlot: string }) {
  return (
    <AdSense
      adSlot={adSlot}
      adFormat="vertical"
      fullWidth={false}
      responsive={false}
    />
  );
}
