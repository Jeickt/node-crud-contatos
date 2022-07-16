const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
})

const LoginModel = mongoose.model('Login', LoginSchema)

class Login {
  constructor(body) {
    this.body = body
    this.errors = []
    this.user = null
  }

  async enter() {
    this.valida()
    const user = await this.userExists()
    this.bcryptValidate(user.password)
    if (this.errors.length > 0) return
    this.user = user
  }

  async userExists() {
    const user = await LoginModel.findOne({ email: this.body.email })
    if (!user) this.errors.push('Usuário ou senha inválidos')
    return user
  }

  bcryptValidate(password) {
    if (!bcryptjs.compareSync(this.body.password, password))
      this.errors.push('Usuário ou senha inválidos')
  }

  async register() {
    this.valida()
    await this.userNotExists()
    if (this.errors.length > 0) return

    const salt = bcryptjs.genSaltSync()
    this.body.password = bcryptjs.hashSync(this.body.password, salt)

    this.user = await LoginModel.create(this.body)
  }

  async userNotExists() {
    const user = await LoginModel.findOne({ email: this.body.email })
    if (user) this.errors.push('Usuário já existe')
  }

  valida() {
    this.cleanUp()
    if (!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido')
    if (this.body.password.length < 8 || this.body.password.length > 24)
      this.errors.push('A senha precisa ter entre 8 e 24 caracteres')
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = ''
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.senha,
    }
  }
}

module.exports = Login
