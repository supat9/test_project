const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//insert
const createOrder = async (req, res) => {
  const { user_id, total_amount, status } = req.body;

  try {
    const order = await prisma.orders.create({
      data: {
        user_id, // user ID ที่เชื่อมโยงกับผู้ใช้
        total_amount, // จำนวนเงินทั้งหมดในคำสั่งซื้อ
        status, // สถานะของคำสั่งซื้อ เช่น "processing", "completed", หรือ "cancelled"
      },
    });

    res.status(201).json({ order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await prisma.orders.findMany();
    res.status(200).json({ orders });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//get order by id
const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await prisma.orders.findUnique({
      where: {
        order_id: Number(id),
      },
    });
    res.status(200).json({ order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//update order
const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { user_id, total_amount, status } = req.body;
  try {
    const order = await prisma.orders.update({
      where: {
        order_id: Number(id),
      },
      data: {
        user_id,
        total_amount,
        status,
      },
    });
    res.status(200).json({ order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//delete order
const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.orders.delete({
      where: {
        order_id: Number(id),
      },
    });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createOrder, getOrders, getOrderById, updateOrder, deleteOrder
};
