import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const { t } = useI18n();

  const questions = Array.from({ length: 8 }, (_, i) => ({
    q: t(`faq.q${i + 1}`),
    a: t(`faq.a${i + 1}`),
  }));

  return (
    <div className="store-container py-16 max-w-2xl mx-auto">
      <p className="text-primary text-sm font-medium tracking-wider uppercase mb-4">
        {t("faq.title")}
      </p>
      <h1 className="text-foreground text-3xl font-heading font-semibold mb-3">
        {t("faq.title")}
      </h1>
      <p className="text-muted-foreground text-base mb-12">
        {t("faq.subtitle")}
      </p>

      <div className="divide-y divide-border">
        {questions.map((item, i) => (
          <FAQItem key={i} question={item.q} answer={item.a} />
        ))}
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="text-foreground text-sm font-medium pr-4">{question}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="pb-5">
          <p className="text-muted-foreground text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
