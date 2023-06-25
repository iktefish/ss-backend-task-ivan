import express from 'express'
import userSchema from '../schema/user'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const SECRET_KEY = process.env.SECRET_KEY!

function authenticate(
    request: express.Request | any,
    response: express.Response,
    next: () => void
): unknown {
    const token = request.cookies.access_token

    if (!token) {
        return response.status(401).json({ message: 'A token is required for authentication' })
    }

    try {
        const data: any = jwt.verify(token, SECRET_KEY)
        request.userId = data.id
        request.roles = data.roles
    } catch (error) {
        console.error('error~~> ', error)
        return response.status(403).json({ message: 'Invalid token' })
    }

    return next()
}

export default authenticate
