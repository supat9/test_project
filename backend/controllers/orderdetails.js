const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createOrderDetail = async (req, res) => {
  const { order_id, product_id, quantity, unit_price } = req.body;

  try {
    const orderDetail = await prisma.orderdetails.create({
      data: {
        order_id, // order_id ที่เชื่อมโยงกับคำสั่งซื้อ
        product_id, // product_id ที่เชื่อมโยงกับสินค้า
        quantity, // จำนวนสินค้าที่สั่งซื้อ
        unit_price, // ราคาต่อหน่วยของสินค้า
      },
    });

    res.status(201).json({ orderDetail });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const orderDetails = await prisma.orderdetails.findMany();
    res.status(200).json({ orderDetails });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getOrderDetailById = async (req, res) => {
  const { id } = req.params;
  try {
    const orderDetail = await prisma.orderdetails.findUnique({
      where: {
        order_detail_id: Number(id),
      },
    });
    res.status(200).json({ orderDetail });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateOrderDetail = async (req, res) => {
  const { id } = req.params;
  const { order_id, product_id, quantity, unit_price } = req.body;
  try {
    const orderDetail = await prisma.orderdetails.update({
      where: {
        order_detail_id: Number(id),
      },
      data: {
        order_id,
        product_id,
        quantity,
        unit_price,
      },
    });
    res.status(200).json({ orderDetail });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteOrderDetail = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.orderdetails.delete({
      where: {
        order_detail_id: Number(id),
      },
    });
    res.status(204).json({});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createOrderDetail,
  getOrderDetails,
  getOrderDetailById,
  updateOrderDetail,
  deleteOrderDetail,
};
