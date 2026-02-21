import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/lib/cart-context";
import {
  formatPrice,
  listShippingOptions,
  calculateShippingOption,
  addShippingMethodToCart,
  completeCart,
  type ShippingOption,
  type Order,
} from "@/lib/medusa";
import { ArrowLeft, Check } from "lucide-react";

type Step = "info" | "shipping" | "payment" | "confirmed";

export default function Checkout() {
  const { cart, removeItem, refreshCart, clearAndReinitCart } = useCart();
  const [step, setStep] = useState<Step>("info");
  const [info, setInfo] = useState({ email: "", firstName: "", lastName: "", address: "", city: "", postalCode: "", phone: "" });
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [calculatedPrices, setCalculatedPrices] = useState<Record<string, number>>({});
  const [selectedShippingOptionId, setSelectedShippingOptionId] = useState<string>("");
  const [shippingLoading, setShippingLoading] = useState(false);
  const [placeOrderLoading, setPlaceOrderLoading] = useState(false);
  const [placeOrderError, setPlaceOrderError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const currencyCode = cart?.currency_code ?? "cad";

  // Fetch shipping options when entering shipping step
  useEffect(() => {
    if (step !== "shipping" || !cart?.id) return;
    setShippingLoading(true);
    listShippingOptions(cart.id)
      .then((opts) => {
        setShippingOptions(opts);
        if (opts.length) setSelectedShippingOptionId(opts[0].id);
        const calculated = opts.filter((o) => o.price_type === "calculated");
        if (calculated.length === 0) {
          setShippingLoading(false);
          return;
        }
        return Promise.allSettled(
          calculated.map((o) => calculateShippingOption(o.id, cart.id).then((r) => ({ id: o.id, amount: r.amount })))
        );
      })
      .then((results) => {
        if (results && Array.isArray(results)) {
          const prices: Record<string, number> = {};
          results.forEach((r) => {
            if (r.status === "fulfilled" && r.value) prices[r.value.id] = r.value.amount;
          });
          setCalculatedPrices((prev) => ({ ...prev, ...prices }));
        }
      })
      .catch(() => setShippingOptions([]))
      .finally(() => setShippingLoading(false));
  }, [step, cart?.id]);

  if (!cart?.items?.length && step !== "confirmed") {
    return (
      <div className="store-container py-24 text-center">
        <p className="text-muted-foreground mb-4">Your cart is empty</p>
        <Link to="/store" className="text-foreground underline text-sm">Continue shopping</Link>
      </div>
    );
  }

  if (step === "confirmed" && confirmedOrder) {
    return (
      <div className="store-container py-24 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-foreground text-2xl font-semibold mb-2">Order Confirmed</h1>
        <p className="text-muted-foreground text-sm mb-1">Order #{confirmedOrder.display_id ?? confirmedOrder.id}</p>
        <p className="text-muted-foreground text-sm mb-8">Thank you for your purchase! You'll receive a confirmation email shortly.</p>
        <Link to="/store" className="inline-block bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const getShippingOptionAmount = (opt: ShippingOption): number => {
    if (opt.price_type === "flat" && opt.amount != null) return opt.amount;
    if (opt.calculated_price?.calculated_amount != null) return opt.calculated_price.calculated_amount;
    return calculatedPrices[opt.id] ?? 0;
  };

  const shippingCost =
    selectedShippingOptionId && shippingOptions.length
      ? getShippingOptionAmount(shippingOptions.find((o) => o.id === selectedShippingOptionId)!)
      : 0;
  const subtotal = cart?.subtotal ?? 0;
  const total = cart?.total != null ? cart.total : subtotal + shippingCost;

  const handleContinueToPayment = async () => {
    if (!cart?.id || !selectedShippingOptionId) {
      setStep("payment");
      return;
    }
    setShippingLoading(true);
    setPlaceOrderError(null);
    try {
      await addShippingMethodToCart(cart.id, selectedShippingOptionId);
      await refreshCart();
      setStep("payment");
    } catch (err) {
      setPlaceOrderError(err instanceof Error ? err.message : "Failed to set shipping method");
    } finally {
      setShippingLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!cart?.id) return;
    setPlaceOrderLoading(true);
    setPlaceOrderError(null);
    try {
      const result = await completeCart(cart.id);
      if (result.type === "order") {
        setConfirmedOrder(result.order);
        await clearAndReinitCart();
        setStep("confirmed");
      } else {
        setPlaceOrderError(result.error ?? "Could not place order. Please try again.");
      }
    } catch (err) {
      setPlaceOrderError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setPlaceOrderLoading(false);
    }
  };

  const steps: { key: Step; label: string }[] = [
    { key: "info", label: "Information" },
    { key: "shipping", label: "Shipping" },
    { key: "payment", label: "Payment" },
  ];

  return (
    <div className="store-container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <div>
          <Link to="/" className="text-foreground font-heading font-bold tracking-[0.25em] text-xl uppercase mb-8 block">
            IYUC
          </Link>

          <div className="flex items-center gap-2 text-sm mb-8">
            {steps.map((s, i) => (
              <span key={s.key} className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const idx = steps.findIndex((st) => st.key === step);
                    if (i <= idx) setStep(s.key);
                  }}
                  className={step === s.key ? "text-foreground font-medium" : "text-muted-foreground"}
                >
                  {s.label}
                </button>
                {i < steps.length - 1 && <span className="text-muted-foreground">/</span>}
              </span>
            ))}
          </div>

          {step === "info" && (
            <div className="space-y-6">
              <h2 className="text-foreground text-lg font-medium">Contact Information</h2>
              <input
                type="email"
                placeholder="Email"
                value={info.email}
                onChange={(e) => setInfo({ ...info, email: e.target.value })}
                className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />

              <h2 className="text-foreground text-lg font-medium pt-4">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="First name" value={info.firstName} onChange={(e) => setInfo({ ...info, firstName: e.target.value })} className="border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                <input placeholder="Last name" value={info.lastName} onChange={(e) => setInfo({ ...info, lastName: e.target.value })} className="border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <input placeholder="Address" value={info.address} onChange={(e) => setInfo({ ...info, address: e.target.value })} className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="City" value={info.city} onChange={(e) => setInfo({ ...info, city: e.target.value })} className="border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                <input placeholder="Postal code" value={info.postalCode} onChange={(e) => setInfo({ ...info, postalCode: e.target.value })} className="border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <input placeholder="Phone (optional)" value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />

              <button onClick={() => setStep("shipping")} className="w-full bg-primary text-primary-foreground py-3.5 text-sm font-medium hover:opacity-90 transition-opacity">
                Continue to Shipping
              </button>
            </div>
          )}

          {step === "shipping" && (
            <div className="space-y-6">
              <h2 className="text-foreground text-lg font-medium">Shipping Method</h2>
              {shippingLoading && !shippingOptions.length ? (
                <p className="text-muted-foreground text-sm">Loading options…</p>
              ) : shippingOptions.length > 0 ? (
                shippingOptions.map((opt) => {
                  const amount = getShippingOptionAmount(opt);
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${selectedShippingOptionId === opt.id ? "border-foreground" : "border-border hover:border-muted-foreground"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedShippingOptionId === opt.id ? "border-foreground" : "border-muted-foreground"}`}>
                          {selectedShippingOptionId === opt.id && <div className="w-2 h-2 rounded-full bg-foreground" />}
                        </div>
                        <div>
                          <p className="text-foreground text-sm font-medium">{opt.name}</p>
                        </div>
                      </div>
                      <span className="text-foreground text-sm">{formatPrice(amount, currencyCode)}</span>
                      <input type="radio" name="shipping" value={opt.id} checked={selectedShippingOptionId === opt.id} onChange={() => setSelectedShippingOptionId(opt.id)} className="sr-only" />
                    </label>
                  );
                })
              ) : (
                <p className="text-muted-foreground text-sm">No shipping options available. You can still continue to payment.</p>
              )}

              <div className="flex gap-4">
                <button onClick={() => setStep("info")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={handleContinueToPayment} disabled={shippingLoading} className="flex-1 bg-primary text-primary-foreground py-3.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                  {shippingLoading ? "Saving…" : "Continue to Payment"}
                </button>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-6">
              <h2 className="text-foreground text-lg font-medium">Payment</h2>
              <div className="border border-border p-4 space-y-4">
                <input placeholder="Card number" defaultValue="4242 4242 4242 4242" className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="MM / YY" defaultValue="12/28" className="border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                  <input placeholder="CVC" defaultValue="123" className="border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <input placeholder="Name on card" defaultValue="John Doe" className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>

              {placeOrderError && <p className="text-destructive text-sm">{placeOrderError}</p>}

              <div className="flex gap-4">
                <button onClick={() => setStep("shipping")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={handlePlaceOrder} disabled={placeOrderLoading} className="flex-1 bg-primary text-primary-foreground py-3.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                  {placeOrderLoading ? "Placing order…" : `Place Order — ${formatPrice(total, currencyCode)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:border-l lg:border-border lg:pl-12">
          <h2 className="text-foreground text-lg font-medium mb-6">Order Summary</h2>
          <ul className="space-y-4 mb-6">
            {cart?.items?.map((item) => (
              <li key={item.id} className="flex gap-4">
                <div className="w-16 h-16 bg-secondary flex-shrink-0 overflow-hidden relative">
                  {item.thumbnail && <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />}
                  <span className="absolute -top-1.5 -right-1.5 bg-muted-foreground text-background text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm truncate">{item.title}</p>
                  <p className="text-muted-foreground text-xs">{item.variant?.title}</p>
                </div>
                <span className="text-foreground text-sm">{formatPrice(item.total, currencyCode)}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">{formatPrice(subtotal, currencyCode)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-foreground">{step !== "info" ? formatPrice(shippingCost, currencyCode) : "Calculated next"}</span>
            </div>
            <div className="flex justify-between text-sm font-medium pt-2 border-t border-border">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">{formatPrice(total, currencyCode)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
