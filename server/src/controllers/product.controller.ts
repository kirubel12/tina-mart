import type { Context } from 'hono';
import productService from '../services/product.service.js';
import { validateCreateProductInput, validateUpdateProductInput } from '../utils/validators.js';
import {
  successResponse,
  validationErrorResponse,
  formatProductWithCount,
  formatProductsListResponse,
} from '../utils/response-formatter.js';
import { PRODUCT_MESSAGES, ERROR_MESSAGES } from '../constants/messages.js';

/**
 * Create a new product
 */
export const createProduct = async (c: Context) => {
  try {
    const requestData = await c.req.json();
    const user = c.get('user');
    const userId = user.id;

    // Validate input
    const validation = validateCreateProductInput(requestData);
    if (!validation.isValid) {
      return c.json(validationErrorResponse(validation.errors), 400);
    }

    const { name, description, price, category, inventory, images } = requestData;

    // Create product
    const product = await productService.createProduct({
      name,
      description,
      price,
      category,
      inventory,
      images,
      userId,
    });

    const productCount = await productService.getProductCount();

    return c.json(
      formatProductWithCount(product, productCount, PRODUCT_MESSAGES.CREATED),
      201
    );
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400);
  }
};

/**
 * Get all products
 */
export const getAllProducts = async (c: Context) => {
  try {
    const products = await productService.findAllProducts();
    return c.json(formatProductsListResponse(products, PRODUCT_MESSAGES.PRODUCTS_FETCHED));
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
};

/**
 * Get a single product by ID
 */
export const getProductById = async (c: Context) => {
  try {
    const id = c.req.param('id');
    const product = await productService.findProductById(id, true);

    if (!product) {
      return c.json({ error: ERROR_MESSAGES.PRODUCT_NOT_FOUND }, 404);
    }

    return c.json(successResponse(PRODUCT_MESSAGES.FETCHED, product));
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
};

/**
 * Update a product by ID
 */
export const updateProduct = async (c: Context) => {
  try {
    const id = c.req.param('id');
    const requestData = await c.req.json();

    // Validate input
    const validation = validateUpdateProductInput(requestData);
    if (!validation.isValid) {
      return c.json(validationErrorResponse(validation.errors), 400);
    }

    const product = await productService.updateProductById(id, requestData);

    if (!product) {
      return c.json({ error: ERROR_MESSAGES.PRODUCT_NOT_FOUND }, 404);
    }

    return c.json(successResponse(PRODUCT_MESSAGES.UPDATED, product));
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400);
  }
};

/**
 * Delete a product by ID
 */
export const deleteProduct = async (c: Context) => {
  try {
    const id = c.req.param('id');
    const product = await productService.deleteProductById(id);

    if (!product) {
      return c.json({ error: ERROR_MESSAGES.PRODUCT_NOT_FOUND }, 404);
    }

    return c.json(successResponse(PRODUCT_MESSAGES.DELETED));
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
};

/**
 * Get all products by a specific user ID
 */
export const getProductsByUserId = async (c: Context) => {
  try {
    const userId = c.req.param('userId');
    const products = await productService.findProductsByUserId(userId);
    return c.json(formatProductsListResponse(products, PRODUCT_MESSAGES.USER_PRODUCTS_FETCHED));
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
};