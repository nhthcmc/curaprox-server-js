import orderController from "../../../controllers/order.controller";
import express from "express";
import { userMiddleware } from '../../..//middlewares'
const Router = express.Router();

Router.get("/", userMiddleware.tokenValidate, orderController.findMany)
Router.delete("/:itemId", userMiddleware.tokenValidate, orderController.deleteItem)
Router.post("/add-to-cart", userMiddleware.tokenValidate, orderController.addToCart)
Router.post("/pay/zalo-check/:zaloOrderId", userMiddleware.tokenValidate, orderController.zaloCheck)
Router.post("/pay/zalo", userMiddleware.tokenValidate, orderController.zaloCreateOrder)
Router.patch("/pay/:orderId", userMiddleware.tokenValidate, orderController.pay)
Router.patch("/", userMiddleware.tokenValidate, orderController.updateItem)
export default Router