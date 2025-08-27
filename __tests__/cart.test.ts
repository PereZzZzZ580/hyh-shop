import { useCart } from '@/store/cart';

describe('Cart store', () => {
  beforeEach(() => {
    useCart.setState({ id: null, items: [] });
  });

  it('calculates total using item prices', () => {
    useCart.setState({
      id: 'cart1',
      items: [
        {
          id: '1',
          variantId: 'v1',
          qty: 2,
          priceSnapshot: 100,
          variant: {
            id: 'v1',
            price: 100,
            compareAtPrice: null,
            stock: 10,
            attributes: {},
            product: { name: 'p1', slug: 'p1', brand: null },
          },
        },
        {
          id: '2',
          variantId: 'v2',
          qty: 3,
          priceSnapshot: 200,
          variant: {
            id: 'v2',
            price: 200,
            compareAtPrice: null,
            stock: 10,
            attributes: {},
            product: { name: 'p2', slug: 'p2', brand: null },
          },
        },
      ],
    });

    expect(useCart.getState().total()).toBe(2 * 100 + 3 * 200);
  });

  it('falls back to variant price when priceSnapshot is 0', () => {
    useCart.setState({
      id: 'cart2',
      items: [
        {
          id: '1',
          variantId: 'v1',
          qty: 1,
          priceSnapshot: 0,
          variant: {
            id: 'v1',
            price: 150,
            compareAtPrice: null,
            stock: 5,
            attributes: {},
            product: { name: 'p1', slug: 'p1', brand: null },
          },
        },
      ],
    });

    expect(useCart.getState().total()).toBe(150);
  });
});