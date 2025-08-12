export type CartProduct = {
  name: string;
  slug: string;
  brand?: string | null;
};

export type CartVariant = {
  id: string;
  price: number;
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
