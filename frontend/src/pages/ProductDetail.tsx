import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getProductByHandle, getProductPrice, formatPrice, type Product } from "@/lib/medusa";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";

export default function ProductDetail() {
  const { handle } = useParams<{ handle: string }>();
  const { addItem, region } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const { data: product, isLoading, isError, error } = useQuery({
    queryKey: ["product", handle, region?.id],
    queryFn: () => getProductByHandle(handle!, region?.id),
    enabled: !!handle,
  });

  if (isError) {
    return (
      <div className="store-container py-12">
        <p className="text-destructive font-medium mb-1">Could not load product.</p>
        <p className="text-muted-foreground text-sm">Ensure the backend is running and try again.</p>
        {error instanceof Error && <p className="text-muted-foreground text-xs mt-2">{error.message}</p>}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="store-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-secondary animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 w-48 bg-secondary animate-pulse" />
            <div className="h-5 w-24 bg-secondary animate-pulse" />
            <div className="h-20 w-full bg-secondary animate-pulse mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="store-container py-12">
        <p className="text-muted-foreground text-sm">Product not found.</p>
      </div>
    );
  }

  const images = product.images?.length
    ? product.images
    : product.thumbnail
    ? [{ id: "thumb", url: product.thumbnail }]
    : [];

  // Find matching variant based on selected options
  const selectedVariant = product.variants?.find((v) => {
    if (!v.options?.length) return true;
    return v.options.every(
      (opt) => selectedOptions[opt.option_id] === opt.value
    );
  }) || product.variants?.[0];

  const price = selectedVariant?.calculated_price
    ? formatPrice(
        selectedVariant.calculated_price.calculated_amount,
        selectedVariant.calculated_price.currency_code
      )
    : getProductPrice(product);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    await addItem(selectedVariant.id);
    setIsAdding(false);
  };

  // Initialize selected options with first values
  if (product.options?.length && Object.keys(selectedOptions).length === 0) {
    const defaults: Record<string, string> = {};
    product.options.forEach((opt) => {
      if (opt.values?.[0]) {
        defaults[opt.id] = opt.values[0].value;
      }
    });
    if (Object.keys(defaults).length) {
      setSelectedOptions(defaults);
    }
  }

  return (
    <div className="store-container py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="aspect-square bg-product-card-bg overflow-hidden">
            {images[selectedImageIdx] ? (
              <img
                src={images[selectedImageIdx].url}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                No image
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-16 h-16 flex-shrink-0 overflow-hidden border transition-colors ${
                    idx === selectedImageIdx
                      ? "border-foreground"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-foreground text-2xl md:text-3xl font-semibold mb-2">
            {product.title}
          </h1>
          {price && (
            <p className="text-price text-lg mb-6">{price}</p>
          )}

          {/* Options */}
          {product.options?.map((option) => (
            <div key={option.id} className="mb-6">
              <label className="text-foreground text-sm font-medium block mb-2">
                {option.title}
              </label>
              <div className="flex flex-wrap gap-2">
                {option.values?.map((val) => (
                  <button
                    key={val.id}
                    onClick={() =>
                      setSelectedOptions((prev) => ({
                        ...prev,
                        [option.id]: val.value,
                      }))
                    }
                    className={`px-4 py-2 text-sm border transition-colors ${
                      selectedOptions[option.id] === val.value
                        ? "border-foreground bg-foreground text-primary-foreground"
                        : "border-border text-foreground hover:border-muted-foreground"
                    }`}
                  >
                    {val.value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding || !selectedVariant}
            className="w-full bg-primary text-primary-foreground py-3.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
          >
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>

          {/* Description */}
          {product.description && (
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="text-foreground text-sm font-medium mb-3">
                Description
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
