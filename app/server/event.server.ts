import {db} from "~/server/db.server";
import {type Event} from "~/types/event";

export async function getEvent(id: string){
    return await db.event.findUnique({
        where: {
            id
        }
    }) as Event | null
}

export async function getAllEvents(){
    return await db.event.findMany() as any
}