export type Media = {
  id: string;
  url: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  isCover?: boolean | null;
};

export type Atributos = Record<string, string>;

export type Variant = {
  id: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  attributes: Atributos;
  media?: Media[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  brand?: string | null;
  description?: string | null;
  category: Category;
  images: Media[];
  variants: Variant[];
};
