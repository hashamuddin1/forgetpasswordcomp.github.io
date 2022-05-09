const User = require("../models/users");
var nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const lodash = require('lodash')

//Post Signup
const signup = async(req, res) => {
    try {
        const { firstName, email, password } = req.body;
        User.findOne({ email }).exec((err, user) => {
            if (err) {
                return res.send(400).json({ err: "User with this email is already exists" })
            }

            let newUser = new User({ firstName, email, password });
            newUser.save((err, success) => {
                if (err) {
                    console.log('error in signup' + err)
                    return res.status(400).send(err)
                }
                res.json({
                    message: "signup successfully"
                })
                console.log(req.body)
            })
        })
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}

const forgetpassword = async(req, res) => {
    try {
        const { email } = req.body;
        User.findOne({ email }, (err, user) => {
            if (err || !user) {
                return res.status(400).json({ err: "USER WITH THIS EMAIL DOESNOT EXIST" })
            }
            const token = jwt.sign({ _id: user._id }, process.env.RESET_PASSWORD_KEY, { expiresIn: "20m" })
            console.log(token)
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'hasham.mangotech@gmail.com',
                    pass: 'mangotech_hasham147'
                }
            });
            var mailOptions = {
                from: 'hasham.mangotech@gmail.com',
                to: req.body.email,
                subject: 'Sending Email using Node.js',
                html: `<h1>Please click on given link to Reset Your Password</h1>
                <p>https:www.google.com?${token}</p>`

            };
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    return res.send("email send successfully")
                }
            })

        })
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}

const resetpassword = async(req, res) => {
    try {
        const newpassword = req.body.newPassword
        const token = req.params.token;
        const verifyuser = jwt.verify(token, process.env.RESET_PASSWORD_KEY)
        console.log(verifyuser)

        const filter1 = { _id: verifyuser._id }
        const update1 = { password: newpassword }
        const user = await User.findOneAndUpdate(filter1, update1, {
            new: true
        }).then(() => {
            console.log("Password reset successfully")
            res.send("Password reset successfully")
        }).catch((e) => {
            console.log(e)
            res.send(encodeURIComponent)
        })

    } catch (e) {
        console.log(e)
    }
}

module.exports = { signup, resetpassword, forgetpassword }