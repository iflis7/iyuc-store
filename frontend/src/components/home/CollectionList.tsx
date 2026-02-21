import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listProducts, listCollections, type Collection } from "@/lib/medusa";
import { useI18n } from "@/lib/i18n";
import ProductCard from "@/components/products/ProductCard";
import { ArrowUpRight } from "lucide-react";

function CollectionRow({ collection }: { collection: Collection }) {
  const { t } = useI18n();
  const { data } = useQuery({
    queryKey: ["products", "collection", collection.id],
    queryFn: () => listProducts({ collection_id: collection.id, limit: 3 }),
  });

  const products = data?.products || [];
  if (!products.length) return null;

  const descKey = `col.${(collection.handle || "").toLowerCase()}`;

  return (
    <div className="py-10">
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <h2 className="text-foreground text-xl font-heading font-semibold">
            {collection.title}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">{t(descKey)}</p>
        </div>
        <Link
          to={`/collections/${collection.handle}`}
          className="text-primary hover:text-foreground transition-colors text-sm inline-flex items-center gap-1 font-medium"
        >
          {t("col.view_all")} <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default function CollectionList() {
  const { data: collections, isLoading, isError, error } = useQuery({
    queryKey: ["collections"],
    queryFn: listCollections,
  });

  if (isError) {
    return (
      <div className="store-container py-16 text-center">
        <p className="text-destructive font-medium mb-1">Could not load collections.</p>
        <p className="text-muted-foreground text-sm">Ensure the backend is running at the configured URL and CORS allows this origin.</p>
        {error instanceof Error && <p className="text-muted-foreground text-xs mt-2">{error.message}</p>}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="store-container py-16">
        <div className="space-y-16">
          {[1, 2].map((i) => (
            <div key={i}>
              <div className="h-6 w-32 bg-secondary animate-pulse mb-8" />
              <div className="product-grid">
                {[1, 2, 3].map((j) => (
                  <div key={j}>
                    <div className="aspect-[3/4] bg-secondary animate-pulse mb-3" />
                    <div className="h-4 w-24 bg-secondary animate-pulse mb-1" />
                    <div className="h-4 w-16 bg-secondary animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!collections?.length) {
    return (
      <div className="store-container py-16 text-center text-muted-foreground text-sm">
        <p>No collections found.</p>
      </div>
    );
  }

  return (
    <div className="store-container py-8">
      {collections.map((col) => (
        <CollectionRow key={col.id} collection={col} />
      ))}
    </div>
  );
}
