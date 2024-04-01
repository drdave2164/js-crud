// Підключаємо технологію express для back-end сервера
const express = require('express')
const { emit } = require('nodemon')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
// ================================================================

class Product {
  static #list = [
    {
      id: 1357924680,
      name: 'Стильна сукня',
      price: '1500',
      description:
        'Елегантна сукня з натуральної тканини для особливих випадків',
      createDate: 'Mon, 19 Feb 2024 17:15:38 GMT',
    },
    {
      id: 9876543210,
      name: 'Спортивні кросівки',
      price: '1200',
      description:
        'Зручні та стильні кросівки для активного способу життя',
      createDate: 'Mon, 19 Feb 2024 17:16:40 GMT',
    },
    {
      id: 2468135790,
      name: 'Сонячні окуляри',
      price: '800',
      description:
        'Модні окуляри з високоякісними лінзами для захисту очей від сонця',
      createDate: 'Mon, 19 Feb 2024 17:18:12 GMT',
    },
    {
      id: 8024679135,
      name: 'Чоловічий годинник',
      price: '2500',
      description:
        'Елегантний годинник з механічним механізмом і сталевим браслетом',
      createDate: 'Mon, 19 Feb 2024 17:19:43 GMT',
    },
    {
      id: 3192850467,
      name: 'Жіночий рюкзак',
      price: '900',
      description:
        'Стильний рюкзак з великим відділенням та кишенями',
      createDate: 'Mon, 19 Feb 2024 17:21:27 GMT',
    },
    {
      id: 3192850467,
      name: 'Парасолька',
      price: '350',
      description:
        'Компактна парасолька з автоматичним механізмом',
      createDate: 'Mon, 19 Feb 2024 17:23:04 GMT',
    },
  ]

  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.id = Math.floor(Math.random() * 10000000000)
    this.createDate = new Date().toUTCString()
  }

  static getList = () => {
    return this.#list
  }

  static add = (product) => {
    if (product) {
      this.#list.push(product)
      return true
    }
    return false
  }

  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (
    id,
    { name, price, description, createDate },
  ) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      if (name) {
        this.#list[index].name = name
      }
      if (price) {
        this.#list[index].price = price
      }
      if (description) {
        this.#list[index].description = description
      }
      if (createDate) {
        this.#list[index].createDate = createDate
      }
      return true
    } else {
      return false
    }
  }
}
// ================================================================
// ================================================================
//                           Product
// ================================================================
// ================================================================

router.get('/product-create', function (req, res) {
  res.render('product-create', {
    style: 'product-create',
  })
})

// ================================================================

// ================================================================

router.post('/product-create', function (req, res) {
  const { name, price, description, createDate } = req.body

  const product = new Product(
    name,
    price,
    description,
    createDate,
  )

  let result = false
  result = Product.add(product)

  res.render('alert', {
    style: 'alert',
    title: result
      ? 'Успішне виконання дії'
      : 'Сталася помилка',
    info: result
      ? 'Створено новий товар'
      : 'Товар не створено',
    link: '/product-list',
  })
})

// ================================================================

// ================================================================
router.get('/product-list', function (req, res) {
  const list = Product.getList()

  res.render('product-list', {
    style: 'product-list',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

// ================================================================

// ================================================================
router.get('/product-edit', function (req, res) {
  const { id } = req.query

  const product = Product.getById(Number(id))

  if (product) {
    res.render('product-edit', {
      style: 'product-edit',
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      createDate: product.createDate,
    })
  } else {
    res.render('alert', {
      style: 'alert',
      title: 'Сталася помилка',
      info: 'Товар з таким ID не знайдено',
      link: '/product-list',
    })
  }
})

// ================================================================

// ================================================================

router.post('/product-edit', function (req, res) {
  const { name, price, description, createDate, id } =
    req.body

  const result = Product.updateById(Number(id), {
    name,
    price,
    description,
    createDate,
  })

  //   console.log(result)

  res.render('alert', {
    style: 'alert',
    title: result
      ? 'Успішне виконання дії'
      : 'Сталася помилка',
    info: result ? 'Дані оновлено' : 'Товар не знайдено',
    link: '/product-list',
  })
})

// ================================================================

// ================================================================
router.get('/product-delete', function (req, res) {
  const { id } = req.query

  let productDel = false

  productDel = Product.deleteById(Number(id))

  //   console.log(productDel)

  res.render('alert', {
    style: 'alert',
    title: productDel
      ? 'Успішне виконання дії'
      : 'Сталася помилка',
    info: productDel
      ? 'Товар видалено'
      : 'Товар не знайдено',
    link: '/product-list',
  })
})

// ================================================================
// ================================================================
// Підключаємо роутер до бек-енду
module.exports = router
