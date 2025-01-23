const express = require('express')
const upload = require('express-fileupload')
const cors = require('cors')
const {connect} = require('mongoose')
const userRoutes = require('./routes/userRoutes.js')
const postRoutes = require('./routes/postRoutes.js')
const {notFound,errorHandler} = require('./middleware/errorMiddleware.js')
require('dotenv').config()

const app = express()

const PORT = process.env.PORT

app.use(upload())
app.use(express.json({extended:true}))
app.use(express.urlencoded({extended:true}))
app.use(cors({credentials:true, origin:"http://localhost:5173"}))
app.use('/uploads',express.static(__dirname + '/uploads'))

app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use(notFound)
app.use(errorHandler)

connect(process.env.MONGO_URI).then(
    app.listen(PORT || 5000,()=>{
        console.log(`Server working on port ${PORT}`)
    })
).catch((error)=>{console.log(error)})

