import { Link } from "react-router-dom";
import { ShoppingBag, User, Menu, Globe, ChevronDown } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useI18n, LOCALE_LABELS, type Locale } from "@/lib/i18n";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const COLLECTIONS = [
  { title: "Ixulaf", handle: "ixulaf" },
  { title: "Azekka", handle: "azekka" },
  { title: "Imnayen", handle: "imnayen" },
  { title: "Tigejda", handle: "tigejda" },
];

const NAV_LINKS = [
  { labelKey: "nav.home", to: "/" },
  { labelKey: "nav.all_products", to: "/store" },
  { labelKey: "nav.our_story", to: "/our-story" },
  { labelKey: "nav.lookbook", to: "/lookbook" },
  { labelKey: "nav.faq", to: "/faq" },
  { labelKey: "nav.contact", to: "/contact" },
];

export default function Header() {
  const { itemCount, openCart } = useCart();
  const { t, locale, setLocale } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="store-container flex items-center justify-between h-16">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(true)}
              className="text-foreground hover:text-muted-foreground transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Center */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 text-foreground font-heading font-bold tracking-[0.25em] text-xl uppercase"
          >
            IYUC
          </Link>

          {/* Right */}
          <div className="flex items-center gap-5">
            <Link
              to="/account"
              className="text-foreground hover:text-muted-foreground transition-colors"
              aria-label={t("nav.account")}
            >
              <User className="w-5 h-5" />
            </Link>
            <button
              onClick={openCart}
              className="text-foreground hover:text-muted-foreground transition-colors relative"
              aria-label={t("nav.cart")}
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Slide-out sidebar menu */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[320px] sm:w-[380px] p-0 bg-background">
          <SheetHeader className="sr-only">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-full">
            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6">
              <nav className="flex flex-col">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="px-6 py-3 text-sm text-foreground hover:bg-secondary transition-colors"
                  >
                    {t(link.labelKey)}
                  </Link>
                ))}

                {/* Collections collapsible */}
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-6 py-3 text-sm text-foreground hover:bg-secondary transition-colors">
                    {t("nav.collections")}
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="flex flex-col">
                      {COLLECTIONS.map((col) => (
                        <Link
                          key={col.handle}
                          to={`/collections/${col.handle}`}
                          onClick={() => setMenuOpen(false)}
                          className="pl-10 pr-6 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        >
                          {t(`col.${col.handle}`)}
                        </Link>
                      ))}
                      <Link
                        to="/collections/new"
                        onClick={() => setMenuOpen(false)}
                        className="pl-10 pr-6 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        {t("nav.new")}
                      </Link>
                      <Link
                        to="/collections/pre-order"
                        onClick={() => setMenuOpen(false)}
                        className="pl-10 pr-6 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        {t("nav.preorder")}
                      </Link>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </nav>
            </div>

            {/* Language switcher at bottom */}
            <div className="border-t border-border px-6 py-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                <Globe className="w-3.5 h-3.5 inline mr-1.5" />
                Language
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(LOCALE_LABELS) as Locale[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLocale(l)}
                    className={`px-3 py-2 text-xs rounded transition-colors ${
                      locale === l
                        ? "bg-primary text-primary-foreground font-medium"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {LOCALE_LABELS[l]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
