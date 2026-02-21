import { Link } from "react-router-dom";
import { type Product, getProductPrice } from "@/lib/medusa";

type ProductWithBadge = Product & {
  badge?: "new" | "pre-order" | "yennayer";
  preorderDate?: string;
};

type Props = {
  product: ProductWithBadge;
};

export default function ProductCard({ product }: Props) {
  const price = getProductPrice(product);

  const badgeLabel =
    product.badge === "new" ? "New" :
    product.badge === "pre-order" ? "Pre-order" :
    product.badge === "yennayer" ? "Yennayer" :
    null;

  const badgeClass =
    product.badge === "new" ? "badge-new" :
    product.badge === "pre-order" ? "badge-gold" :
    product.badge === "yennayer" ? "badge-gold" :
    "";

  return (
    <Link to={`/products/${product.handle}`} className="group block">
      {/* Image: thumbnail or first image from list API */}
      <div className="relative aspect-[3/4] bg-product-card-bg overflow-hidden mb-3">
        {(product.thumbnail || product.images?.[0]?.url) ? (
          <img
            src={product.thumbnail || product.images?.[0]?.url}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}

        {/* Badge */}
        {badgeLabel && (
          <span className={`absolute top-3 left-3 ${badgeClass}`}>
            {badgeLabel}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1">
        <h3 className="text-foreground text-sm font-medium group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        <div className="flex items-center gap-2">
          {price && <p className="text-price text-sm">{price}</p>}
          {product.badge === "pre-order" && (product as ProductWithBadge).preorderDate && (
            <span className="text-muted-foreground text-xs">
              — ships {(product as ProductWithBadge).preorderDate}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}