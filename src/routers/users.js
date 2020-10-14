const express = require('express')
const userController = require('../controlllers/users')
// const userForgot = require('../middlewares/forgot_password')
// const { upload } = require('../middlewares/multer')
const router = express.Router()

router
  .post('/register', userController.register)
  .post('/login', userController.login)
//   .post('/forgotpassword', userForgot.forgotPass)
//   .patch('/resetpassword/:id', userController.resetPassword)
  .patch('/update/:id', userController.updateUser)
  .patch('/uploadImg/:id', userController.updateImage)
  .get('/:id', userController.getUserById)
  .get('/', userController.getAllUser)
  .post('/logout/:id', userController.logout)

module.exports = router
