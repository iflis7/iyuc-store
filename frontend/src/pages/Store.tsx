import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@/lib/medusa";
import { useI18n } from "@/lib/i18n";
import ProductCard from "@/components/products/ProductCard";

export default function Store() {
  const { t } = useI18n();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => listProducts({ limit: 24 }),
  });

  return (
    <div className="store-container py-12">
      <h1 className="text-foreground text-2xl font-heading font-semibold mb-2">{t("store.title")}</h1>
      <p className="text-muted-foreground text-sm mb-8">{t("store.desc")}</p>

      {isError ? (
        <div className="py-8 text-center">
          <p className="text-destructive font-medium mb-1">Could not load products.</p>
          <p className="text-muted-foreground text-sm">Ensure the backend is running and CORS is configured for this origin.</p>
          {error instanceof Error && <p className="text-muted-foreground text-xs mt-2">{error.message}</p>}
        </div>
      ) : isLoading ? (
        <div className="product-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[3/4] bg-secondary animate-pulse mb-3" />
              <div className="h-4 w-24 bg-secondary animate-pulse mb-1" />
              <div className="h-4 w-16 bg-secondary animate-pulse" />
            </div>
          ))}
        </div>
      ) : !data?.products?.length ? (
        <p className="text-muted-foreground text-sm">{t("store.no_products")}</p>
      ) : (
        <div className="product-grid">
          {data.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
