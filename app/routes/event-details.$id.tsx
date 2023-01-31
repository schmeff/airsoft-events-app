import {type ActionArgs, type LoaderArgs, redirect} from "@remix-run/node";
import {db} from "~/server/db.server";
import {Form, NavLink, useLoaderData} from "@remix-run/react";
import {isMultiDay, getDuration, getLocalTimeString} from "~/utils/dates";
import {getUserId, requireUserId} from "~/server/session.server";
import {AiFillCheckCircle, AiFillCloseCircle, AiFillStar} from 'react-icons/ai'
import {getEvent, saveUserEvent} from "~/server/event.server";
import {UserEventStatus} from "@prisma/client";

export async function loader({params, request}: LoaderArgs) {
    const id = params.id as string;
    const userId = await getUserId(request)

    const event = await getEvent(id)

    if (!event) {
        redirect('')
    }

    return {event, isOwner: event?.userId === userId, userId}
}

export async function action({request, params}: ActionArgs){
    const eventId: string | undefined = params.id
    const userId: string | null = await requireUserId(request, `/event-details/${eventId}`)
    const formData = await request.formData()
    const {_action} = Object.fromEntries(formData)
    console.log("The action value: ", _action)

    if(typeof eventId !== 'string') throw redirect('/')

    await saveUserEvent(userId, eventId, _action as UserEventStatus)

    return null
}

export default function EventDetails() {
    const {event, isOwner, userId} = useLoaderData<typeof loader>() as any
    const multiDay = isMultiDay(event.startTime, event.endTime)
    const duration = getDuration(event.startTime, event.endTime)
    const eventStatus = event.userEvent.find((a: any) => a.userId === userId)?.status

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

            <div className='flex gap-4'>
                {/*<p>{event.attending.length} going</p>*/}
                {/*<p>{event.interested.length} interested</p>*/}
            </div>

            <div className='flex my-3 p-2 gap-3'>
                <Form method='post'>
                    <button type='submit' name='_action' value={UserEventStatus.GOING} className={`py-2 px-3 rounded-md dark:bg-gray-700 hover:dark:bg-gray-500 ${eventStatus === UserEventStatus.GOING? 'text-teal-400' : ''}`}>
                        Going <AiFillCheckCircle className='inline text-xl mb-1'/>
                    </button>
                </Form>
                <Form method='post'>
                    <button type='submit' name='_action' value={UserEventStatus.NOT_GOING} className={`py-2 px-3 rounded-md dark:bg-gray-700 hover:dark:bg-gray-500 ${eventStatus === UserEventStatus.NOT_GOING? 'text-teal-400' : ''}`}>
                        Not Going <AiFillCloseCircle className='inline text-xl mb-1'/>
                    </button>
                </Form>
                <Form method='post'>
                    <button type='submit' name='_action' value={UserEventStatus.INTERESTED} className={`py-2 px-3 rounded-md dark:bg-gray-700 hover:dark:bg-gray-500 ${eventStatus === UserEventStatus.INTERESTED? 'text-teal-400' : ''}`}>
                        Interested <AiFillStar className='inline text-xl mb-1'/>
                    </button>
                </Form>
            </div>
        </div>
    )
}
