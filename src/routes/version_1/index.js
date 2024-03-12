import express from "express";
const Router = express.Router();

import userApi from './apis/user.api'
import productApi from './apis/product.api'
import categoryApi from './apis/category.api'
import orderApi from './apis/order.api'
// import addressApi from './apis/address.api'

Router.use("/users", userApi)
Router.use("/products", productApi)
Router.use("/categories", categoryApi)
Router.use("/orders", orderApi)
// Router.use("/address", addressApi)

export default Router;