// Підключаємо технологію express для back-end сервера
const express = require('express')
const { emit } = require('nodemon')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  static #list = []

  static #count = 0

  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0,
  ) {
    this.id = ++Product.#count //Генеруємо уніукальний id для товару
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newProduct = new Product(...data)
    this.#list.push(newProduct)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static getRandomList = (id) => {
    // Фільтруємо товари, щоб вилучити той, з яким порівнюємо id
    const filteredList = this.#list.filter(
      (product) => product.id !== id,
    )
    // Відсортуємо за допомогою Math.random() та перемішаємо масив
    const shuffledList = filteredList.sort(
      () => Math.random() - 0.5,
    )
    // Повертаємо перші 3 елементи з перемішаного масиву
    return shuffledList.slice(0, 3)
  }
}

Product.add(
  'https://artline.ua/storage/images/products/7599/gallery/95991/1400_gallery_1658482523824661_0.webp',
  "Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/",
  'AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС',
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  29000,
  8,
)

Product.add(
  'https://click.ua/content/shop/products/105602/photos/personalnyiy-kompyuter-cobra-advanced-i11f-8-h1s2-165-a4516-800x800-2597.jpg',
  "Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel",
  'Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux',
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  22000,
  10,
)

Product.add(
  'https://artline.ua/storage/images/products/10600/gallery/133331/1400_gallery_1673523581181922_0.webp',
  "Комп'ютер ARTLINE Gaming by ASUS TUF v119 (TUFv119)",
  'Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без ОС',
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  115000,
  6,
)

Product.add(
  'https://artline.ua/storage/images/products/4255/gallery/80807/600_products_1669024552464011_0.webp',
  'Компьютер ARTLINE Overlord DRAGONv38CH',
  'AMD 6-core Ryzen 5 3600 3.6-4.2GHz / Radeon RX 6600 XT 8GB / 32GB DDR4-2666 / 480GB M.2 NVMe SSD / 1TB / be quiet! Dark Rock 4 / AMD B450 / B450M PRO-VDH MAX / QUBE EAGLE Custom / 750W 80+ Gold / No OS',
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  392000,
  14,
)

Product.add(
  'https://artline.ua/storage/images/products/14748/gallery/180612/1400_gallery_1692255799633702_0.webp',
  'Компьютер ARTLINE Overlord HYPERION Windows 11 Pro (HYPERIONv12)',
  'Powered by ASUS / Intel (8p+16e)-Core i9-13900KF 3.0-5.8GHz / GeForce RTX 4090 24GB / 64GB DDR5-6000 Gaming / 1TB NVMe Gen4 / 2TB SSD / ROG STRIX LC 360 RGB / Intel® Z790 / TUF GAMING Z790-PLUS WIFI / Asus ROG Hyperion GR701 / STRIX 1000W 80+ Gold / Wi-Fi 802.11ac|ax / Bluetooth 5.3 / Windows 11 Pro',
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  215000,
  15,
)

class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1

  static #count = 0
  static #list = []

  static #bonusAccount = new Map()

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }

  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = this.calcBonusAmount(price)

    const currentBalance = Purchase.getBonusBalance(email)

    const updateBalance = currentBalance + amount - bonusUse

    Purchase.#bonusAccount.set(email, updateBalance)
    console.log(email, updateBalance)

    return amount
  }

  constructor(data, product) {
    this.id = ++Purchase.#count

    this.firstname = data.firstname
    this.lastname = data.lastname

    this.phone = data.phone
    this.email = data.email

    this.comment = data.comment || null

    this.bonus = data.bonus || 0

    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount

    this.product = product
  }

  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)

    this.#list.push(newPurchase)

    return newPurchase
  }

  static getList = () => {
    return Purchase.#list.reverse().map((purchase) => {
      return {
        id: purchase.id,
        product: purchase.product.title,
        totalPrice: purchase.totalPrice,
        bonus: purchase.bonus,
      }
    })
  }

  static getById = (id) => {
    return Purchase.#list.find((item) => item.id === id)
  }

  static updateById = (id, data) => {
    const purchase = Purchase.getById(id)

    if (purchase) {
      if (data.firstname)
        purchase.firstname = data.firstname
      if (data.lastname) purchase.lastname = data.lastname
      if (data.phone) purchase.phone = data.phone
      if (data.email) purchase.email = data.email

      return true
    } else {
      return false
    }
  }
}

Purchase.add(
  {
    firstname: 'Іван',
    lastname: 'Іванов',
    phone: '555-55-55',
    email: 'ivan@example.com',
    totalPrice: 25100,
    productPrice: 25000,
    deliveryPrice: 100,
    amount: 2,
  },
  Product.getById(1),
)

Purchase.add(
  {
    firstname: 'Петро',
    lastname: 'Петров',
    phone: '111-11-11',
    email: 'petro@example.com',
    totalPrice: 150200,
    productPrice: 150000,
    deliveryPrice: 200,
    amount: 5,
  },
  Product.getById(2),
)

Purchase.add(
  {
    firstname: 'Семен',
    lastname: 'Семенов',
    phone: '123-45-67',
    email: 'semen@example.com',
    totalPrice: 230200,
    productPrice: 230000,
    deliveryPrice: 200,
    amount: 3,
  },
  Product.getById(2),
)

class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }

  static add = (name, factor) => {
    const newPromocode = new Promocode(name, factor)
    Promocode.#list.push(newPromocode)
    return newPromocode
  }

  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}

