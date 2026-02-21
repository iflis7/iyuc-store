import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getCollectionByHandle,
  listProducts,
  listCollections,
  type Collection,
} from "@/lib/medusa";
import ProductCard from "@/components/products/ProductCard";
import { ArrowUpRight } from "lucide-react";

const COLLECTION_META: Record<string, { desc: string }> = {
  ixulaf: { desc: "Boys" },
  azekka: { desc: "Girls" },
  imnayen: { desc: "Men" },
  tigejda: { desc: "Women" },
  new: { desc: "Latest drops" },
  "pre-order": { desc: "Coming soon — reserve yours today" },
};

function CollectionDetail({ handle }: { handle: string }) {
  const { data: collection, isLoading: colLoading } = useQuery({
    queryKey: ["collection", handle],
    queryFn: () => getCollectionByHandle(handle),
    enabled: !!handle,
  });

  const collectionId =
    handle === "new"
      ? (collection?.id ?? "col_new")
      : handle === "pre-order"
        ? (collection?.id ?? "col_preorder")
        : collection?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["products", "collection-page", collectionId],
    queryFn: () => listProducts({ collection_id: collectionId!, limit: 24 }),
    enabled: !!collectionId,
  });

  if (colLoading || isLoading) {
    return (
      <div className="store-container py-12">
        <div className="h-8 w-48 bg-secondary animate-pulse mb-2" />
        <div className="h-4 w-32 bg-secondary animate-pulse mb-8" />
        <div className="product-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[3/4] bg-secondary animate-pulse mb-3" />
              <div className="h-4 w-24 bg-secondary animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const meta = COLLECTION_META[handle];

  return (
    <div className="store-container py-12">
      <h1 className="text-foreground text-2xl font-heading font-semibold mb-1">
        {collection?.title || handle}
      </h1>
      {meta?.desc && (
        <p className="text-muted-foreground text-sm mb-8">{meta.desc}</p>
      )}
      {data?.products?.length ? (
        <div className="product-grid">
          {data.products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">No products in this collection yet.</p>
      )}
    </div>
  );
}

function CollectionIndex() {
  const { data: collections, isLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: listCollections,
  });

  if (isLoading) {
    return (
      <div className="store-container py-12">
        <div className="h-8 w-48 bg-secondary animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-secondary animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const allCollections = [
    ...(collections || []),
    { id: "col_new", title: "New Arrivals", handle: "new" },
    { id: "col_preorder", title: "Pre-order", handle: "pre-order" },
  ];

  return (
    <div className="store-container py-12">
      <h1 className="text-foreground text-2xl font-heading font-semibold mb-8">Collections</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {allCollections.map((col) => (
          <Link
            key={col.id}
            to={`/collections/${col.handle}`}
            className="group border border-border p-8 hover:border-primary transition-colors"
          >
            <h2 className="text-foreground text-lg font-heading font-medium group-hover:text-primary transition-colors flex items-center gap-2">
              {col.title}
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h2>
            {COLLECTION_META[col.handle] && (
              <p className="text-muted-foreground text-sm mt-1">{COLLECTION_META[col.handle].desc}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Collections() {
  const { handle } = useParams<{ handle?: string }>();
  if (handle) return <CollectionDetail handle={handle} />;
  return <CollectionIndex />;
}