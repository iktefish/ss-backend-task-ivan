import mongoose from 'mongoose'
import express from 'express'
import cookies from 'cookie-parser'
import dotenv from 'dotenv'
import controllers from './controllers/controllers'
import auth from './middleware/auth'

const app = express()

dotenv.config()

app.use(express.json())
app.use(cookies())

app.post('/sign-in', controllers.signIn)
app.post('/sign-up', controllers.signUp)
app.post('/create-entry', auth, controllers.createEntry)
app.get('/list-entries', auth, controllers.listEntries)
app.get('/get-details', auth, controllers.getDetails)

process.env.MONGODB_URI &&
    mongoose.connect(process.env.MONGODB_URI, {}).then(
        () => {
            console.log('~~ Connected to database ~~')
            app.listen(process.env.PORT!),
                () => {
                    console.log('Server loop initiated on port: ', process.env.PORT)
                }
        },
        (error: unknown) => {
            console.error(error)
        }
    )
