import {Cart} from "../models/Cart.model.js";
import {Order} from "../models/Order.model.js";
import {Product} from "../models/Product.model.js";


export const createOrder = async (req, res) => {
    try {
        const {cartId, shippingAddress, paymentMethod} = req.body;
        const userId = req.user._id;
        if (!cartId || !shippingAddress || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }
        // Find the cart by cartId
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found',
            });
        }
        if (cart.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to create an order for this cart',
            });
        }
        // Calculate total price from cart items
        let totalPrice = 0;
        totalPrice = cart.total_amount;
        if (totalPrice <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Total price must be greater than zero',
            });
        }
        // Create the order
        const order = new Order({
            user: userId,
            cartId: cart._id,
            shippingAddress,
            paymentMethod,
            totalPrice,
            isPaid: true,
            paidAt: new Date(),

        });
        // Save the order
        await order.save();
        for (const item of cart.items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product with id ${item.product} not found`,
                });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for product ${product.name}`,
                });
            }
            product.stock -= item.quantity;
            await product.save();
        }

        return res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: order,
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message,
        });
    }
}

export const cancelOrder = async (req, res) => {
    try {
        const {orderId} = req.params;
        const userId = req.user._id;
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: 'Order ID is required',
            })
        }
        const order = await Order.findByIdAndDelete(orderId);
        if (order) {
            return res.status(200).json({
                success: true,
                message: 'Order cancelled successfully',
                order: order,
            })
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Error cancelling order',
            error: e.message,
        })
    }
}

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();

        if (orders) {
            res.status(200).json({
                success: true,
                message: "Orders fetched successfully",
                orders: orders,

            })
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: e.message,
        })
    }
}

export const getOrderById = async (req, res) => {
    try {
        const {orderId} = req.params;
        const userId = req.user._id;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: 'Order ID is required',
            });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Authorization check - user can only view their own orders
        if (order.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to view this order',
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            order: order,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error: error.message,
        });
    }
}

export const updateOrder = async (req, res) => {
    try {
        const {orderId} = req.params;
        const userId = req.user._id;
        const {shippingAddress, paymentMethod, totalPrice, isPaid, paidAt, status} = req.body;

        // Validate orderId
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: 'Order ID is required',
            });
        }

        // Find the existing order first
        const existingOrder = await Order.findById(orderId);
        if (!existingOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Authorization check - user can only update their own orders
        if (existingOrder.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this order',
            });
        }

        // Only update allowed fields
        if (shippingAddress !== undefined) existingOrder.shippingAddress = shippingAddress;
        if (paymentMethod !== undefined) existingOrder.paymentMethod = paymentMethod;
        if (totalPrice !== undefined) existingOrder.totalPrice = totalPrice;
        if (isPaid !== undefined) existingOrder.isPaid = isPaid;
        if (paidAt !== undefined) existingOrder.paidAt = paidAt;
        if (status !== undefined) existingOrder.status = status;

        await existingOrder.save();

        return res.status(200).json({
            success: true,
            message: 'Order updated successfully',
            order: existingOrder,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating order',
            error: error.message,
        });
    }
}