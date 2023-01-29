import {type Event} from "~/types/event";
import {NavLink} from "@remix-run/react";
import {getDuration, isMultiDay, getLocalTimeString} from "~/utils/dates";

export default function EventItem({event}: {event: Event}){
    const multiDay = isMultiDay(event.startTime, event.endTime)
    const duration = getDuration(event.startTime, event.endTime)

    return (<div className='border-2 rounded-md p-3 dark:border-gray-500'>
        <NavLink to={`/event-details/${event.id}`} className='text-xl'>{event.title}</NavLink>
        <p className='mt-3'>{new Date(event.startTime).toDateString()}{multiDay && <span> - {new Date(event.endTime).toDateString()}</span>}</p>
        <p className='mb-3'>{getLocalTimeString(event.startTime)} - {getLocalTimeString(event.endTime)} ({duration} hours)</p>
        <p className='overflow-ellipsis'>{event.description}</p>
        <div className='flex mt-3'>
            <NavLink to={`/event-details/${event.id}`} className='px-2 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white'>Details</NavLink>
        </div>
    </div>)
}