import {Hono} from "hono";
import {createProduct, deleteProduct, getAllProducts, getProductById, getProductsByUserId, updateProduct} from "../controllers/product.controller";
import authMiddleware from "../middleware/auth";
import adminMiddleware from "../middleware/admin";


const productRoutes = new Hono();

productRoutes.post('/', authMiddleware, adminMiddleware, createProduct);
productRoutes.get('/', authMiddleware, getAllProducts);
productRoutes.get('/:id', authMiddleware, getProductById);
productRoutes.put('/:id', authMiddleware, adminMiddleware, updateProduct);
productRoutes.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);
productRoutes.get('/user/:userId', authMiddleware,adminMiddleware, getProductsByUserId);

export default productRoutes;   