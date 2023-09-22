const express = require("express")
const app = express()
const port = 3000
const route = require('./route')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')

app.set("views", path.join(__dirname, '/views'))
app.set("view engine", "ejs")
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(route)
app.listen(port, ()=>{
    console.log(`Example app listening on port http://localhost:${port}`)
})