import {Router} from "express";

import {createOrder, cancelOrder, getOrders, getOrderById, updateOrder} from "../controllers/order.controller.js";
import {authMiddleware} from '../middleware/auth.js';


const orderRouter = Router();


orderRouter.post("/create", authMiddleware, createOrder);
orderRouter.get("/", authMiddleware, getOrders);
orderRouter.get("/:orderId", authMiddleware, getOrderById);
orderRouter.delete("/cancel/:orderId", authMiddleware("admin"), cancelOrder)
orderRouter.put("/update/:orderId", authMiddleware("admin"), updateOrder)


export default orderRouter;