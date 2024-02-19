// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

router.get('/', function (req, res) {
  res.render('index', {
    style: 'index',
  })
})

// ================================================================
// ================================================================
router.get('/product-create', function (req, res) {
  res.render('product-create', {
    style: 'product-create',
  })
})

// ================================================================

class Product {
  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
  }

  static create = (product) => {}
}

// ================================================================

router.post('/product-create', function (req, res) {
  console.log(req.body)
  res.render('product-create', {
    style: 'product-create',
  })
})

// ================================================================
// Підключаємо роутер до бек-енду
module.exports = router
