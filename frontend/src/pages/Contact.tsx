import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import { Mail, Clock, MapPin, Check } from "lucide-react";

export default function Contact() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="store-container py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
        {/* Form */}
        <div>
          <h1 className="text-foreground text-3xl font-heading font-semibold mb-3">
            {t("contact.title")}
          </h1>
          <p className="text-muted-foreground text-base mb-10">
            {t("contact.subtitle")}
          </p>

          {sent ? (
            <div className="border border-primary p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-primary-foreground" />
              </div>
              <p className="text-foreground text-sm">{t("contact.sent")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-foreground text-xs font-medium block mb-1.5">{t("contact.name")}</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-foreground text-xs font-medium block mb-1.5">{t("contact.email")}</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-foreground text-xs font-medium block mb-1.5">{t("contact.subject")}</label>
                <input
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-foreground text-xs font-medium block mb-1.5">{t("contact.message")}</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3.5 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {t("contact.send")}
              </button>
            </form>
          )}
        </div>

        {/* Info */}
        <div className="lg:pt-16">
          <h2 className="text-foreground text-lg font-medium mb-8">
            {t("contact.info_title")}
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-foreground text-sm font-medium">{t("contact.email_label")}</p>
                <p className="text-muted-foreground text-sm">{t("contact.email_value")}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-foreground text-sm font-medium">{t("contact.hours_label")}</p>
                <p className="text-muted-foreground text-sm">{t("contact.hours_value")}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-foreground text-sm font-medium">{t("contact.location_label")}</p>
                <p className="text-muted-foreground text-sm">{t("contact.location_value")}</p>
              </div>
            </div>
          </div>

          {/* Brand note */}
          <div className="mt-12 p-6 bg-secondary">
            <p className="text-foreground font-heading font-bold tracking-[0.2em] text-sm uppercase mb-2">
              IYUC <span className="text-muted-foreground font-normal">ⵣ</span>
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Minimalist Amazigh streetwear — for everyone, everywhere.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
