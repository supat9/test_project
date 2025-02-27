const express = require("express");
const rateLimit = require("express-rate-limit");

const apiLimit = rateLimit({
  windowMs: 1000 * 60 * 3, // 3 minutes
  max: 100,
  message: "You have exceeded the 100 requests in 3 minutes limit!",
});

const router = express.Router();
const userController = require("../controllers/users");
const productController = require("../controllers/products");
const orderController = require("../controllers/orders");
const orderDetailController = require("../controllers/orderdetails");


router.post("/register", apiLimit, userController.register);
router.get("/users", userController.getUsers);
router.get("/users/:id", userController.getUserById);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

router.post("/products", productController.createProduct);
router.get("/products", productController.getProducts);
router.get("/products/:id", productController.getProductById);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);

router.post("/orders", orderController.createOrder);
router.get("/orders", orderController.getOrders);
router.get("/orders/:id", orderController.getOrderById);
router.put("/orders/:id", orderController.updateOrder);
router.delete("/orders/:id", orderController.deleteOrder);

router.post("/orderdetails", orderDetailController.createOrderDetail);
router.get("/orderdetails", orderDetailController.getOrderDetails);
router.get("/orderdetails/:id", orderDetailController.getOrderDetailById);
router.put("/orderdetails/:id", orderDetailController.updateOrderDetail);
router.delete("/orderdetails/:id", orderDetailController.deleteOrderDetail);


module.exports = router;
