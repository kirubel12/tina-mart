import {Router} from "express";

import {createOrder, cancelOrder, getOrders, getOrderById, updateOrder} from "../controllers/order.controller.js";
import {authMiddleware, checkRole} from '../middleware/auth.js';


const orderRouter = Router();


orderRouter.post("/create", authMiddleware, createOrder);
orderRouter.get("/", authMiddleware, getOrders);
orderRouter.get("/:orderId", authMiddleware, getOrderById);
orderRouter.delete("/cancel/:orderId", authMiddleware, checkRole('admin'), cancelOrder)
orderRouter.put("/update/:orderId", authMiddleware, checkRole('admin'), updateOrder)


export default orderRouter;