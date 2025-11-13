import { Hono } from "hono";
import { addToCart, getAllCartItems, getCartItemById, updateCartItem, removeFromCart, clearCart } from "../controllers/cart-item.controller";
import authMiddleware from "../middleware/auth";
import adminMiddleware from "../middleware/admin";

const cartItemRoutes = new Hono();

// Add item to cart - authenticated users only
// Note: This might not need admin middleware since customers should be able to add to their own cart
cartItemRoutes.post('/', authMiddleware, addToCart);

// Get all cart items - admin and vendor only
cartItemRoutes.get('/', authMiddleware, adminMiddleware, getAllCartItems);

// Get cart item by ID - admin and vendor only
cartItemRoutes.get('/:id', authMiddleware, adminMiddleware, getCartItemById);

// Update cart item quantity - authenticated users only
cartItemRoutes.put('/:id', authMiddleware, updateCartItem);

// Remove item from cart - authenticated users only
cartItemRoutes.delete('/:id', authMiddleware, removeFromCart);

// Clear all cart items - admin only
cartItemRoutes.delete('/', authMiddleware, adminMiddleware, clearCart);

export default cartItemRoutes;