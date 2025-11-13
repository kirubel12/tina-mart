import CartItem from '../models/cart-item.model.js';
import Product from '../models/product.model.js';
import type { ICartItem } from '../models/cart-item.model';
import type { IProduct } from '../models/product.model';
import mongoose from 'mongoose';

export interface CartItemInput {
  cartId: string;
  userId: string;
  productId: string;
  quantity: number;
}

export interface CartItemWithProduct extends Omit<ICartItem, 'productId'> {
  productId: IProduct;
}

export class CartItemService {
  /**
   * Find product by ID and validate existence
   */
  async findProductById(productId: string): Promise<IProduct | null> {
    return await Product.findById(productId);
  }

  /**
   * Check if product has sufficient inventory
   */
  hasInsufficientInventory(product: IProduct, requestedQuantity: number): boolean {
    return product.inventory < requestedQuantity;
  }

  /**
   * Find existing cart item for a user and product
   */
  async findExistingCartItem(userId: string, productId: string): Promise<ICartItem | null> {
    return await CartItem.findOne({ userId, productId });
  }

  /**
   * Update existing cart item quantity
   */
  async updateCartItemQuantity(
    cartItem: ICartItem,
    product: IProduct,
    additionalQuantity: number
  ): Promise<ICartItem> {
    const newQuantity = cartItem.quantity + additionalQuantity;
    
    if (this.hasInsufficientInventory(product, newQuantity)) {
      throw new Error('Insufficient product inventory');
    }

    cartItem.quantity = newQuantity;
    cartItem.price = product.price * newQuantity;
    await cartItem.save();

    return await this.findCartItemByIdWithProduct((cartItem._id as mongoose.Types.ObjectId).toString());
  }

  /**
   * Create new cart item
   */
  async createCartItem(input: CartItemInput, product: IProduct): Promise<ICartItem> {
    const cartItem = new CartItem({
      cartId: input.cartId,
      userId: input.userId,
      productId: input.productId,
      quantity: input.quantity,
      price: product.price * input.quantity,
    });

    await cartItem.save();
    return await this.findCartItemByIdWithProduct((cartItem._id as mongoose.Types.ObjectId).toString());
  }

  /**
   * Find cart item by ID with populated product
   */
  async findCartItemByIdWithProduct(id: string): Promise<ICartItem> {
    const cartItem = await CartItem.findById(id).populate('productId', 'name description price images');
    if (!cartItem) {
      throw new Error('Cart item not found');
    }
    return cartItem;
  }

  /**
   * Get all cart items for a user
   */
  async getCartItemsByUserId(userId: string): Promise<ICartItem[]> {
    return await CartItem.find({ userId }).populate('productId', 'name description price images');
  }

  /**
   * Update cart item quantity by ID
   */
  async updateCartItemById(id: string, quantity: number): Promise<ICartItem> {
    const cartItem = await CartItem.findById(id).populate('productId');
    
    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    const product = cartItem.productId as unknown as IProduct;
    
    if (this.hasInsufficientInventory(product, quantity)) {
      throw new Error('Insufficient product inventory');
    }

    cartItem.quantity = quantity;
    cartItem.price = product.price * quantity;
    await cartItem.save();

    return await this.findCartItemByIdWithProduct(id);
  }

  /**
   * Delete cart item by ID
   */
  async deleteCartItemById(id: string): Promise<ICartItem | null> {
    return await CartItem.findByIdAndDelete(id);
  }

  /**
   * Delete all cart items for a user
   */
  async deleteAllCartItemsByUserId(userId: string): Promise<number> {
    const result = await CartItem.deleteMany({ userId });
    return result.deletedCount || 0;
  }

  /**
   * Calculate grand total for cart items
   */
  calculateGrandTotal(cartItems: ICartItem[]): number {
    return cartItems.reduce((sum, item) => {
      const product = item.productId as unknown as IProduct;
      const totalPrice = (product?.price || 0) * item.quantity;
      return sum + totalPrice;
    }, 0);
  }
}

export default new CartItemService();
