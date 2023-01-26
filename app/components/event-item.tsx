import {type Event} from "~/interfaces/event";
import {NavLink} from "@remix-run/react";

export default function EventItem({event}: {event: Event}){
    const isMultiDay = new Date(event.endTime).getDay() != new Date(event.startTime).getDay()
    const duration = (new Date(event.endTime).getTime() - new Date(event.startTime).getTime())/1000/60/60

    function getLocalTimeString(eventDate: Date){
        return new Date(eventDate).toLocaleTimeString([], {hour: 'numeric', minute: "numeric"})
    }

    return (<div className='dark:text-white border-2 rounded-md p-3 dark:border-gray-500'>
        <NavLink to={`/event-details/${event.id}`} className='text-xl'>{event.title}</NavLink>
        <p className='mt-3'>{new Date(event.startTime).toDateString()}{isMultiDay && <span> - {new Date(event.endTime).toDateString()}</span>}</p>
        <p className='mb-3'>{getLocalTimeString(event.startTime)} - {getLocalTimeString(event.endTime)} ({duration} hours)</p>
        <p className='overflow-ellipsis'>{event.description}</p>
        <div className='flex mt-3'>
            <NavLink to={`/event-details/${event.id}`} className='px-2 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-500'>Details</NavLink>
        </div>
    </div>)
}