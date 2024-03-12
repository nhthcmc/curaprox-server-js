// import addressController from "../../../controllers/address.controller";
import express from "express";
import { userMiddleware } from '../../..//middlewares';
const Router = express.Router();

Router.get("/", userMiddleware.tokenValidate, addressController.findMany)
Router.post("/new-address", userMiddleware.tokenValidate, addressController.create)
Router.patch("/update", userMiddleware.tokenValidate, addressController.update)
Router.delete("/delete", userMiddleware.tokenValidate, addressController.delete)
export default Router