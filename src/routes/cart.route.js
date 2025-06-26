import {Router} from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { addToCart,clearCart,deleteCartItem,getCart,getCartCount,updateCartItem } from '../controllers/cart.controller.js';

const cartRouter = Router();

cartRouter.post('/add', authMiddleware, addToCart);    // Create cart
cartRouter.get('/', authMiddleware, getCart);        // Get cart
cartRouter.put('/', authMiddleware, updateCartItem);     // Update cart
cartRouter.delete('/delete/:itemId', authMiddleware, deleteCartItem); 
cartRouter.get('/count', authMiddleware, getCartCount); // Get cart count
cartRouter.delete('/clear', authMiddleware, clearCart); // Clear cart

export default cartRouter;

