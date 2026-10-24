/**
 * Local dummy catalog for Beeztee storefront.
 * Used only when USE_DEMO_PRODUCTS is true in src/config/demo.js
 */

const img = (id, seed) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=900&h=1200&q=80&sig=${id}`;

export const DEMO_CATEGORIES = [
  {
    id: 1,
    name: "Men",
    slug: "men",
    description: "Shirts, oversized tees, and everyday essentials",
    isActive: true,
    isFeatured: true,
    displayOrder: 1,
    image: null,
  },
  {
    id: 2,
    name: "Women",
    slug: "women",
    description: "Crop tops, oversized tees, and elevated everyday wear",
    isActive: true,
    isFeatured: true,
    displayOrder: 2,
    image: null,
  },
];

export const DEMO_SUBCATEGORIES = [
  { id: 2, categoryId: 1, name: "Shirts", slug: "shirts", isActive: true, displayOrder: 1 },
  { id: 26, categoryId: 1, name: "Oversized T-Shirts", slug: "oversized-t-shirts", isActive: true, displayOrder: 2 },
  { id: 1, categoryId: 1, name: "T-Shirts", slug: "mens-t-shirts", isActive: true, displayOrder: 3 },
  { id: 27, categoryId: 2, name: "Crop Tops", slug: "womens-crop-tops", isActive: true, displayOrder: 1 },
  { id: 28, categoryId: 2, name: "Oversized T-Shirts", slug: "womens-oversized-t-shirts", isActive: true, displayOrder: 2 },
  { id: 6, categoryId: 2, name: "Tops", slug: "womens-tops", isActive: true, displayOrder: 3 },
];

export const DEMO_BRANDS = [
  { id: 1, name: "Beeztee", slug: "beeztee", isActive: true },
];

function product({
  id,
  name,
  slug,
  sku,
  categoryId,
  subCategoryId,
  basePrice,
  salePrice = null,
  stockQuantity = 40,
  isFeatured = false,
  isTrending = false,
  isNewArrival = true,
  isBestseller = false,
  shortDescription,
  description,
  attributes,
  colors = ["Black"],
  sizes = ["S", "M", "L", "XL"],
  imageSeed,
  displayOrder = id,
}) {
  const category = DEMO_CATEGORIES.find((c) => c.id === categoryId);
  const subCategory = DEMO_SUBCATEGORIES.find((s) => s.id === subCategoryId);
  const primary = img(id, imageSeed);
  const secondary = img(id + 100, imageSeed);

  const variants = [];
  colors.forEach((color) => {
    sizes.forEach((size) => {
      variants.push({
        id: Number(`${id}${color.charCodeAt(0)}${size.charCodeAt(0)}`),
        productId: id,
        sku: `${sku}-${color.slice(0, 3).toUpperCase()}-${size}`,
        color,
        size,
        stockQuantity: Math.max(2, Math.floor(stockQuantity / (colors.length * sizes.length))),
        isActive: true,
        isDefault: color === colors[0] && size === sizes[0],
      });
    });
  });

  return {
    id,
    name,
    slug,
    sku,
    shortDescription,
    description: description || `${name} — crafted for everyday polish by Beeztee.`,
    categoryId,
    subCategoryId,
    brandId: 1,
    basePrice: String(basePrice),
    salePrice: salePrice != null ? String(salePrice) : null,
    stockQuantity,
    lowStockThreshold: 5,
    isActive: true,
    isFeatured,
    isTrending,
    isNewArrival,
    isBestseller,
    status: "published",
    publishedAt: "2026-10-13T10:00:00.000Z",
    displayOrder,
    viewCount: 0,
    salesCount: isBestseller ? 24 : 6,
    averageRating: "4.50",
    reviewCount: isBestseller ? 12 : 3,
    category: category ? { id: category.id, name: category.name, slug: category.slug } : null,
    subCategory: subCategory
      ? { id: subCategory.id, name: subCategory.name, slug: subCategory.slug }
      : null,
    brand: DEMO_BRANDS[0],
    images: [
      {
        id: id * 10 + 1,
        imagePath: primary,
        imageUrl: primary,
        altText: name,
        isPrimary: true,
        displayOrder: 0,
        mediaType: "image",
      },
      {
        id: id * 10 + 2,
        imagePath: secondary,
        imageUrl: secondary,
        altText: `${name} alternate`,
        isPrimary: false,
        displayOrder: 1,
        mediaType: "image",
      },
    ],
    variants,
    colors,
    sizes,
    attributes: attributes || [],
  };
}

export const DEMO_PRODUCTS = [
  product({
    id: 101,
    name: "Classic Oxford Shirt",
    slug: "demo-classic-oxford-shirt",
    sku: "DEMO-SHIRT-OXFORD",
    categoryId: 1,
    subCategoryId: 2,
    basePrice: 1499,
    salePrice: 1299,
    isFeatured: true,
    isBestseller: true,
    shortDescription: "Color semi-fit cotton linen shirt",
    description: `
      <h3>Product Details</h3>
      <p>Blue solid casual shirt has a spread collar, long sleeves, and a curved hem.</p>
      <h3>Size & Fit</h3>
      <p>Slim fit. The model (height 6') is wearing a size 40.</p>
      <h3>Material & Care</h3>
      <p>Cotton Linen. Machine-wash.</p>
      <h3>Style Note</h3>
      <p>This solid shirt from Beeztee will make you look your casual best. Wear this blue shirt with a pair of chinos and loafers for the perfect weekend look.</p>
    `,
    attributes: [
      { attributeName: "Primary color", attributeValue: "Blue" },
      { attributeName: "Weave Pattern", attributeValue: "Regular" },
      { attributeName: "Fit", attributeValue: "Slim Fit" },
      { attributeName: "Fabrics", attributeValue: "Linen" },
      { attributeName: "Sustainable", attributeValue: "Regular" },
    ],
    colors: ["White", "Sky Blue", "Black"],
    imageSeed: "1523381216130-8b3f99a87a6d",
    displayOrder: 1,
  }),
  product({
    id: 102,
    name: "Relaxed Linen Shirt",
    slug: "demo-relaxed-linen-shirt",
    sku: "DEMO-SHIRT-LINEN",
    categoryId: 1,
    subCategoryId: 2,
    basePrice: 1699,
    isFeatured: true,
    isBestseller: true,
    shortDescription: "Men’s relaxed fit cotton linen shirt",
    description: `
      <h3>Product Details</h3>
      <p>Men's relaxed fit blue solid casual shirt, has a spread collar, long sleeves, curved hem.</p>
      <h3>Size & Fit</h3>
      <p>Slim fit. The model (height 6') is wearing a size 40.</p>
      <h3>Material & Care</h3>
      <p>Cotton Linen. Machine-wash.</p>
      <h3>Style Note</h3>
      <p>This solid shirt from Beeztee will make you look your casual best. Wear this blue shirt with a pair of chinos and loafers for the perfect weekend look.</p>
    `,
    attributes: [
      { attributeName: "Weave Pattern", attributeValue: "Regular" },
      { attributeName: "Fit", attributeValue: "Slim Fit" },
      { attributeName: "Fabrics", attributeValue: "Cotton Linen" },
      { attributeName: "Sustainable", attributeValue: "Regular" },
    ],
    colors: ["Beige", "Olive", "Navy"],
    imageSeed: "1596755094514-f87e34085b2c",
    displayOrder: 2,
  }),
  product({
    id: 103,
    name: "Cuban Collar Shirt",
    slug: "demo-cuban-collar-shirt",
    sku: "DEMO-SHIRT-CUBAN",
    categoryId: 1,
    subCategoryId: 2,
    basePrice: 1599,
    salePrice: 1399,
    isBestseller: true,
    shortDescription: "Oversized boxy fit Cuban collar textured self design",
    description: `
      <h3>Product Details</h3>
      <p>White solid opaque casual shirt, has a button-down collar, short regular sleeves, straight hem.</p>
      <h3>Size & Fit</h3>
      <p>Slim fit. Brand fit: Classic. Fit: Relaxed Fit. The model (height 6') is wearing a size 40.</p>
      <h3>Material & Care</h3>
      <p>Cotton. Machine-wash.</p>
      <h3>Style Note</h3>
      <p>This boxy shirt from Beeztee will make you look your casual best. Wear this lemon yellow shirt with a pair of chinos and loafers for the perfect weekend look.</p>
    `,
    attributes: [
      { attributeName: "Fit", attributeValue: "Boxy Fit" },
      { attributeName: "Primary Color", attributeValue: "Lemon yellow, Ice blue, Peach pink, Dusty pink" },
      { attributeName: "Fabrics", attributeValue: "Cotton Linen" },
      { attributeName: "Sustainable", attributeValue: "Regular" },
    ],
    colors: ["White", "Brown", "Black"],
    imageSeed: "1602810318383-e386cc2a3ccf",
    displayOrder: 3,
  }),
  product({
    id: 104,
    name: "Oversized Essential Tee — Black",
    slug: "demo-oversized-essential-tee-black",
    sku: "DEMO-OT-BLK",
    categoryId: 1,
    subCategoryId: 26,
    basePrice: 999,
    salePrice: 899,
    isFeatured: true,
    isBestseller: true,
    isTrending: true,
    shortDescription: "Heavyweight oversized fit in black",
    colors: ["Black"],
    imageSeed: "1521572163474-6864f9cf17ab",
    displayOrder: 10,
  }),
  product({
    id: 105,
    name: "Oversized Essential Tee — Beige",
    slug: "demo-oversized-essential-tee-beige",
    sku: "DEMO-OT-BGE",
    categoryId: 1,
    subCategoryId: 26,
    basePrice: 999,
    salePrice: 899,
    isFeatured: true,
    isBestseller: true,
    shortDescription: "Heavyweight oversized fit in beige",
    colors: ["Beige"],
    imageSeed: "1503342217505-b0a15ec3261c",
    displayOrder: 11,
  }),
  product({
    id: 106,
    name: "Essential Crew Tee — White",
    slug: "demo-essential-crew-tee-white",
    sku: "DEMO-MT-WHT",
    categoryId: 1,
    subCategoryId: 1,
    basePrice: 799,
    salePrice: 699,
    isNewArrival: true,
    isBestseller: true,
    shortDescription: "Soft cotton crew neck tee",
    colors: ["White", "Black"],
    imageSeed: "1521572163474-6864f9cf17ab",
    displayOrder: 30,
  }),
  product({
    id: 201,
    name: "Soft Rib Crop Top — Black",
    slug: "demo-soft-rib-crop-top-black",
    sku: "DEMO-WC-BLK",
    categoryId: 2,
    subCategoryId: 27,
    basePrice: 899,
    salePrice: 799,
    isFeatured: true,
    isBestseller: true,
    shortDescription: "Fitted rib crop top",
    colors: ["Black", "White"],
    sizes: ["XS", "S", "M", "L"],
    imageSeed: "1515372039744-b8f0229a8667",
    displayOrder: 40,
  }),
  product({
    id: 202,
    name: "Soft Rib Crop Top — Beige",
    slug: "demo-soft-rib-crop-top-beige",
    sku: "DEMO-WC-BGE",
    categoryId: 2,
    subCategoryId: 27,
    basePrice: 899,
    isFeatured: true,
    isBestseller: true,
    shortDescription: "Fitted rib crop in beige",
    colors: ["Beige"],
    sizes: ["XS", "S", "M", "L"],
    imageSeed: "1485230895905-ec40ba36b9bc",
    displayOrder: 41,
  }),
  product({
    id: 203,
    name: "Square Neck Crop — Brown",
    slug: "demo-square-neck-crop-brown",
    sku: "DEMO-WC-BRN",
    categoryId: 2,
    subCategoryId: 27,
    basePrice: 999,
    salePrice: 899,
    isNewArrival: true,
    shortDescription: "Square neck crop top",
    colors: ["Brown", "Black"],
    sizes: ["XS", "S", "M", "L"],
    imageSeed: "1490481651871-ab68de25d43d",
    displayOrder: 42,
  }),
  product({
    id: 204,
    name: "Women Oversized Tee — White",
    slug: "demo-women-oversized-tee-white",
    sku: "DEMO-WO-WHT",
    categoryId: 2,
    subCategoryId: 28,
    basePrice: 1099,
    salePrice: 999,
    isFeatured: true,
    isBestseller: true,
    isTrending: true,
    shortDescription: "Relaxed oversized tee",
    colors: ["White", "Black"],
    imageSeed: "1515886657613-9f3515b0c78f",
    displayOrder: 50,
  }),
  product({
    id: 205,
    name: "Women Oversized Tee — Grey",
    slug: "demo-women-oversized-tee-grey",
    sku: "DEMO-WO-GRY",
    categoryId: 2,
    subCategoryId: 28,
    basePrice: 1099,
    isFeatured: true,
    isBestseller: true,
    shortDescription: "Washed grey oversized tee",
    colors: ["Grey"],
    imageSeed: "1434389677669-e08b4cac3105",
    displayOrder: 51,
  }),
  product({
    id: 206,
    name: "Fluid Satin Top — Champagne",
    slug: "demo-fluid-satin-top-champagne",
    sku: "DEMO-WT-CHP",
    categoryId: 2,
    subCategoryId: 6,
    basePrice: 1499,
    salePrice: 1299,
    isFeatured: true,
    isNewArrival: true,
    shortDescription: "Soft satin everyday top",
    colors: ["Champagne", "Black"],
    sizes: ["XS", "S", "M", "L"],
    imageSeed: "1467043237213-65a2c69bb749",
    displayOrder: 60,
  }),
];
