import type { ICartItem } from '../models/cart-item.model.js';
import type { IProduct } from '../models/product.model.js';

export interface CartItemResponse {
  unitPrice: number;
  totalPrice: number;
  [key: string]: any;
}

export interface CartSummaryResponse {
  cartId: string;
  success: boolean;
  message: string;
  data: CartItemResponse[];
  count: number;
  grandTotal: number;
}

/**
 * Format a single cart item with price calculations
 */
export function formatCartItemResponse(cartItem: ICartItem): CartItemResponse {
  const product = cartItem.productId as unknown as IProduct;
  const itemObj = cartItem.toObject();
  
  // Remove internal fields from response
  delete itemObj.cartId;
  delete itemObj.id; // Remove duplicate id field (Mongoose virtual or custom field)
  
  return {
    ...itemObj,
    unitPrice: product?.price || 0,
    totalPrice: (product?.price || 0) * cartItem.quantity,
  };
}

/**
 * Format multiple cart items with summary
 */
export function formatCartSummaryResponse(
  cartItems: ICartItem[],
  userId: string,
  message: string = 'Cart items fetched successfully'
): CartSummaryResponse {
  const formattedItems = cartItems.map(formatCartItemResponse);
  
  const grandTotal = formattedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartId = `cart_${userId}`;
  
  return {
    cartId,
    success: true,
    message,
    data: formattedItems,
    count: cartItems.length,
    grandTotal,
  };
}

/**
 * Generic success response
 */
export function successResponse<T = any>(message: string, data?: T) {
  return {
    success: true,
    message,
    ...(data !== undefined && { data }),
  };
}

/**
 * Generic error response
 */
export function errorResponse(message: string, statusCode: number = 400) {
  return {
    success: false,
    error: message,
    statusCode,
  };
}

/**
 * Validation error response
 */
export function validationErrorResponse(errors: string[]) {
  return {
    success: false,
    errors,
  };
}

/**
 * Format product response with count
 */
export function formatProductWithCount<T = any>(product: T, count: number, message: string) {
  return {
    success: true,
    message,
    data: product,
    count,
  };
}

/**
 * Format products list response
 */
export function formatProductsListResponse<T = any>(products: T[], message: string) {
  return {
    success: true,
    message,
    data: products,
    count: products.length,
  };
}
