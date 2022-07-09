const express = require('express')
const mongoose = require('mongoose')
const tinyURL = require('./models/tinyURL')
const app = express()

mongoose.connect('mongodb://localhost/tinyurl', {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const tinyURLs = await tinyURL.find()
  res.render('index', { tinyURLs: tinyURLs })
})

app.post('/tinyURLs', async (req, res) => {
  await tinyURL.create({ full: req.body.fullUrl })

  res.redirect('/')
})

app.get('/:tinyURL', async (req, res) => {
  const tinyURL = await tinyURL.findOne({ short: req.params.tinyURL })
  if (tinyURL == null) return res.sendStatus(404)

  tinyURL.clicks++
  tinyURL.save()

  res.redirect(tinyURL.full)
})

app.listen(process.env.PORT || 5000);