import mongoose from 'mongoose'

export interface Media {
    id: string
    name: string
    actors: string[]
    director: string
    producers: string[]
    runtime: number
}

const mediaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    actors: [
        {
            type: String,
            required: true,
        },
    ],
    director: {
        type: String,
        required: true,
    },
    producers: [
        {
            type: String,
            required: true,
        },
    ],
    runtime: {
        type: Number,
        required: true,
    },
})

export default mongoose.model('Media', mediaSchema)
