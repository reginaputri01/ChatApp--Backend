const nodemailer = require('nodemailer')
const modelUser = require('../models/users')
const helpers = require('../helpers/helpers')

module.exports = {
    forgotPass: (req, res) => {
        const { email } = req.body
        modelUser.login(email)
        .then((result) => {
            if (result.length < 1) return helpers.response(res, null, 'Email not found!', 401, null)

            const transporter = nodemailer.createTransport({
            service: process.env.MAILER_SERVICE_PROVIDER,
            auth: {
                user: process.env.MAILER_EMAIL_ID,
                pass: process.env.MAILER_PASSWORD
            }
            })

            const mailOptions = {
            from: process.env.MAILER_EMAIL_ID,
            to: email,
            subject: 'Reset your password',
            html: '<p>You requested for a password reset, kindly use this <a href=' + process.env.RESET_URL + '>link</a> to reset your password</p><br><p>Cheers!</p>'
            }

            transporter.sendMail(mailOptions, (err, info) => {
            if (err) throw err
                console.log('Email sent: ' + mailOptions.to + ' ' + info.response)
                helpers.response(res, null, result[0].id, 200, null, 'Check your email')
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }
}
