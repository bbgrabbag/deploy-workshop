const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
require('dotenv').config()
const { expressjwt } = require('express-jwt')
const path = require('path')

async function connectToDB(){
    try{
        await mongoose.connect(process.env.MONGOURI)
        console.log('connected to db')
        mongoose.set("debug", (collectionName, method, query, doc) => {
            console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
        });
    } catch(err){
        console.log('mongoose connection err: ', err)
    }
}

connectToDB()

app.use(express.json())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'client', 'dist')))

app.use('/api/auth', require('./routes/userRouter'))
app.use('/api/main', expressjwt({ secret: process.env.SECRET, algorithms: ['HS256'] }))
app.use('/api/main/todos', require('./routes/todoRouter'))

app.use((err, req, res, next) => {
    console.log(err)
    if (err.name === "UnauthorizedError") {
        res.status(err.status)
    }
    return res.send({ errMsg: err.message })
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.listen(process.env.PORT, () => {
    console.log('server is running on port ' + process.env.PORT)
})