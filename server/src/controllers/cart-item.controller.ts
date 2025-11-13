import type { Context } from 'hono';
import cartItemService from '../services/cart-item.service.js';
import { validateAddToCartInput, validateUpdateCartItemInput } from '../utils/validators.js';
import {
  formatCartItemResponse,
  formatCartSummaryResponse,
  successResponse,
  validationErrorResponse,
} from '../utils/response-formatter.js';
import { CART_MESSAGES, ERROR_MESSAGES } from '../constants/messages.js';

/**
 * Add item to cart or update quantity if it already exists
 */
export const addToCart = async (c: Context) => {
  try {
    const requestData = await c.req.json();
    const user = c.get('user');
    const userId = user.id;

    // Validate input
    const validation = validateAddToCartInput(requestData);
    if (!validation.isValid) {
      return c.json(validationErrorResponse(validation.errors), 400);
    }

    const { cartId, productId, quantity } = requestData;

    // Check if product exists
    const product = await cartItemService.findProductById(productId);
    if (!product) {
      return c.json({ error: ERROR_MESSAGES.PRODUCT_NOT_FOUND }, 404);
    }

    // Check inventory
    if (cartItemService.hasInsufficientInventory(product, quantity)) {
      return c.json({ error: ERROR_MESSAGES.INSUFFICIENT_INVENTORY }, 400);
    }

    // Check if item already exists in cart
    const existingCartItem = await cartItemService.findExistingCartItem(userId, productId);
    
    if (existingCartItem) {
      const updatedCartItem = await cartItemService.updateCartItemQuantity(
        existingCartItem,
        product,
        quantity
      );
      const responseData = formatCartItemResponse(updatedCartItem);
      return c.json(successResponse(CART_MESSAGES.ITEM_UPDATED, responseData));
    }

    // Create new cart item
    const newCartItem = await cartItemService.createCartItem(
      { cartId, userId, productId, quantity },
      product
    );
    const responseData = formatCartItemResponse(newCartItem);
    
    return c.json(successResponse(CART_MESSAGES.ITEM_ADDED, responseData), 201);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400);
  }
};

/**
 * Get all cart items for the authenticated user
 */
export const getAllCartItems = async (c: Context) => {
  try {
    const user = c.get('user');
    const userId = user.id;
    
    const cartItems = await cartItemService.getCartItemsByUserId(userId);
    const response = formatCartSummaryResponse(cartItems, userId, CART_MESSAGES.ITEMS_FETCHED);
    
    return c.json(response);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
};

/**
 * Get a single cart item by ID
 */
export const getCartItemById = async (c: Context) => {
  try {
    const id = c.req.param('id');
    const cartItem = await cartItemService.findCartItemByIdWithProduct(id);
    const responseData = formatCartItemResponse(cartItem);
    
    return c.json(successResponse(CART_MESSAGES.ITEM_FETCHED, responseData));
  } catch (error: any) {
    const statusCode = error.message === ERROR_MESSAGES.CART_ITEM_NOT_FOUND ? 404 : 500;
    return c.json({ success: false, error: error.message }, statusCode);
  }
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (c: Context) => {
  try {
    const id = c.req.param('id');
    const requestData = await c.req.json();

    // Validate input
    const validation = validateUpdateCartItemInput(requestData);
    if (!validation.isValid) {
      return c.json(validationErrorResponse(validation.errors), 400);
    }

    const { quantity } = requestData;

    const updatedCartItem = await cartItemService.updateCartItemById(id, quantity);
    const responseData = formatCartItemResponse(updatedCartItem);
    
    return c.json(successResponse(CART_MESSAGES.ITEM_UPDATED, responseData));
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    return c.json({ success: false, error: error.message }, statusCode);
  }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (c: Context) => {
  try {
    const id = c.req.param('id');
    const cartItem = await cartItemService.deleteCartItemById(id);

    if (!cartItem) {
      return c.json({ success: false, error: ERROR_MESSAGES.CART_ITEM_NOT_FOUND }, 404);
    }

    return c.json(successResponse(CART_MESSAGES.ITEM_REMOVED));
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
};

/**
 * Clear all cart items for the authenticated user
 */
export const clearCart = async (c: Context) => {
  try {
    const user = c.get('user');
    const userId = user.id;
    
    const deletedCount = await cartItemService.deleteAllCartItemsByUserId(userId);
    
    return c.json(successResponse(CART_MESSAGES.CART_CLEARED, { deletedCount }));
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
};
