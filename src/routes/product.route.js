import express from "express"
import { getProducts, getProductsById, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js"

import { authMiddleware, checkRole } from "../middleware/auth.js"

const productRoute = express.Router()

productRoute.get('/', authMiddleware, checkRole("admin"), getProducts)
productRoute.get('/:id', authMiddleware, checkRole("admin"), getProductsById)
productRoute.post('/', authMiddleware, checkRole("admin"), createProduct)
productRoute.put('/:id', authMiddleware, checkRole("admin"), updateProduct)
productRoute.delete('/:id', authMiddleware, checkRole("admin"), deleteProduct)


export default productRoute
