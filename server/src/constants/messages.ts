export const CART_MESSAGES = {
  ITEM_ADDED: 'Item added to cart successfully',
  ITEM_UPDATED: 'Cart item updated successfully',
  ITEM_REMOVED: 'Item removed from cart successfully',
  ITEM_FETCHED: 'Cart item fetched successfully',
  ITEMS_FETCHED: 'Cart items fetched successfully',
  CART_CLEARED: 'Cart cleared successfully',
} as const;

export const PRODUCT_MESSAGES = {
  CREATED: 'Product created successfully',
  UPDATED: 'Product updated successfully',
  DELETED: 'Product deleted successfully',
  FETCHED: 'Product fetched successfully',
  PRODUCTS_FETCHED: 'Products fetched successfully',
  USER_PRODUCTS_FETCHED: 'Products created by user',
} as const;

export const ERROR_MESSAGES = {
  PRODUCT_NOT_FOUND: 'Product not found',
  CART_ITEM_NOT_FOUND: 'Cart item not found',
  INSUFFICIENT_INVENTORY: 'Insufficient product inventory',
  INVALID_QUANTITY: 'Quantity must be a positive number',
} as const;
