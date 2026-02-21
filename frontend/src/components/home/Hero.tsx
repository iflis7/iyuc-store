import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="bg-hero-bg">
      <div className="store-container flex flex-col items-center justify-center py-32 md:py-48 text-center">
        <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">
          {t("hero.subtitle")}
        </p>
        <h1 className="text-foreground text-3xl md:text-5xl font-semibold font-heading mb-4 max-w-2xl leading-tight">
          {t("hero.title_1")}{" "}
          <span className="text-primary">{t("hero.title_2")}</span>
        </h1>
        <p className="text-muted-foreground text-base md:text-lg font-light mb-10 max-w-md">
          {t("hero.desc")}
        </p>
        <div className="flex gap-4">
          <Link
            to="/store"
            className="bg-primary text-primary-foreground px-8 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {t("hero.shop")}
          </Link>
          <Link
            to="/collections"
            className="border border-foreground text-foreground px-8 py-3 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
          >
            {t("hero.collections")}
          </Link>
        </div>
      </div>
    </section>
  );
}
