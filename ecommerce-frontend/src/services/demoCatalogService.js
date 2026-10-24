import {
  DEMO_BRANDS,
  DEMO_CATEGORIES,
  DEMO_PRODUCTS,
  DEMO_SUBCATEGORIES,
} from "../data/demoCatalog";

const asBool = (value) => value === true || value === "true";

function matchParams(product, params = {}) {
  if (params.status && product.status !== params.status) return false;
  if (params.isActive !== undefined && asBool(params.isActive) && !product.isActive) return false;
  if (params.isFeatured !== undefined && asBool(params.isFeatured) && !product.isFeatured) return false;
  if (params.isTrending !== undefined && asBool(params.isTrending) && !product.isTrending) return false;
  if (params.isNewArrival !== undefined && asBool(params.isNewArrival) && !product.isNewArrival) {
    return false;
  }
  if (params.isBestseller !== undefined && asBool(params.isBestseller) && !product.isBestseller) {
    return false;
  }
  if (params.categoryId && Number(product.categoryId) !== Number(params.categoryId)) return false;
  if (params.subCategoryId && Number(product.subCategoryId) !== Number(params.subCategoryId)) {
    return false;
  }

  if (params.categories) {
    const ids = String(params.categories)
      .split(",")
      .map((id) => Number(id))
      .filter(Boolean);
    if (ids.length && !ids.includes(Number(product.categoryId))) return false;
  }

  if (params.subCategories) {
    const ids = String(params.subCategories)
      .split(",")
      .map((id) => Number(id))
      .filter(Boolean);
    if (ids.length && !ids.includes(Number(product.subCategoryId))) return false;
  }

  if (params.brands) {
    const ids = String(params.brands)
      .split(",")
      .map((id) => Number(id))
      .filter(Boolean);
    if (ids.length && !ids.includes(Number(product.brandId))) return false;
  }

  if (params.search) {
    const q = String(params.search).toLowerCase();
    const hay = `${product.name} ${product.shortDescription || ""} ${product.sku}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }

  if (params.minPrice != null && Number(product.salePrice || product.basePrice) < Number(params.minPrice)) {
    return false;
  }
  if (params.maxPrice != null && Number(product.salePrice || product.basePrice) > Number(params.maxPrice)) {
    return false;
  }

  if (asBool(params.inStock) && Number(product.stockQuantity) <= 0) return false;

  return true;
}

function sortProducts(list, params = {}) {
  const sorted = [...list];
  const sortBy = params.sortBy || "displayOrder";
  const order = String(params.order || "ASC").toUpperCase() === "DESC" ? -1 : 1;

  sorted.sort((a, b) => {
    const priceA = Number(a.salePrice || a.basePrice);
    const priceB = Number(b.salePrice || b.basePrice);

    if (sortBy === "price_low" || (sortBy === "basePrice" && order === 1)) return priceA - priceB;
    if (sortBy === "price_high" || (sortBy === "basePrice" && order === -1)) return priceB - priceA;
    if (sortBy === "createdAt") return String(b.publishedAt).localeCompare(String(a.publishedAt));
    if (sortBy === "popularity") return (b.salesCount || 0) - (a.salesCount || 0);
    if (sortBy === "rating") return Number(b.averageRating) - Number(a.averageRating);
    if (sortBy === "discount") {
      const dA = a.salePrice ? Number(a.basePrice) - Number(a.salePrice) : 0;
      const dB = b.salePrice ? Number(b.basePrice) - Number(b.salePrice) : 0;
      return dB - dA;
    }
    return (a.displayOrder - b.displayOrder) * order;
  });

  return sorted;
}

function paginate(list, params = {}) {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.max(1, Number(params.limit) || 24);
  const start = (page - 1) * limit;
  const products = list.slice(start, start + limit);
  return {
    products,
    pagination: {
      total: list.length,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(list.length / limit)),
    },
  };
}

export function demoAxiosProducts(params = {}) {
  const filtered = sortProducts(DEMO_PRODUCTS.filter((p) => matchParams(p, params)), params);
  const data = paginate(filtered, params);
  return Promise.resolve({
    data: {
      status: true,
      statusCode: 200,
      message: "Demo products fetched",
      data,
    },
  });
}

export function demoAxiosProductBySlug(slug) {
  const product = DEMO_PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    return Promise.reject({
      response: {
        status: 404,
        data: { status: false, message: "Demo product not found" },
      },
    });
  }
  return Promise.resolve({
    data: {
      status: true,
      statusCode: 200,
      message: "Demo product fetched",
      data: product,
    },
  });
}

export function demoAxiosProductById(id) {
  const product = DEMO_PRODUCTS.find((p) => Number(p.id) === Number(id));
  if (!product) {
    return Promise.reject({
      response: {
        status: 404,
        data: { status: false, message: "Demo product not found" },
      },
    });
  }
  return Promise.resolve({
    data: {
      status: true,
      statusCode: 200,
      message: "Demo product fetched",
      data: product,
    },
  });
}

export function demoCategoriesBody() {
  return Promise.resolve({
    status: true,
    statusCode: 200,
    message: "Demo categories fetched",
    data: DEMO_CATEGORIES.filter((c) => c.isActive),
  });
}

export function demoFilterOptionsBody() {
  const sizes = [...new Set(DEMO_PRODUCTS.flatMap((p) => p.sizes || []))];
  const colors = [...new Set(DEMO_PRODUCTS.flatMap((p) => p.colors || []))];
  return Promise.resolve({
    status: true,
    statusCode: 200,
    message: "Demo filter options",
    data: {
      categories: DEMO_CATEGORIES.filter((c) => c.isActive),
      subCategories: DEMO_SUBCATEGORIES.filter((s) => s.isActive),
      brands: DEMO_BRANDS,
      sizes,
      colors,
      priceRange: { min: 699, max: 1699 },
    },
  });
}

export function demoFilteredProductsBody(params = {}) {
  const filtered = sortProducts(DEMO_PRODUCTS.filter((p) => matchParams(p, params)), params);
  const data = paginate(filtered, params);
  return Promise.resolve({
    status: true,
    statusCode: 200,
    message: "Demo products fetched",
    data,
  });
}
