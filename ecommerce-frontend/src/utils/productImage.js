/**
 * Shared product image URL helper for storefront
 */
const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || "http://localhost:3000";

const FALLBACKS = [
  "https://images.unsplash.com/photo-1523381216130-8b3f99a87a6d?auto=format&fit=crop&w=900&h=1200&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&h=1200&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&h=1200&q=80",
  "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&h=1200&q=80",
  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&h=1200&q=80",
  "https://images.unsplash.com/photo-1467043237213-65a2c69bb749?auto=format&fit=crop&w=900&h=1200&q=80",
  "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&h=1200&q=80",
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&h=1200&q=80",
  "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=900&h=1200&q=80",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&h=1200&q=80",
  "https://images.unsplash.com/photo-1515372039744-b8f0229a8667?auto=format&fit=crop&w=900&h=1200&q=80",
  "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&h=1200&q=80",
];

export function getProductFallback(seed = 0) {
  const index = Math.abs(Number(seed) || 0) % FALLBACKS.length;
  return FALLBACKS[index];
}

/** Fashion-friendly Unsplash URLs: portrait + top crop keeps faces/product tops */
function normalizeRemoteImageUrl(url) {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("unsplash.com")) return url;
    parsed.searchParams.set("auto", "format");
    parsed.searchParams.set("fit", "crop");
    parsed.searchParams.set("crop", "top");
    parsed.searchParams.set("w", "800");
    parsed.searchParams.set("h", "1000");
    parsed.searchParams.set("q", "80");
    return parsed.toString();
  } catch {
    return url;
  }
}

export function resolveImagePath(path, seed = 0) {
  if (!path) return getProductFallback(seed);
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return normalizeRemoteImageUrl(path);
  }
  if (path.startsWith("/uploads/") || path.startsWith("uploads/")) {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE}${normalized}`;
  }
  if (path.startsWith("/")) return `${API_BASE}${path}`;
  return path;
}

export function getProductImages(product) {
  if (!product) return [{ imagePath: getProductFallback(0), isPrimary: true }];

  const raw = product.images || product.ProductImages || [];
  if (!Array.isArray(raw) || raw.length === 0) {
    return [
      {
        imagePath: getProductFallback(product.id || 0),
        isPrimary: true,
        altText: product.name || "Product",
      },
    ];
  }

  return raw.map((img, index) => ({
    ...img,
    imagePath: resolveImagePath(
      img.imagePath || img.imageUrl || img.url,
      (product.id || 0) + index
    ),
  }));
}

export function getPrimaryProductImage(product) {
  const images = getProductImages(product);
  const primary = images.find((img) => img.isPrimary) || images[0];
  return resolveImagePath(primary?.imagePath, product?.id || 0);
}

export default {
  getProductFallback,
  resolveImagePath,
  getProductImages,
  getPrimaryProductImage,
};
