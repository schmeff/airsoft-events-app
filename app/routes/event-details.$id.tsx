import {type ActionArgs, type LoaderArgs, redirect} from "@remix-run/node";
import {db} from "~/server/db.server";
import {Form, NavLink, useLoaderData} from "@remix-run/react";
import {isMultiDay, getDuration, getLocalTimeString} from "~/utils/dates";
import {getUserId} from "~/server/session.server";
import {AiFillCheckCircle, AiFillStar} from 'react-icons/ai'
import {getEvent} from "~/server/event.server";

export async function loader({params, request}: LoaderArgs) {
    const id = params.id as string;
    const userId = await getUserId(request)

    const event = await getEvent(id)

    if (!event) {
        redirect('')
    }

    return {event, isOwner: event?.userId === userId}
}

export async function action({request}: ActionArgs){
   const formData = await request.formData()
    const {_action} = Object.fromEntries(formData)

    switch(_action){
        case 'going':
            //going
            break
        case 'interested':
            break
        default:
            throw new Error(`Invalid action type: ${_action}`)
    }

    return null
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
                    <button type='submit' name='_action' value='going' className='py-2 px-3 rounded-md dark:bg-gray-700 hover:dark:bg-gray-500'>
                        Going <AiFillCheckCircle className='inline text-xl mb-1'/>
                    </button>
                </Form>
                <Form method='post'>
                    <button type='submit' name='_action' value='interested' className='py-2 px-3 rounded-md dark:bg-gray-700 hover:dark:bg-gray-500'>
                        Interested <AiFillStar className='inline text-xl mb-1'/>
                    </button>
                </Form>
            </div>
        </div>
    )
}
