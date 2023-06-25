import express from 'express'
import userSchema from '../schema/user'
import mediaSchema from '../schema/media'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { constrainedMemory } from 'process'
import mongoose, { Schema } from 'mongoose'

dotenv.config()
const SECRET_KEY = process.env.SECRET_KEY
const TEN_HOURS = 36000000

async function signUp(request: express.Request, response: express.Response): Promise<unknown> {
    //
    /* ~::~ GOAL:
            - Check for existing users
            - Make sure password is stored hashed
            - Create user
            - Generate token from email
            - Send cookie with response
    */
    //

    const { username, email, password, roles } = request.body
    try {
        const existingUser = await userSchema.find({ email: email })
        if (existingUser.length > 0) {
            return response.status(400).json({ message: 'The following email is already taken' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await userSchema.create({
            username: username,
            email: email,
            password: hashedPassword,
            roles: roles,
        })

        if (!SECRET_KEY) {
            console.error('Server initialization failed, SECRET_KEY not found')
            return
        }

        const token = jwt.sign({ email: result.email, id: result._id, roles: roles }, SECRET_KEY, {
            expiresIn: '1h',
        })
        response
            .status(201)
            .cookie('access_token', token, { expires: new Date(Date.now() + TEN_HOURS) })
            .json({ user: result, token: token })
    } catch (error) {
        console.error('error~~> ', error)
        return response.status(500).json({ message: 'Something went wrong from our end' })
    }
}

async function signIn(request: express.Request, response: express.Response): Promise<unknown> {
    //
    /* ~::~ GOAL:
            - Check if user exists
            - If exists, match user's credentials
            - If credentials match, authentication success
    */
    //

    const { username, email, password, roles } = request.body
    try {
        const existingUser = await userSchema.find({ email: email })
        if (existingUser.length === 0) {
            return response.status(404).json({ message: 'The following user does not exist' })
        }

        const passwordMatched = await bcrypt.compare(password, existingUser[0].password)
        if (!passwordMatched) {
            return response
                .status(400)
                .json({ message: 'The credentials you provided are invalid' })
        }

        if (!SECRET_KEY) {
            console.error('Server initialization failed, SECRET_KEY not found')
            return
        }

        const token = jwt.sign(
            { email: existingUser[0].email, id: existingUser[0]._id, roles: existingUser[0].roles },
            SECRET_KEY,
            { expiresIn: '1h' }
        )
        response
            .status(201)
            .cookie('access_token', token, { expires: new Date(Date.now() + TEN_HOURS) })
            .json({ user: existingUser[0], token: token })
    } catch (error) {
        console.error('error~~> ', error)
        return response.status(500).json({ message: 'Something went wrong from our end' })
    }
}

async function createEntry(request: express.Request, response: express.Response): Promise<unknown> {
    //
    /* ~::~ GOAL:
            - Use middleware to authenticate
            - Middleware must get roles from cookies and pass them to handler
            - Check if entry exists
            - Check user roles
            - Create entry if it doesn't exist and user has appropriate role
    */
    //

    console.log('request.userId~~> ', (request as any).userId)
    console.log('request.roles~~> ', (request as any).roles)

    if (!(request as any).roles.includes('admin')) {
        return response
            .status(403)
            .json({ message: 'You do not have permission to perform this operation' })
    }

    const { name, actors, director, producers, runtime } = request.body
    try {
        const existingEntry = await mediaSchema.find({ name: name })
        if (existingEntry.length > 0) {
            return response.status(400).json({ message: 'The following entry already exists' })
        }

        const result = await mediaSchema.create({
            name: name,
            actors: actors,
            director: director,
            producers: producers,
            runtime: runtime,
        })
        response.status(201).json({ media: result })
    } catch (error) {
        console.error('error~~> ', error)
        return response.status(500).json({ message: 'Something went wrong from our end' })
    }
}

async function listEntries(request: express.Request, response: express.Response): Promise<unknown> {
    //
    /* ~::~ GOAL:
            - Simply list all documents
    */
    //

    try {
        const result = await mediaSchema.find({})
        response.status(201).json({ media: result })
    } catch (error) {
        console.error('error~~> ', error)
        return response.status(500).json({ message: 'Something went wrong from our end' })
    }
}

async function getDetails(request: express.Request, response: express.Response): Promise<unknown> {
    //
    /* ~::~ GOAL:
            - Parse name from header
            - Search by name
            - Respond with details
    */
    //

    const { name } = request.body
    try {
        const result = await mediaSchema.find({
            name: name,
        })
        response.status(201).json({ media: result })
    } catch (error) {
        console.error('error~~> ', error)
        return response.status(500).json({ message: 'Something went wrong from our end' })
    }
}

export default { signUp, signIn, createEntry, listEntries, getDetails }
