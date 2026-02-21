import { useI18n } from "@/lib/i18n";

export default function OurStory() {
  const { t } = useI18n();

  return (
    <div className="store-container py-16 max-w-3xl mx-auto">
      <p className="text-primary text-sm font-medium tracking-wider uppercase mb-4">
        {t("story.title")}
      </p>
      <h1 className="text-foreground text-3xl md:text-4xl font-heading font-semibold mb-10 leading-tight">
        {t("story.h1")}
      </h1>

      <div className="space-y-6 text-muted-foreground text-base leading-relaxed mb-16">
        <p>{t("story.p1")}</p>
        <p>{t("story.p2")}</p>
        <p>{t("story.p3")}</p>
        <p>{t("story.p4")}</p>
      </div>

      {/* Values */}
      <h2 className="text-foreground text-xl font-heading font-semibold mb-8">
        {t("story.values_title")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          { title: t("story.v1_title"), desc: t("story.v1_desc") },
          { title: t("story.v2_title"), desc: t("story.v2_desc") },
          { title: t("story.v3_title"), desc: t("story.v3_desc") },
        ].map((v) => (
          <div key={v.title} className="border border-border p-6">
            <h3 className="text-foreground text-sm font-medium mb-2">{v.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>

      {/* Amazigh note */}
      <div className="bg-secondary p-8 border-l-4 border-primary">
        <p className="text-foreground text-sm leading-relaxed">
          {t("story.amazigh_note")}
        </p>
      </div>
    </div>
  );
}
