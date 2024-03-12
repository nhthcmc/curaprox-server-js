import { UserRole } from "@prisma/client";

export default [
    {
        userName: "admin",
        email: "nht.hcmc@gmail.com",
        emailConfirm: true,
        password: "$2b$10$FTox.5KppLk6E1n72k92guLfRKIX9GPo5VS8W61iSo/1XdtUxjIgW",
        role: UserRole.admin,
        avatar: "",
        createAt: String(Date.now()),
        updateAt: String(Date.now()),
    }
]