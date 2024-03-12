import userModel from "../models/user.model";
import language from '../language'
import { mailService, jwtService, hashService } from '../services'
import path from "path";
import ejs from 'ejs';
import axios from 'axios';

export default {
    register: async function (req, res) {
        const ip = req.ip;
        const useragent = req.headers['user-agent'];
        let device = `${req.device.type}-${useragent}`
        let { status, message, data } = await userModel.register({
            ...req.body,
            password: await hashService.hashText(req.body.password)
        }, ip, device);
        if (status) {
            mailService.sendMail(data.email, 'Welcome to Curaprox', mailService.template.newAccount(
                data,
                `${process.env.HOST}/api/v1/users/confirm-email/${jwtService.createToken(data, 5 * 60 * 1000)}`,
                req.headers.locales
            ))
        }
        return res.status(status ? 200 : 500).json({
            message: language(req.headers.locales)[message]
        })
    },
    confirmEmail: async function (req, res) {
        let tokenData = jwtService.decodeToken(req.params.token);
        if (tokenData) {
            let { status, message } = await userModel.update(tokenData.id, {
                emailConfirm: true,
                updateAt: String(Date.now())
            });

            if (status) {
                mailService.sendMail(tokenData.email, 'Welcome to Curaprox', `Your email has been verified, ${tokenData.userName}.`)
            }

            return res.status(status ? 200 : 500).send(await ejs.renderFile(path.join(__dirname, "../templates/confirmEmail.ejs"), {
                link: "http://127.0.0.1:5173"
            }))
        } else {
            res.status(500).send(await ejs.renderFile(path.join(__dirname, "../templates/expiredEmail.ejs"), {
                link: "http://127.0.0.1:5173"
            }))
        }
    },
    login: async function (req, res) {
        const ip = req.ip;
        let { data } = await userModel.findUser(req.body.loginId);

        if (!data) {
            return res.status(500).json({
                message: "User not found"
            })
        }

        if (!data.emailConfirm) {
            if (req.body.loginId == data.email) {
                mailService.sendMail(data.email, 'Welcome to Curaprox', mailService.template.newAccount(
                    data,
                    `${process.env.HOST}/api/v1/users/confirm-email/${jwtService.createToken(data, 5 * 60 * 1000)}`,
                    req.headers.locales
                ))
                return res.status(500).json({
                    message: "Please login via username or verified your email!"
                })
            }
        }

        if (!(await hashService.verifyHash(req.body.password, data.password))) {
            return res.status(500).json({
                message: "Incorrect Password"
            })
        }

        let checkIp = data.user_ip_list.find(item => {
            if (!item.status) {
                return false
            }
            return item.ip == ip
        });
        if (!checkIp) {
            return res.status(500).json({
                message: "New location, please check your email to confirm this is you"
            })
        }

        if (!data.status) {
            return res.status(500).json({
                message: `Your account has been banned, please contact: ${process.env.MAIL_USERNAME}`
            })
        }

        return res.status(200).json({
            message: "Login successful!",
            token: jwtService.createToken(data, "1d")
        })
    },
    tokenDecode: async function (req, res) {
        return res.status(200).json({
            message: "successful",
            data: req.tokenData
        })
    },
    loginWithGoogle: async function (req, res) {

        try {
            let googleTokenData = await axios.post(`
                https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.GOOGLE_FB_KEY}
            `, {
                idToken: req.body.googleToken
            }).then(googleRes => googleRes.data)

            if (googleTokenData.users[0].email != req.body.user.email) {
                return res.status(500).json({
                    message: "Error 1"
                })
            }


            let { data } = await userModel.findUser(req.body.user.email)
            if (!data) {
                const ip = req.ip;
                const useragent = req.headers['user-agent'];
                let device = `${req.device.type}-${useragent}`
                let newUserRes = await userModel.register({
                    ...req.body.user,
                    emailConfirm: true,
                    password: await hashService.hashText(req.body.user.password)
                }, ip, device);
                if (newUserRes.status) {
                    return res.status(200).json({
                        message: "Login via Google account successful",
                        token: jwtService.createToken(newUserRes.data, "1d")
                    })
                } else {
                    return res.status(500).json({
                        message: "Error 3"
                    })
                }
            }

            return res.status(200).json({
                message: "Login via Google account successful",
                token: jwtService.createToken(data, "1d")
            })
        } catch (err) {
            return res.status(500).json({
                message: "Error 2"
            })
        }
    }
}