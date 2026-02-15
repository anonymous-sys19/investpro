"use client";

import { useAuth } from "@/components/auth-provider";
import { AdSenseHorizontal } from "@/components/adsense";
import { shouldShowAd, AD_SLOTS } from "@/lib/adsense-config";

export function Footer() {
  const { user } = useAuth();
  const showAds = shouldShowAd(user?.premium || false);

  return (
    <footer className="border-t border-border/50 py-6 mt-auto">
      <div className="container mx-auto px-4">
        {/* Google AdSense */}
        {showAds && (
          <div className="mb-6">
            <AdSenseHorizontal adSlot={AD_SLOTS.FOOTER_HORIZONTAL} />
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {"Desarrollado por: "}
            <span className="text-foreground font-medium">Anonimo-sys19</span>
            {" | Contacto: "}
            <span className="text-primary font-medium">
              WhatsApp 62228271 +CR
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
