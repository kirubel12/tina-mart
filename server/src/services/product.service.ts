import Product from '../models/product.model.js';
import type { IProduct } from '../models/product.model.js';

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  images?: string[];
  userId: string;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  inventory?: number;
  images?: string[];
  userId?: string;
}

export class ProductService {
  /**
   * Create a new product
   */
  async createProduct(input: CreateProductInput): Promise<IProduct> {
    const product = new Product({
      name: input.name,
      description: input.description,
      price: input.price,
      category: input.category,
      inventory: input.inventory,
      images: input.images || [],
      userId: input.userId,
    });

    await product.save();
    return product;
  }

  /**
   * Find all products
   */
  async findAllProducts(): Promise<IProduct[]> {
    return await Product.find();
  }

  /**
   * Find product by ID
   */
  async findProductById(id: string, populateUser: boolean = true): Promise<IProduct | null> {
    const query = Product.findById(id);
    
    if (populateUser) {
      return await query.populate('userId', 'name email');
    }
    
    return await query;
  }

  /**
   * Find products by user ID
   */
  async findProductsByUserId(userId: string): Promise<IProduct[]> {
    return await Product.find({ userId }).populate('userId', 'name email');
  }

  /**
   * Update product by ID
   */
  async updateProductById(id: string, input: UpdateProductInput): Promise<IProduct | null> {
    const updateData: any = {};
    
    // Only include fields that are provided
    if (input.name !== undefined) updateData.name = input.name;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.price !== undefined) updateData.price = input.price;
    if (input.category !== undefined) updateData.category = input.category;
    if (input.inventory !== undefined) updateData.inventory = input.inventory;
    if (input.images !== undefined) updateData.images = input.images;
    if (input.userId !== undefined) updateData.userId = input.userId;

    return await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'name email');
  }

  /**
   * Delete product by ID
   */
  async deleteProductById(id: string): Promise<IProduct | null> {
    return await Product.findByIdAndDelete(id);
  }

  /**
   * Get total product count
   */
  async getProductCount(): Promise<number> {
    return await Product.countDocuments();
  }

  /**
   * Check if product exists
   */
  async productExists(id: string): Promise<boolean> {
    const product = await Product.findById(id);
    return !!product;
  }

  /**
   * Search products by criteria
   */
  async searchProducts(criteria: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<IProduct[]> {
    const query: any = {};

    if (criteria.category) {
      query.category = criteria.category;
    }

    if (criteria.minPrice !== undefined || criteria.maxPrice !== undefined) {
      query.price = {};
      if (criteria.minPrice !== undefined) query.price.$gte = criteria.minPrice;
      if (criteria.maxPrice !== undefined) query.price.$lte = criteria.maxPrice;
    }

    if (criteria.search) {
      query.$or = [
        { name: { $regex: criteria.search, $options: 'i' } },
        { description: { $regex: criteria.search, $options: 'i' } },
      ];
    }

    return await Product.find(query).populate('userId', 'name email');
  }

  /**
   * Update product inventory
   */
  async updateInventory(id: string, quantity: number): Promise<IProduct | null> {
    return await Product.findByIdAndUpdate(
      id,
      { $inc: { inventory: quantity } },
      { new: true }
    );
  }
}

export default new ProductService();
