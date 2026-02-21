import { useI18n } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@/lib/medusa";

const img = (name: string) => `https://images.unsplash.com/photo-${name}?w=900&h=1200&fit=crop&q=80`;

const LOOKBOOK_IMAGES = [
  { src: img("1521572163474-6864f9cf17ab"), caption: "Imnayen Essential Tee — Black", span: "col-span-1 row-span-1" },
  { src: img("1556821840-3a63f95609a7"), caption: "Ixulaf Hoodie — Indigo", span: "col-span-1 row-span-2 md:row-span-2" },
  { src: img("1595777457583-95e059d581b8"), caption: "Azekka Tunic Dress — Sand", span: "col-span-1 row-span-1" },
  { src: img("1551028719-00167b16eac5"), caption: "Imnayen Bomber — Black", span: "col-span-1 row-span-1" },
  { src: img("1625910513413-5cc2d32e3de5"), caption: "Tigejda Relaxed Tee — White", span: "col-span-1 row-span-1" },
  { src: img("1578768079052-aa76e52ff62e"), caption: "Imnayen Heritage Hoodie — Cream", span: "col-span-1 row-span-2 md:row-span-2" },
  { src: img("1548036328-c11e0931fe7e"), caption: "Tigejda Canvas Tote — Natural", span: "col-span-1 row-span-1" },
  { src: img("1588850561407-ed78c334e67a"), caption: "IYUC Dad Cap — Sand", span: "col-span-1 row-span-1" },
];

export default function Lookbook() {
  const { t } = useI18n();

  return (
    <div className="store-container py-16">
      <div className="text-center mb-14 max-w-xl mx-auto">
        <p className="text-primary text-sm font-medium tracking-wider uppercase mb-4">
          {t("lookbook.title")}
        </p>
        <h1 className="text-foreground text-3xl md:text-4xl font-heading font-semibold mb-4">
          {t("lookbook.subtitle")}
        </h1>
        <p className="text-muted-foreground text-base">
          {t("lookbook.desc")}
        </p>
      </div>

      {/* Masonry-style grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {LOOKBOOK_IMAGES.map((item, i) => (
          <div key={i} className="break-inside-avoid group relative overflow-hidden">
            <img
              src={item.src}
              alt={item.caption}
              className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300" />
            <p className="absolute bottom-4 left-4 text-background text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {item.caption}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
