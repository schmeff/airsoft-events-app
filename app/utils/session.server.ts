import bcrypt from 'bcryptjs'
import {db} from './db.server'

type LoginForm = {
    username: string
    password:  string
}

type CreateAccountForm = {
    username: string
    password: string
    verifyPassword: string
}

export async function login({username, password}: LoginForm){
    const user = await findUser(username)
    if(!user) return null;

    const isCorrectPassword = await bcrypt.compare(password, user.passwordHash)
    console.log('is correct password: ', isCorrectPassword)

    if(!isCorrectPassword) return null

    return { id: user.id, username }
}

export async function createAccount({username, password, verifyPassword}: CreateAccountForm){
    const user = await findUser(username)
    if(user){
        return {error: 'A user with that username already exists'}
    }

    if(password !== verifyPassword){
        return {error: 'Passwords must match'}
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await db.user.create({
        data: {
            username,
            passwordHash
        }
    })

    return {success: true}
}

async function findUser(username: string){
    return await db.user.findUnique({
        where: {
            username
        }
    })
}