import bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'
dotenv.config()

import prisma from '../src/utils/prisma'

// jest.mock('ioredis', () => require('ioredis-mock'))

process.env.TEST = '1'

afterAll(async () => {
    await prisma.$disconnect()
})

beforeAll(async () => {
    await prisma.$connect()
})

beforeEach(async () => {
    //Flush redis

    // Delete for postgres
    // await prisma.$queryRaw`TRUNCATE TABLE user RESTART IDENTITY CASCADE;`

    // Delete for sqlite
    await prisma.user.deleteMany({})
    await prisma.$queryRaw`DELETE FROM sqlite_sequence WHERE name='user';`

    await prisma.user.create({
        data: {
            email: 'test@email.com',
            password: bcrypt.hashSync('password', 10),
            name: 'Test User',
        },
    })
})
