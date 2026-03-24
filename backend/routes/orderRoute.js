import express from 'express';
import { Order } from '../models/orderModel.js';

const router = express.Router();

// Create a new order
router.post('/', async (request, response) => {
  try {
    if (!request.body.customerName || !request.body.items || request.body.items.length === 0) {
      return response.status(400).send({
        message: 'Send all required fields: customerName, items',
      });
    }

    // Calculate subtotals and total server-side
    const items = request.body.items.map((item) => ({
      productName: item.productName,
      quantity:    Number(item.quantity),
      unitPrice:   Number(item.unitPrice),
      subtotal:    Number(item.quantity) * Number(item.unitPrice),
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

    const newOrder = {
      customerName: request.body.customerName,
      items,
      totalAmount,
      status: request.body.status || 'Pending',
      notes:  request.body.notes || '',
    };

    const order = await Order.create(newOrder);
    return response.status(201).send(order);
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get all orders
router.get('/', async (request, response) => {
  try {
    const orders = await Order.find({});
    return response.status(200).json({ count: orders.length, orders });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get one order by id
router.get('/:id', async (request, response) => {
  try {
    const order = await Order.findById(request.params.id);
    return response.status(200).json(order);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Update an order
router.put('/:id', async (request, response) => {
  try {
    if (!request.body.customerName || !request.body.items || request.body.items.length === 0) {
      return response.status(400).send({
        message: 'Send all required fields: customerName, items',
      });
    }

    const items = request.body.items.map((item) => ({
      productName: item.productName,
      quantity:    Number(item.quantity),
      unitPrice:   Number(item.unitPrice),
      subtotal:    Number(item.quantity) * Number(item.unitPrice),
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

    const result = await Order.findByIdAndUpdate(request.params.id, {
      customerName: request.body.customerName,
      items,
      totalAmount,
      status: request.body.status,
      notes:  request.body.notes || '',
    });

    if (!result) return response.status(404).json({ message: 'Order not found' });
    return response.status(200).send({ message: 'Order updated successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Delete an order
router.delete('/:id', async (request, response) => {
  try {
    const result = await Order.findByIdAndDelete(request.params.id);
    if (!result) return response.status(404).json({ message: 'Order not found' });
    return response.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;