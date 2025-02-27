const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//insert
const createProduct = async (req, res) => {
  const { name, price, description,category,image_url } = req.body;
  try {
    const product = await prisma.products.create({
      data: {
        name,
        price,
        description,
        category,
        image_url,
      },
    });
    res.status(201).json({ product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get all products
const getProducts = async (req, res) => {
  try {
    const products = await prisma.products.findMany();
    res.status(200).json({ products });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get product by id
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.products.findUnique({
      where: {
        product_id: Number(id),
      },
    });
    res.status(200).json({ product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//update product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description,category,image_url } = req.body;
  try {
    const product = await prisma.products.update({
      where: {
        product_id: Number(id),
      },
      data: {
        name,
        price,
        description,
        category,
        image_url,
      },
    });
    res.status(200).json({ product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.products.delete({
      where: {
        product_id: Number(id),
      },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createProduct , getProducts, getProductById, updateProduct , deleteProduct};