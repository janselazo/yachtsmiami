"use client";

import { useState } from "react";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { CombinedScrollVideo } from "@/components/CombinedScrollVideo";
import { ScrollVideoScene } from "@/components/ScrollVideoScene";
import { FleetSection } from "@/components/FleetSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { JetSkiSection } from "@/components/JetSkiSection";
import { BookingSection } from "@/components/BookingSection";
import { SiteFooter } from "@/components/SiteFooter";
import { boats } from "@/data/boats";

export function HomePage() {
  const [selectedBoatId, setSelectedBoatId] = useState(
    boats.find((boat) => boat.featured)?.id ?? boats[0].id,
  );

  return (
    <SmoothScrollProvider>
      <div className="site-atmosphere" aria-hidden="true" />
      <div className="relative z-10">
        <SiteHeader />
        <main>
          <CombinedScrollVideo sceneAlign="right" />
          <FleetSection
            selectedBoatId={selectedBoatId}
            onSelectBoat={(boatId) => {
              setSelectedBoatId(boatId);
              document
                .getElementById("book")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          />
          <ScrollVideoScene id="signature-pink" overlay="light" />
          <ExperienceSection />
          <JetSkiSection />
          <BookingSection
            selectedBoatId={selectedBoatId}
            onBoatChange={setSelectedBoatId}
          />
        </main>
        <SiteFooter />
      </div>
    </SmoothScrollProvider>
  );
}
