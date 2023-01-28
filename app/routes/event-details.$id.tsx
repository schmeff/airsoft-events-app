import {type LoaderArgs, redirect} from "@remix-run/node";
import {db} from "~/utils/db.server";
import {Form, NavLink, useLoaderData} from "@remix-run/react";
import {isMultiDay, getDuration, getLocalTimeString} from "~/utils/dates";
import {getUserId} from "~/utils/session.server";
import {AiFillCheckCircle, AiFillStar} from 'react-icons/ai'

export async function loader({params, request}: LoaderArgs) {
    const id = params.id;
    const userId = await getUserId(request)

    const event = await db.event.findFirst({
        where: {
            id
        }
    })

    if (!event) {
        redirect('')
    }

    return {event, isOwner: event?.userId === userId}
}

export default function EventDetails() {
    const {event, isOwner} = useLoaderData<typeof loader>() as any
    const multiDay = isMultiDay(event.startTime, event.endTime)
    const duration = getDuration(event.startTime, event.endTime)

    return (
        <div>
            {isOwner && <NavLink to='edit-event' >Edit</NavLink>}
            <p className='text-3xl'>{event.title}</p>

            <p className='mt-3 dark:text-gray-300'>Date</p>
            <p>{new Date(event.startTime).toDateString()}{multiDay &&
                <span> - {new Date(event.endTime).toDateString()}</span>}</p>

            <p className='mt-3 dark:text-gray-300'>Time</p>
            <p className='mb-3'>{getLocalTimeString(event.startTime)} - {getLocalTimeString(event.endTime)} ({duration} hours)</p>

            <p className="mt-3 dark:text-gray-300">Location</p>
            {
                event.locationLink ?
                    <a href={event.locationLink} target='_blank' rel='noreferrer'
                       className='underline hover:text-blue-500'>{event.location}</a> :
                    <p>{event.location}</p>
            }

            <p className="mt-3 dark:text-gray-300">Entry Fee</p>
            <p className='mb-3'>${(+event.entryFee).toFixed(2)}</p>

            <p className='mt-3 dark:text-gray-300'>Description</p>
            <p className='mb-3'>{event.description}</p>

            <div className='flex my-3 p-2 gap-3'>
                <Form method='post'>
                    <button type='submit' className='py-2 px-3 rounded-md dark:bg-gray-700 hover:dark:bg-gray-500'>
                        Going <AiFillCheckCircle className='inline text-xl'/>
                    </button>
                </Form>
                <Form method='post'>
                    <button type='submit' className='py-2 px-3 rounded-md dark:bg-gray-700 hover:dark:bg-gray-500'>
                        Interested <AiFillStar className='inline text-xl'/>
                    </button>
                </Form>
            </div>
        </div>
    )
}
