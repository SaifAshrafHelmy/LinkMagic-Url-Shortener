const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const helmet = require("helmet")
require("dotenv").config()

const app = express();

app.use(helmet())
app.use(morgan('tiny'))
app.use(cors({}))
app.use(express.json())
app.use(express.static('public'))



// app.get("/url/:id", (req, res) => {
//   // TODO: get a short url by id

// })

// app.get("/:id", (req, res) => {
//   // TODO: redirect to url
// })

// app.post("/:id", (req, res) => {
//   // TODO: create a short url
// })


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Express app is listening on http://localhost:${port}`)
})