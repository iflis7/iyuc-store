import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Package, MapPin, LogOut } from "lucide-react";

type Tab = "profile" | "orders" | "addresses";

const MOCK_ORDERS = [
  { id: "ORD-A1B2C3", date: "2026-02-15", status: "Delivered", total: 12400, items: 2 },
  { id: "ORD-D4E5F6", date: "2026-02-01", status: "Shipped", total: 8900, items: 1 },
  { id: "ORD-G7H8I9", date: "2026-01-20", status: "Delivered", total: 21300, items: 3 },
];

const MOCK_ADDRESSES = [
  { id: "1", name: "John Doe", address: "123 Main Street", city: "Toronto", province: "ON", postalCode: "M5V 2T6", country: "Canada", isDefault: true },
  { id: "2", name: "John Doe", address: "456 Office Blvd, Suite 200", city: "Vancouver", province: "BC", postalCode: "V6B 1A1", country: "Canada", isDefault: false },
];

function formatPriceDollars(amount: number) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(amount / 100);
}

export default function Account() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tab, setTab] = useState<Tab>("profile");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpForm, setSignUpForm] = useState({ email: "", password: "", firstName: "", lastName: "" });

  if (!isLoggedIn) {
    return (
      <div className="store-container py-24 max-w-md mx-auto">
        <h1 className="text-foreground text-2xl font-semibold mb-8 text-center">
          {isSignUp ? "Create Account" : "Sign In"}
        </h1>

        {isSignUp ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="First name" value={signUpForm.firstName} onChange={(e) => setSignUpForm({ ...signUpForm, firstName: e.target.value })} className="border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
              <input placeholder="Last name" value={signUpForm.lastName} onChange={(e) => setSignUpForm({ ...signUpForm, lastName: e.target.value })} className="border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <input type="email" placeholder="Email" value={signUpForm.email} onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })} className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
            <input type="password" placeholder="Password" value={signUpForm.password} onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })} className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
            <button onClick={() => setIsLoggedIn(true)} className="w-full bg-primary text-primary-foreground py-3.5 text-sm font-medium hover:opacity-90 transition-opacity">
              Create Account
            </button>
            <p className="text-center text-muted-foreground text-sm">
              Already have an account?{" "}
              <button onClick={() => setIsSignUp(false)} className="text-foreground underline">Sign in</button>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <input type="email" placeholder="Email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
            <input type="password" placeholder="Password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
            <button onClick={() => setIsLoggedIn(true)} className="w-full bg-primary text-primary-foreground py-3.5 text-sm font-medium hover:opacity-90 transition-opacity">
              Sign In
            </button>
            <p className="text-center text-muted-foreground text-sm">
              Don't have an account?{" "}
              <button onClick={() => setIsSignUp(true)} className="text-foreground underline">Create one</button>
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="store-container py-12">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-12">
        {/* Sidebar */}
        <nav className="space-y-1">
          {[
            { key: "profile" as Tab, label: "Profile", icon: User },
            { key: "orders" as Tab, label: "Orders", icon: Package },
            { key: "addresses" as Tab, label: "Addresses", icon: MapPin },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${tab === item.key ? "bg-secondary text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
          <button
            onClick={() => setIsLoggedIn(false)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </nav>

        {/* Content */}
        <div>
          {tab === "profile" && (
            <div>
              <h2 className="text-foreground text-xl font-semibold mb-6">Profile</h2>
              <div className="space-y-4 max-w-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-foreground text-xs font-medium block mb-1.5">First Name</label>
                    <input defaultValue="John" className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="text-foreground text-xs font-medium block mb-1.5">Last Name</label>
                    <input defaultValue="Doe" className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                </div>
                <div>
                  <label className="text-foreground text-xs font-medium block mb-1.5">Email</label>
                  <input defaultValue="john@example.com" className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-foreground text-xs font-medium block mb-1.5">Phone</label>
                  <input defaultValue="+1 (416) 555-0123" className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <button className="bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {tab === "orders" && (
            <div>
              <h2 className="text-foreground text-xl font-semibold mb-6">Orders</h2>
              <div className="space-y-4">
                {MOCK_ORDERS.map((order) => (
                  <div key={order.id} className="border border-border p-6 flex items-center justify-between">
                    <div>
                      <p className="text-foreground text-sm font-medium">{order.id}</p>
                      <p className="text-muted-foreground text-xs mt-1">{order.date} · {order.items} item{order.items > 1 ? "s" : ""}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block text-xs px-2 py-0.5 mb-1 ${order.status === "Delivered" ? "bg-secondary text-foreground" : "bg-accent text-accent-foreground"}`}>
                        {order.status}
                      </span>
                      <p className="text-foreground text-sm font-medium">{formatPriceDollars(order.total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "addresses" && (
            <div>
              <h2 className="text-foreground text-xl font-semibold mb-6">Addresses</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOCK_ADDRESSES.map((addr) => (
                  <div key={addr.id} className="border border-border p-6">
                    {addr.isDefault && <span className="text-xs text-muted-foreground mb-2 block">Default</span>}
                    <p className="text-foreground text-sm font-medium">{addr.name}</p>
                    <p className="text-muted-foreground text-sm mt-1">{addr.address}</p>
                    <p className="text-muted-foreground text-sm">{addr.city}, {addr.province} {addr.postalCode}</p>
                    <p className="text-muted-foreground text-sm">{addr.country}</p>
                    <button className="text-foreground text-xs underline mt-3">Edit</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
