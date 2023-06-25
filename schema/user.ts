import mongoose from 'mongoose'

export interface User {
    id: string
    username: string
    email: string
    password: string
    roles?: string[]
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: [
        {
            type: String,
        },
    ],
})

export default mongoose.model('User', userSchema)
