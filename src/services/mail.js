import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'

let productData = {
    name: "Curaprox",
    link: "http://127.0.0.1:5173",
    copyright: `Copyright © 2023 Curaprox. All rights reserved.`
};

export const template = {
    newAccount: (user, link, locales, product = productData) => {
        try {
            var mailGenerator = new Mailgen({
                theme: 'default',
                product: {
                    name: product.name,
                    link: product.link,
                    copyright: product.copyright
                }
            });
            let templateVI = mailGenerator.generate({
                body: {
                    name: user.userName,
                    intro: `Xin chào ${user.userName}, cảm ơn bạn đã đăng ký tài khoản tại Curaprox.`,
                    action: {
                        instructions: `Để xác thực tài khoản vui lòng bấm liên kết bên dưới`,
                        button: {
                            color: '#003DA6',
                            text: 'Xác thực email',
                            link
                        }
                    },
                    outro: 'Nếu bạn cần sự trợ giúp, hãy phản hồi email này.',
                    // greeting: '',
                    signature: `Trân trọng`
                }
            })
            let templateEN = mailGenerator.generate({
                body: {
                    name: user.userName,
                    intro: `Dear ${user.userName}, welcome to Curaprox!`,
                    action: {
                        instructions: `Please click the link below to verify your email address.`,
                        button: {
                            color: '#003DA6',
                            text: 'Verify email',
                            link
                        }
                    },
                    outro: 'The link is valid for 24 hours.',
                    signature: `Best regards`
                }
            })

            switch (locales) {
                case "vi":
                    return templateVI
                case "en":
                    return templateEN
                default:
                    return templateEN
            }

        } catch (err) {
            return null
        }
    }
}

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

async function sendMail(to, subject, html, from = process.env.MAIL_USERNAME) {
    try {
        var mailOptions = {
            from,
            to,
            subject,
            html
        };
        await transporter.sendMail(mailOptions);
        return true
    } catch (err) {
        return false
    }
}

export default {
    sendMail,
    template
}