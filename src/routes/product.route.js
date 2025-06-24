import express from "express"
import { getProducts, getProductsById, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js"

import { authMiddleware } from "../middleware/auth.js"

const productRoute = express.Router()

productRoute.get('/', authMiddleware, getProducts)
productRoute.get('/:id', authMiddleware, getProductsById)
productRoute.post('/', authMiddleware, createProduct)
productRoute.put('/:id', authMiddleware, updateProduct)
productRoute.delete('/:id', authMiddleware, deleteProduct)


export default productRoute
