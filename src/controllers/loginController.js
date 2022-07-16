const Login = require('../models/LoginModel')

exports.index = (req, res) => {
  if (req.session.user) return res.render('login-logado')
  return res.render('login')
}

exports.register = async (req, res) => {
  try {
    const login = new Login(req.body)
    await login.register()

    if (login.errors.length > 0) {
      req.flash('errors', login.errors)
      req.session.save(() => res.redirect('/login'))
      return
    }

    req.flash('success', 'Seu usuário foi criado com sucesso')
    req.session.save(() => res.redirect('/login'))
  } catch (e) {
    console.log(e)
    res.render('404')
  }
}

exports.enter = async (req, res) => {
  try {
    const login = new Login(req.body)
    await login.enter()

    if (login.errors.length > 0) {
      req.flash('errors', login.errors)
      req.session.save(() => res.redirect('/login'))
      return
    }

    req.flash('success', 'Você fez login com sucesso')
    req.session.user = login.user
    req.session.save(() => res.redirect('/login'))
  } catch (e) {
    console.log(e)
    res.render('404')
  }
}

exports.leave = (req, res) => {
  req.session.destroy()
  res.redirect('/')
}
