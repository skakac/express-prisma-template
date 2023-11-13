import { Request, Response } from 'express'
import Joi from 'joi'

import { HttpBadRequest, HttpNotFound } from '../utils/errors.util'
import prisma from '../utils/prisma'

export async function getUser(req: Request, res: Response, next: any) {
    try {
        const { id } = await Joi.object({
            id: Joi.number().required(),
        }).validateAsync(req.params ?? {})

        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        })

        if (!user) {
            throw new HttpNotFound('User not found')
        }

        return res.status(200).json({ data: user })
    } catch (error) {
        return next(error)
    }
}

export async function searchUsers(req: Request, res: Response, next: any) {
    try {
        const { email } = await Joi.object({
            email: Joi.string().required(),
        }).validateAsync(req.query ?? {})

        const results = await prisma.user.findMany({
            where: {
                email: {
                    contains: email,
                },
            },
        })

        return res.status(200).json({ data: results })
    } catch (error) {
        return next(error)
    }
}
