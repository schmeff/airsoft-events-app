import {db} from "~/server/db.server";

export async function saveComment(eventId: string, userId: string, content: string){
    return await db.comment.create({
        data: {
            eventId,
            userId,
            content
        }
    }) as any
}

export async function getComments(eventId: string){
    return await db.comment.findMany({
        where: {
            eventId
        },
        orderBy: {
            createdAt: 'asc'
        },
        include: {
            user: {
                select: {
                    username: true
                }
            }
        }
    }) as any
}