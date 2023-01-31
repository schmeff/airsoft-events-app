import {db} from "~/server/db.server";
import {type Event} from "~/types";
import {type UserEventStatus} from ".prisma/client";

export async function getEvent(id: string){
    return await db.event.findUnique({
        where: {
            id
        },
        include: {
            userEvent: true,
        }
    }) as Event | null
}

export async function getAllEvents(){
    return await db.event.findMany() as any
}

export async function saveUserEvent(userId: string, eventId: string, eventStatus: UserEventStatus){
    const userEvent = await db.userEvent.findFirst({
        where: {
            userId,
            eventId
        }
    })

    console.log(userEvent)
    if(!userEvent){
        return await db.userEvent.create({
            data: {
                userId,
                eventId,
                status: eventStatus
            }
        }) as any
    }

    if(userEvent.status === eventStatus){
        return await db.userEvent.delete({
            where: { id: userEvent.id }
        }) as any
    }

    return await db.userEvent.update({
        where: {
            id: userEvent.id,
        },
        data: {
            status: eventStatus
        }
    }) as any
}