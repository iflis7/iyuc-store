import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/medusa";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateItem, removeItem, itemCount } = useCart();
  const { t } = useI18n();

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-foreground/20 z-50 animate-fade-in" onClick={closeCart} />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border z-50 animate-slide-in-right flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-foreground font-semibold text-lg">{t("cart.title")}</h2>
          <button onClick={closeCart} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!cart?.items?.length ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ShoppingBag className="w-12 h-12 mb-4" />
              <p className="text-sm">{t("cart.empty")}</p>
            </div>
          ) : (
            <ul className="space-y-6">
              {cart.items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 bg-secondary flex-shrink-0 overflow-hidden">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No image</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-foreground text-sm font-medium truncate">{item.title}</h3>
                    <p className="text-muted-foreground text-xs mt-0.5">{item.variant?.title}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => item.quantity === 1 ? removeItem(item.id) : updateItem(item.id, item.quantity - 1)}
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-foreground text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateItem(item.id, item.quantity + 1)}
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-foreground text-sm">{formatPrice(item.total, cart.currency_code)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart?.items?.length ? (
          <div className="p-6 border-t border-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-foreground text-sm font-medium">{t("cart.subtotal")}</span>
              <span className="text-foreground text-sm font-medium">{formatPrice(cart.subtotal, cart.currency_code)}</span>
            </div>
            <p className="text-muted-foreground text-xs">{t("cart.taxes_note")}</p>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="w-full bg-primary text-primary-foreground py-3 text-sm font-medium hover:opacity-90 transition-opacity block text-center"
            >
              {t("cart.checkout")}
            </Link>
          </div>
        ) : null}
      </div>
    </>
  );
}