Promocode.add('SUMMER23', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALE25', 0.75)
// ================================================================
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-index',

    data: {
      list: Product.getList(),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

// ================================================================
router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)

  res.render('purchase-product', {
    style: 'purchase-product',

    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })
})
// ================================================================
// ================================================================
router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  if (amount < 1) {
    return res.render('product-alert', {
      style: 'product-alert',

      data: {
        message: 'Помилка!',
        info: 'Некоректна кількість товару',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  const product = Product.getById(id)

  if (product.amount < 1) {
    return res.render('product-alert', {
      style: 'product-alert',

      data: {
        message: 'Помилка!',
        info: 'Такої кількості товару немає в наявності',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  console.log(product, amount)

  //   res.render('purchase-product', {
  //     style: 'purchase-product',

  //     data: {
  //       list: Product.getRandomList(id),
  //       product: Product.getById(id),
  //     },
  //   })

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)

  res.render('purchase-create', {
    style: 'purchase-create',

    data: {
      id: product.id,

      cart: [
        {
          text: `${product.title} (${amount}шт)`,
          price: productPrice,
        },
        {
          text: 'Доставка',
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })
})
// ================================================================
router.post('/purchase-submit', function (req, res) {
  //   console.log(req.query)
  //   console.log(req.body)

  const id = Number(req.query.id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,
    bonus,
    comment,

    firstname,
    lastname,
    phone,
    email,

    promocode,
  } = req.body

  const product = Product.getById(id)

  if (!product) {
    return res.render('product-alert', {
      style: 'product-alert',

      data: {
        message: 'Помилка',
        info: 'Товар не знайдено',
        link: '/purchase-list',
      },
    })
  }

  if (product.amount < amount) {
    return res.render('product-alert', {
      style: 'product-alert',

      data: {
        message: 'Помилка',
        info: 'Товару немає в потрібній кількості',
        link: '/purchase-list',
      },
    })
  }

  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('product-alert', {
      style: 'product-alert',

      data: {
        message: 'Помилка',
        info: 'Некоректні дані',
        link: '/purchase-list',
      },
    })
  }

  if (!firstname || !lastname || !phone || !email) {
    return res.render('product-alert', {
      style: 'product-alert',

      data: {
        message: `Заповніть обов'язкові поля`,
        info: 'Некоректні дані',
        link: `/purchase-create?id=${id}`,
      },
    })
  }

  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)

    console.log(bonusAmount)

    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }

    Purchase.updateBonusBalance(email, totalPrice, bonus)

    totalPrice -= bonus
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode)

    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  if (totalPrice < 0) totalPrice = 0

  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,

      firstname,
      lastname,
      phone,
      email,

      promocode,
      comment,
    },
    product,
  )

  console.log(purchase)

  res.render('product-alert', {
    style: 'product-alert',

    data: {
      message: 'Успішне виконання дії',
      info: 'Замовлення успішно було створено',
      link: '/purchase-list',
    },
  })
})
// ================================================================

router.get('/purchase-list', function (req, res) {
  res.render('purchase-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-list',

    data: {
      list: Purchase.getList(),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// ================================================================

router.get('/purchase-info', function (req, res) {
  const id = Number(req.query.id)
  const purchase = Purchase.getById(id)

  res.render('purchase-info', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-info',

    data: {
      id: purchase.id,
      firstname: purchase.firstname,
      lastname: purchase.lastname,
      phone: purchase.phone,
      email: purchase.email,
      comment: purchase.comment,
      delivery: purchase.delivery,
      product: purchase.product.title,
      productPrice: purchase.productPrice,
      deliveryPrice: purchase.deliveryPrice,
      totalPrice: purchase.totalPrice,
      bonus: purchase.bonus,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// ================================================================

router.get('/purchase-edit', function (req, res) {
  const id = Number(req.query.id)
  const purchase = Purchase.getById(id)

  res.render('purchase-edit', {
    style: 'purchase-edit',
    data: {
      id: purchase.id,
      firstname: purchase.firstname,
      lastname: purchase.lastname,
      email: purchase.email,
      phone: purchase.phone,
    },
  })
})

// ================================================================

// ================================================================

router.post('/purchase-edit', function (req, res) {
  const id = Number(req.query.id)
  //   let { firstname, lastname, email, phone } = req.body

  const purchase = Purchase.getById(id)

  if (!purchase) {
    res.render('product-alert', {
      style: 'product-alert',

      data: {
        message: 'Помилка',
        info: 'Замовлення не знайдено',
        link: '/purchase-list',
      },
    })
  }
  res.render('purchase-edit', {
    style: 'purchase-edit',
    data: {
      id: purchase.id,
      firstname: purchase.firstname,
      lastname: purchase.lastname,
      email: purchase.email,
      phone: purchase.phone,
    },
  })
})

// ================================================================

router.post('/purchase-update', function (req, res) {
  const id = Number(req.query.id)
  let { firstname, lastname, email, phone } = req.body

  if (!firstname || !lastname || !email || !phone) {
    return res.render('product-alert', {
      style: 'product-alert',

      data: {
        message: `Заповніть обов'язкові поля`,
        info: 'Некоректні дані',
        link: `/purchase-edit?id=${id}`,
      },
    })
  } else {
    Purchase.updateById(id, {
      firstname,
      lastname,
      phone,
      email,
    })
  }

  res.render('product-alert', {
    style: 'product-alert',

    data: {
      message: 'Успішне виконання дії',
      info: 'Дані оновлено',
      link: '/purchase-list',
    },
  })
})
// ================================================================
// ================================================================
// ================================================================
// Підключаємо роутер до бек-енду
module.exports = router
