import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();

  const collections = [
    { handle: "ixulaf" },
    { handle: "azekka" },
    { handle: "imnayen" },
    { handle: "tigejda" },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="store-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-foreground font-heading font-bold tracking-[0.25em] text-lg uppercase mb-2">
              IYUC <span className="text-muted-foreground font-normal">ⵣ</span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">
              {t("footer.desc")}
            </p>
            <p className="text-muted-foreground text-xs italic">
              {t("footer.for_everyone")}
            </p>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-foreground text-xs font-medium uppercase tracking-wider mb-4">{t("nav.collections")}</h4>
            <ul className="space-y-2.5">
              {collections.map((col) => (
                <li key={col.handle}>
                  <Link to={`/collections/${col.handle}`} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    {t(`col.${col.handle}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-foreground text-xs font-medium uppercase tracking-wider mb-4">{t("footer.shop")}</h4>
            <ul className="space-y-2.5">
              <li><Link to="/collections/new" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t("footer.new_arrivals")}</Link></li>
              <li><Link to="/collections/pre-order" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t("footer.preorder")}</Link></li>
              <li><Link to="/store" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t("footer.all_products")}</Link></li>
              <li><Link to="/lookbook" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t("footer.lookbook")}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-foreground text-xs font-medium uppercase tracking-wider mb-4">{t("footer.support")}</h4>
            <ul className="space-y-2.5">
              <li><Link to="/our-story" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t("footer.our_story")}</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t("footer.faq")}</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t("footer.contact")}</Link></li>
              <li><Link to="/account" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t("footer.my_account")}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-foreground text-xs font-medium uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t("footer.privacy")}</Link></li>
              <li><Link to="/returns" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t("footer.returns")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} IYUC. {t("footer.rights")}
          </p>
          <p className="text-muted-foreground text-xs">
            {t("footer.tagline")}
          </p>
        </div>
      </div>
    </footer>
  );
}
