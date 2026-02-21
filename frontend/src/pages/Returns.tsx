import { useI18n } from "@/lib/i18n";

export default function Returns() {
  const { t } = useI18n();

  const sections = Array.from({ length: 5 }, (_, i) => ({
    title: t(`returns.s${i + 1}_title`),
    text: t(`returns.s${i + 1}_text`),
  }));

  return (
    <div className="store-container py-16 max-w-2xl mx-auto">
      <h1 className="text-foreground text-3xl font-heading font-semibold mb-4">
        {t("returns.title")}
      </h1>
      <p className="text-muted-foreground text-base leading-relaxed mb-12">
        {t("returns.intro")}
      </p>

      <div className="space-y-10">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="text-foreground text-lg font-medium mb-2">{s.title}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>

      <p className="text-muted-foreground text-xs mt-16">
        Last updated: February 2026
      </p>
    </div>
  );
}
