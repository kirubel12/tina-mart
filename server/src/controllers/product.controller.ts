import Product from '../models/product.model.js';
import type { Context } from 'hono';

// Create Product
export const createProduct = async (c: Context) => {
  try {
    const {
      name,
      description,
      price,
      category,
      inventory,
      images,
      userId
    } = await c.req.json();

    const validationErrors = [];
    if (!name) validationErrors.push('Product name is required');
    if (!description) validationErrors.push('Product description is required');
    if (!price) validationErrors.push('Product price is required');
    if (!category) validationErrors.push('Product category is required');
    if (!inventory) validationErrors.push('Product inventory is required');
    if (!userId) validationErrors.push('User ID is required');

    if (validationErrors.length > 0) {
      return c.json({ errors: validationErrors }, 400);
    }

    if (typeof price !== 'number' || price < 0) {
      return c.json({ error: 'Price must be a positive number' }, 400);
    }

    if (typeof inventory !== 'number' || inventory < 0) {
      return c.json({ error: 'Inventory must be a positive number' }, 400);
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      inventory,
      images: images || [],
      userId
    });
    
    await product.save();
    return c.json({ success: true, data: product }, 201);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400);
  }
};

// Get All Products
export const getAllProducts = async (c: Context) => {
  try {
    const products = await Product.find();
    return c.json({ success: true, data: products });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
};

// Get Product by ID
export const getProductById = async (c: Context) => {
  try {
    const id = c.req.param('id');
    const product = await Product.findById(id).populate('userId', 'name email');
    
    if (!product) {
      return c.json({ success: false, error: 'Product not found' }, 404);
    }
    
    return c.json({ success: true, data: product });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
};

// Update Product
export const updateProduct = async (c: Context) => {
  try {
    const id = c.req.param('id');
    const {
      name,
      description,
      price,
      category,
      inventory,
      images,
      userId
    } = await c.req.json();

    const validationErrors = [];
    if (name !== undefined && !name) validationErrors.push('Product name cannot be empty');
    if (description !== undefined && !description) validationErrors.push('Product description cannot be empty');
    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      validationErrors.push('Price must be a positive number');
    }
    if (category !== undefined && !category) validationErrors.push('Product category cannot be empty');
    if (inventory !== undefined && (typeof inventory !== 'number' || inventory < 0)) {
      validationErrors.push('Inventory must be a positive number');
    }

    if (validationErrors.length > 0) {
      return c.json({ errors: validationErrors }, 400);
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (category !== undefined) updateData.category = category;
    if (inventory !== undefined) updateData.inventory = inventory;
    if (images !== undefined) updateData.images = images;
    if (userId !== undefined) updateData.userId = userId;
    
    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'name email');
    
    if (!product) {
      return c.json({ success: false, error: 'Product not found' }, 404);
    }
    
    return c.json({ success: true, data: product });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400);
  }
};

// Delete Product
export const deleteProduct = async (c: Context) => {
  try {
    const id = c.req.param('id');
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return c.json({ success: false, error: 'Product not found' }, 404);
    }
    
    return c.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
};

// Get Products by User ID
export const getProductsByUserId = async (c: Context) => {
  try {
    const userId = c.req.param('userId');
    const products = await Product.find({ userId }).populate('userId', 'name email');
    return c.json({ success: true, data: products });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
};