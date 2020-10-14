const modelUser = require('../models/users')
const helpers = require('../helpers/helpers')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = {
    register: (req, res) => {
        const { name, email, password } = req.body
        const data = {
            name,
            email,
            password,
            status: '',
            username: 'newuser0118',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS_ghBCtRbSyvx18CdoOPaCgmKWZ923ypEB-g&usqp=CAU',
            createdAt: new Date(),
            updatedAt: new Date()
        }

        bcrypt.genSalt(10, function (_err, salt) {
        bcrypt.hash(data.password, salt, function (_err, hash) {
            data.password = hash
            modelUser.register(data)
            .then((result) => {
                if (result == 'Email is already exists') {
                helpers.response(res, null, result, 403, 'Forbidden')
                } else {
                helpers.response(res, null, 'Register Success', 201, null)
                }
            })
            .catch((err) => {
                console.log(err)
            })
        })
        })
    },
    login: (req, res) => {
        const { email, password } = req.body
        modelUser.login(email)
        .then((result) => {
            if (result.length < 1) return helpers.response(res, null, 'Email not found!', 401, null)
            const user = result[0]
            const hash = user.password
            bcrypt.compare(password, hash).then((resCompare) => {
            if (!resCompare) return helpers.response(res, null, 'Password wrong!', 401, null)
            const payload = {
                id: user.id,
                email: user.email
            }

            jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '3h' }, (_err, token) => {
                user.token = token
                delete user.password
                helpers.response(res, null, user, 200)
            })
            })
        })
        .catch((err) => {
            console.log(err)
        })
    },
    resetPassword: (req, res) => {
        const id = req.params.id
        const { password } = req.body
        const data = {
            password: password
        }

        bcrypt.genSalt(10, function (_err, salt) {
        bcrypt.hash(data.password, salt, function (_err, hash) {
            data.password = hash
            modelUser.resetPassword(id, data)
            .then((result) => {
                helpers.response(res, null, 'Reset Password Success', 201, null)
            })
            .catch((err) => {
                console.log(err)
            })
        })
        })
    },
    getAllUser: (req, res) => {
        let search = req.query.search

        if(search) {
            modelUser.searchUser(search)
            .then((result) => {
                // console.log(result)
                if (result != '') {
                helpers.response(res, null, result, 200, null)
                } else {
                helpers.response(res, null, 'User not found', 404, 'error')
                }
            })
            .catch((err) => {
                console.log(err)
            })
        } else {
            modelUser.getAllUser()
            .then((result) => {
                // console.log(result)
                if (result != '') {
                helpers.response(res, null, result, 200, null)
                } else {
                helpers.response(res, null, 'User not found', 404, 'error')
                }
            })
            .catch((err) => {
                console.log(err)
            })
        }
    },
    getUserById: (req, res) => {
        const id = req.params.id
        modelUser.getUserById(id)
        .then((result) => {
            console.log(result)
            if (result != '') {
            helpers.response(res, null, result, 200, null)
            } else {
            helpers.response(res, null, 'User not found', 404, 'error')
            }
        })
        .catch((err) => {
            console.log(err)
        })
    },
    updateUser: (req, res) => {
        console.log(req.file)
        const id = req.params.id
        const { name, username, phoneNumber } = req.body
    
        const data = {
          name,
          username,
          phoneNumber
        }
    
        if (req.files) {
            data.image = process.env.BASE_URL + 'uploads/' + req.file.filename
        }
    
        modelUser.updateUser(id, data)
        .then((result) => {
            const resultUsers = result
            console.log(result)
            helpers.response(res, null, resultUsers, 200, null)
        })
        .catch((err) => {
            console.log(err)
        })
    },
    updateImage: (req, res) => {
        // console.log(req.file)
        const id = req.params.id
    
        const data = {
          image: process.env.BASE_URL + 'uploads/' + req.file.filename
        }
    
        modelUser.updateImage(id, data)
        .then((result) => {
            const resultUsers = result
            console.log(result)
            helpers.response(res, null, resultUsers, 200, null)
        })
        .catch((err) => {
            console.log(err)
        })
      },
    logout: (req, res) => {
        const id = req.params.id

        modelUser.logout(id)
        .then((result) => {
            helpers.response(res, null, result, 200, null)
        })
        .catch((err) => {
            console.log(err)
        })
    }
}