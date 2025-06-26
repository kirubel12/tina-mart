import mongoose from "mongoose";
import { Cart } from "../models/Cart.model.js";
import { Product } from "../models/Product.model.js";

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Product ID and positive quantity are required.'
            });
        }
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID.'
            });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.'
            });
        }
        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Not enough stock available.'
            });
        }
        let cart = await Cart.findOne({ user: req.user._id });
        if (cart && cart.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to modify this cart.'
            });
        }
        if (!cart) {
            cart = new Cart({
                user: req.user._id,
                items: []
            });
        }
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        const qty = Number(quantity);
        if (itemIndex > -1) {
            if (product.stock < cart.items[itemIndex].quantity + qty) {
                return res.status(400).json({
                    success: false,
                    message: 'Not enough stock to increase quantity.'
                });
            }
            cart.items[itemIndex].quantity += qty;
        } else {
            cart.items.push({ product: productId, quantity: qty });
        }
        await cart.save();
        res.status(200).json({
            success: true,
            message: 'Product added to cart successfully',
            cart: cart
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding product to cart',
            error: error.message
        });
    }
}

export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }
        if (cart.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to view this cart.'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Cart fetched successfully',
            cart: cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching cart',
            error: error.message
        });
    }
}
/**
 * TODO:update card item quantity
 */
export const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Product ID and positive quantity are required.'
            });
        }
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID.'
            });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.'
            });
        }
        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Not enough stock available.'
            });
        }
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found.'
            });
        }
        if (cart.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to modify this cart.'
            });
        }
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart.'
            });
        }
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        res.status(200).json({
            success: true,
            message: 'Cart item updated successfully',
            cart: cart
        });
    } catch (error) {
        console.error('Update cart item error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating cart item',
            error: error.message
        });
    }
}

export const deleteCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid item ID.'
            });
        }
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found.'
            });
        }
        if (cart.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to modify this cart.'
            });
        }
        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart.'
            });
        }
        cart.items.splice(itemIndex, 1);
        await cart.save();
        res.status(200).json({
            success: true,
            message: 'Cart item deleted successfully',
            cart: cart
        });
    } catch (error) {
        console.error('Delete cart item error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting cart item',
            error: error.message
        });
    }
}
export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }
        if (cart.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to modify this cart.'
            });
        }
        cart.items = [];
        await cart.save();
        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
           
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error clearing cart',
            error: error.message
        });
    }
}

export const getCartCount = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }
        if (cart.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to view this cart.'
            });
        }
        const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0);
        res.status(200).json({
            success: true,
            message: 'Cart item count fetched successfully',
            count: itemCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching cart item count',
            error: error.message
        });
    }
}