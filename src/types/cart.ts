export type CartProduct = {
  name: string;
  slug: string;
  brand?: string | null;
};

export type Atributos = Record<string, string>;

export type CartVariant = {
  id: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  attributes: Atributos;
  product: CartProduct;
};

export type CartItem = {
  id: string;
  variantId: string;
  qty: number;
  priceSnapshot: number;
  variant: CartVariant;
};

export type Cart = {
  id: string;
  items: CartItem[];
};
