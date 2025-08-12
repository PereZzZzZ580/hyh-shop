export type ProductImage = {
  id: string;
  url: string;
  alt?: string | null;
};

export type ProductVariant = {
  id: string;
  price: number;
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  brand?: string | null;
  category: ProductCategory;
  images: ProductImage[];
  variants: ProductVariant[];
};
