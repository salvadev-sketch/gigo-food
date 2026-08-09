import express from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { requestToPay, checkPaymentStatus } from "../config/momo.js";

const router = express.Router();
const DELIVERY_FEE = 1500;

// POST /api/order/place - creates an order and triggers an MTN MoMo push payment
// body: { items: [{foodId,name,price,quantity}], address: {...}, momoPhone }
router.post("/place", requireAuth, async (req, res) => {
  try {
    const { items, address, momoPhone } = req.body;
    if (!items?.length) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const amount = subtotal + DELIVERY_FEE;

    const order = await Order.create({
      userId: req.user.id,
      items,
      amount,
      deliveryFee: DELIVERY_FEE,
      address: { ...address, phone: momoPhone },
      payment: { method: "MTN MoMo", momoPhone, status: "Pending" },
    });

    try {
      const referenceId = await requestToPay({
        amount,
        phone: momoPhone,
        externalId: order._id.toString(),
      });
      order.payment.momoReferenceId = referenceId;
      await order.save();
    } catch (momoErr) {
      console.error("[momo] request-to-pay failed:", momoErr.message);
      // order stays created with payment.status "Pending" — customer can retry payment
    }

    // clear user's cart now that the order has been placed
    await User.findByIdAndUpdate(req.user.id, { cartData: {} });

    res.json({ success: true, orderId: order._id, message: "Order placed — approve the MoMo prompt on your phone" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to place order" });
  }
});

// GET /api/order/status/:orderId - poll MoMo payment status for an order
router.get("/status/:orderId", requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.payment.status === "Pending" && order.payment.momoReferenceId) {
      const status = await checkPaymentStatus(order.payment.momoReferenceId);
      if (status === "SUCCESSFUL") order.payment.status = "Successful";
      if (status === "FAILED") order.payment.status = "Failed";
      await order.save();
    }

    res.json({ success: true, paymentStatus: order.payment.status, orderStatus: order.status });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to check payment status" });
  }
});

// GET /api/order/userorders - customer's own order history
router.get("/userorders", requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

// GET /api/order/list - admin: all orders
router.get("/list", requireAuth, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

// POST /api/order/update-status - admin: body: { orderId, status }
router.post("/update-status", requireAuth, requireAdmin, async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Order status updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update order status" });
  }
});

export default router;
