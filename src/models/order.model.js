import { PrismaClient, OrderStatus } from '@prisma/client'
const prisma = new PrismaClient()

export default {
    findMany: async (userId) => {
        try {
            let orders = await prisma.orders.findMany({
                where: {
                    userId: userId
                },
                include: {
                    detail: {
                        include: {
                            product: true
                        }
                    }
                }
            })

            return {
                status: true,
                message: "ok",
                data: orders
            }
        } catch (err) {
            return {
                status: false,
                message: "failed",
                data: null
            }
        }
    },
    addToCart: async (userId, item) => {
        try {
            let cartExisted = await prisma.orders.findMany({
                where: {
                    status: OrderStatus.shopping,
                    userId: userId
                },
                include: {
                    detail: {
                        include: {
                            product: true
                        }
                    }
                }
            })

            if (cartExisted.length != 0) {
                /* đã có giỏ hàng */
                let cart = cartExisted[0];
                let itemExsited = cart.detail.find(itemFind => itemFind.productId == item.productId)
                if (itemExsited) {
                    /* Đã tồn tại trong giỏ hàng */
                    await prisma.order_details.update({
                        where: {
                            id: itemExsited.id
                        },
                        data: {
                            ...item,
                            quantity: itemExsited.quantity += item.quantity
                        }
                    })
                } else {
                    /* Chưa tồn tại trong giỏ hàng */
                    await prisma.order_details.create({
                        data: {
                            ...item,
                            orderId: cart.id
                        }
                    })
                }
                let nowCart = await prisma.orders.findUnique({
                    where: {
                        id: cart.id
                    },
                    include: {
                        detail: {
                            include: {
                                product: true
                            }
                        }
                    }
                })

                return {
                    status: true,
                    message: "add to cart successful (old cart new item)",
                    data: nowCart
                }
            } else {
                /* chưa có giỏ hàng */
                let newCart = await prisma.orders.create({
                    data: {
                        userId,
                        createAt: String(Date.now()),
                        updateAt: String(Date.now()),
                        detail: {
                            create: [
                                item
                            ]
                        }
                    },
                    include: {
                        detail: {
                            include: {
                                product: true
                            }
                        }
                    }
                })
                return {
                    status: true,
                    message: "add to cart successfull (new cart)",
                    data: newCart
                }
            }
        } catch (err) {
            console.log("err", err)
            return {
                status: false,
                message: "failed",
                data: null
            }
        }
    },
    deleteItem: async (itemId) => {
        try {
            await prisma.order_details.delete({
                where: {
                    id: Number(itemId)
                }
            })
            return {
                status: true,
                message: "ok",
                data: null
            }
        } catch (err) {
            return {
                status: false,
                message: "failed",
                data: null
            }
        }
    },
    updateItem: async (itemId, quantity) => {
        try {
            await prisma.order_details.update({
                where: {
                    id: Number(itemId)
                },
                data: {
                    quantity
                }
            })
            return {
                status: true,
                message: "ok",
                data: null
            }
        } catch (err) {
            return {
                status: false,
                message: "failed",
                data: null
            }
        }
    },
    pay: async (orderId, data) => {
        try {
            let order = await prisma.orders.update({
                where: {
                    id: Number(orderId)
                },
                data: {
                    ...data,
                    pending: String(Date.now()),
                    updateAt: String(Date.now()),
                    status: 'pending'
                },
                include: {
                    detail: {
                        include: {
                            product: true
                        }
                    }
                }
            })
            return {
                status: true,
                message: "ok",
                data: order
            }
        } catch (err) {
            return {
                status: false,
                message: "failed",
                data: null
            }
        }
    }
}