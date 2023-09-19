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


/* @TODO Handle errors and entering no-slugs and repeated slugs  */

const allowedOrigins = ['https://unpkg.com/browse/vue@3.3.4/dist/vue.global.js'];
app.use(cors());

// app.use(helmet())
// app.use( helmet({ contentSecurityPolicy: false }) );
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.static('public'))


const schema = yup.object().shape({
  slug: yup.string().trim().matches(/[\w\-]/i),
  url: yup.string().trim().url().required()
})




app.get("/:slug", async (req, res, next) => {
  // TODO: redirect to url
  const { slug } = req.params;
  console.log("the below is the slug");
  console.log({slug})


  try {
  const record = await urls.findOne({ slug })
  if (record) {
    const url = record.url
    console.log({url});
    res.redirect(url)
  }
  else{
    // res.redirect(`/?error=${slug} not found`)
    res.redirect('/?error=Requested-URL-was-not-found')
    // return next({"message":`Sorry, this url was not found`})

  }

} catch (error) {
  res.redirect(`/?error=Something-went-wrong`)

}

  // res.json({url})
  // console.log({slug})

})



app.post("/url", async (req, res, next) => {
  // TODO: create a short url
  let { slug, url } = req.body;
  try {
    if (!slug) {
      slug = nanoid(5)
    }else if(slug){
      const record = await urls.findOne({ slug })
      if (record) {
        return next({ "message": " Sorry, Slug is already used. ☁" })
      }
    
    }
    slug = slug.toLowerCase()

    await schema.validate({ slug, url })


    const newUrl = {
      url,
      slug
    }
    const created = await urls.insert(newUrl)
    console.log({created})
    res.json(created)
    // res.json({ slug, url })
  } catch (error) {
    console.log("POST FAILED!!!!");
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
      message: process.env.NODE_ENV === 'production'? "Sorry, We couldn't process your request." : error.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack
    }
  )

})


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Express app is listening on http://localhost:${port}`)
})