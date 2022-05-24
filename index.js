const express = require('express')
const app = express()
const Joi = require('joi')
const helmet = require('helmet')
const morgan = require('morgan')
require('dotenv').config()

app.use(express.json())
app.use(helmet())
app.use(morgan('tiny'))

app.get('/',  (req, res, next) => {
    // console.log(req.url);
    // res.sendFile(path.join(__dirname, 'views', 'index.html'), (err) => {
    //     if (err) {
    //         console.log(err);
    //     }
    // })
    res.send('Bu asosiy sahifa')
})

app.get('/api/books', (req, res) => {
    // console.log(req.url);
    // res.write('<h1>Some books', (err) => {
    //     if (err) {
    //         console.log(err);
    //     }
    // })
    // res.end()

    // res.send(JSON.stringify(books))
    res.send(books)
})

// Get request with query
app.get('/api/books/sort', (req, res) => {
    const book = books.find((book) => req.query.name === book.name)
    // const book = books.find((book) => +req.query.id === book.id)
    if (book) {
        // Clientga chiqariladi
        res.status(200).send(book)
    } else {
        res.status(400).send('Bu ismli kitob mavjud emas...')
    }
})

// Get request with params
app.get('/api/books/:id/:polka', (req, res) => {
    // console.log(req.params.id);
    // console.log(req.params.polka);
    // Parametr aniqlanadi
    const id = +req.params.id
    // Parametrni tekshirish kerak
    // Bazadan qidiriladi parametr bo'yicha
    const book = books.find((book) => book.id === id)
    if (book) {
        // Clientga chiqariladi
        res.status(200).send(book)
    } else {
        res.status(400).send('Bu parametrli kitob mavjud emas...')
    }

})

// POST request
app.post('/api/books/add', (req, res) => {
    // Baza chaqiramiz
    let allBooks = books  // []

    console.log(req.body);

    // Validatsiya // hiyalaymiz
    let bookSchema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        year: Joi.number().integer().min(1900).max(2022).required(),
    })

    const result = bookSchema.validate(req.body)
    
    if (result.error) {
        res.status(400).send(result.error.message);
        return
    }
    // console.log(!!result.error);  // error bor bo'lsa true yo'q bo'lsa false deydi

    // Obyektni yaratamiz yangi kitobni
    let book = {
        id: books.length + 1,
        name: req.body.name,
        year: req.body.year
    }

    // bazaga qo'shamiz
    allBooks.push(book)

    // kitoblarni klientga qaytaramiz
    // res.status(201).send(allBooks)
    res.status(201).send(book)
})

// PUT request
app.put('/api/books/update/:id', (req, res) => {
    let allBooks = books
    // id orqali yangilanmoqchi bo'lgan obj ni index kalitini topamiz
    const idx = allBooks.findIndex(book => book.id === +req.params.id)
    // yangi obj ni idx joylaymiz // [idx] = {newObj}

    // Validatsiya // hiyalaymiz
    let bookSchema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        year: Joi.number().integer().min(1900).max(2022).required(),
    })

    const result = bookSchema.validate(req.body)
    
    if (result.error) {
        res.status(400).send(result.error.message);
        return
    }


    let updatedBook = {
        name: req.body.name,
        year: req.body.year,
        id: +req.params.id,
    }

    allBooks[idx] = updatedBook

    res.status(200).send(updatedBook)
})

// Delete request
app.delete('/api/books/delete/:id', (req, res) => {
    const idx = books.findIndex(book => book.id === +req.params.id)
    books.splice(idx, 1)
    res.status(200).send(books)
})

try {
    const port = process.env.PORT || 5000

    console.log(port);

    app.listen(port, () => {
        console.log('Server working on port', port);
    })

} catch (error) {
    console.error(error);
}