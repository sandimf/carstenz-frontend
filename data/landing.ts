import { LandingContent } from "@/types/content";

export const landingContent: LandingContent = {
  hero: {
    version: "v0.2.1",
    title: "Klinik Gunung",
    description: "Pilih Layanan Kesehatan Yang Tersedia.",
    footer: "© 2025 Klinik Gunung Semeru.",
  },
  link: [
    {
      title: "Screening Carstenz",
      description: "Pemeriksaan kesehatan sebelum mendaki gunung",
      route: "/carstensz",
      disabled: false,
    },
    {
      title: "Screening Kesehatan Semeru",
      description: "Pemeriksaan kesehatan sebelum mendaki gunung",
      route: "https://screening-pendakian2.ranupani.my.id/screening",
      disabled: false,
    },
  ],
};
