import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export default {
    findMany: async () => {
        try {
            let address = await prisma.address.findMany()
            return {
                status: true,
                message: "ok",
                data: address
            }
        } catch (err) {
            return {
                status: false,
                message: "failed",
                data: null
            }
        }
    },
    create: async (newAddress) => {
        try {
            let address = await prisma.address.create({
                data: {
                    ...newAddress,
                }
            })
            return {
                status: true,
                message: "succsessful",
                data: address
            }
        } catch (err) {
            return {
                status: false,
                message: "failed",
                data: null
            }
        }

    },
    update: async (itemId, dataUpdate) => {
        try {
            await prisma.address.update({
                where: {
                    id: Number(itemId)
                },
                data: dataUpdate
            })
            return {
                status: true,
                message: "successful",
                data: address
            }
        } catch (err) {
            return {
                status: false,
                message: "failed",
                data: null
            }
        }
    },
    delete: async (itemId) => {
        try {
            await prisma.address.delete({
                where: {
                    id: Number(itemId)
                }
            })
            return {
                status: true,
                message: "successful",
                data: null
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