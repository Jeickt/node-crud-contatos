const express = require('express')
const route = express.Router()
const homeController = require('./src/controllers/homeController')
const loginController = require('./src/controllers/loginController')
const contactController = require('./src/controllers/contactController')

const { loginRequired } = require('./src/middlewares/middleware')

// Rotas da home
route.get('/', homeController.index)

// Rotas de login
route.get('/login', loginController.index)
route.post('/login/register', loginController.register)
route.post('/login/enter', loginController.enter)
route.get('/login/leave', loginController.leave)

// Rotas de contato
route.get('/contact', loginRequired, contactController.index)
route.post('/contact/register', loginRequired, contactController.register)
route.get('/contact/:id', loginRequired, contactController.editIndex)
route.post('/contact/edit/:id', loginRequired, contactController.edit)
route.get('/contact/delete/:id', loginRequired, contactController.delete)

module.exports = route
