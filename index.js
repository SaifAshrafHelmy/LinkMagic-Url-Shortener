const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
// const helmet = require("helmet")
const yup = require("yup")
const { nanoid } = require("nanoid")
const monk = require("monk")


require("dotenv").config()

const mongoDB = monk(process.env.MONGO_URI)
const urls = mongoDB.get("urls")
urls.createIndex({ slug: 1 }, { unique: true })


const app = express();


const allowedOrigins = ['https://unpkg.com/browse/vue@3.3.4/dist/vue.global.js'];
app.use(cors());

// app.use(helmet())
// app.use( helmet({ contentSecurityPolicy: false }) );
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.static('public'))




// app.get("/url/:id", (req, res) => {
//   // TODO: get a short url by id

// })

app.get("/:slug", async (req, res, next) => {
  // TODO: redirect to url
  const { slug } = req.params;



  try {
  const record = await urls.findOne({ slug })
  if (record) {
    const url = record.url
    res.redirect(url)
  }
  else{
    res.redirect(`/?error=${slug} not found`)

  }

} catch (error) {
  // next({ "message": " Short url not found. ☁" })
  res.redirect(`/?error=Link not found`)

}

  // res.json({url})
  // console.log({slug})

})

const schema = yup.object().shape({
  slug: yup.string().trim().matches(/[\w\-]/i),
  url: yup.string().trim().url().required()
})

app.post("/url", async (req, res, next) => {
  // TODO: create a short url
  let { slug, url } = req.body;
  try {
    await schema.validate({ slug, url })
    if (!slug) {
      slug = nanoid(5)
    }
    // else{
    //   const existing = await urls.findOne({slug})
    //   if(existing){
    //     throw new Error('Slug in use. 🍔')
    //   }
    // }
    slug = slug.toLowerCase()

    const newUrl = {
      url,
      slug
    }
    const created = await urls.insert(newUrl)
    res.json(created)
    // res.json({ slug, url })
  } catch (error) {
    if (error.message.startsWith('E11000')) {
      error.message = 'Slug already in use. 🍔'
    }
    next(error)
  }

})


app.use((error, req, res, next) => {
  if (error.status) {
    res.status = error.status;
  } else {
    res.status(500)
  }
  res.json(
    {
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack
    }
  )

})


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Express app is listening on http://localhost:${port}`)
})