require('dotenv').config()
const express = require('express')
const app = express()
const session = require('express-session')
const connectDb = require('./ConnectDb/Db')
const passport = require('passport')
const router = require('./Router/handle')
const port = process.env.port || 2000


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(session({
    secret:'TechCorp',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 24 * 64000}
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/', router)


app.listen(port, ()=>{
    connectDb();
     console.log(`server running on ${port}`)
})