import { CartProvider } from "@/lib/cart-context";
import { I18nProvider } from "@/lib/i18n";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "@/components/cart/CartDrawer";

function LayoutInner({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <CartProvider>
        <LayoutInner>{children}</LayoutInner>
      </CartProvider>
    </I18nProvider>
  );
}
