import {Form} from "@remix-run/react";
import {type Event} from "~/interfaces/event";

export default function EventForm({event}: {event: Event | null}){
    console.log(event?.startTime.toString().split(':')[0])

    const startTimeString = event?.startTime.toString().split(':').slice(0, 2).join(':')
    const endTimeString = event?.endTime.toString().split(':').slice(0,2).join(':')
    console.log(startTimeString)

    return (
        <Form method='post' action={event? `/event-details/${event.id}/edit-event` : 'create-event'} className='flex flex-col gap-5'>
            <input type="text" name='title' required maxLength={75} placeholder='Title' defaultValue={event?.title} className='dark:bg-gray-900 border-2 dark:text-white dark:border-gray-500 border-gray-500 rounded p-1 placeholder'/>
            <input type="datetime-local" name='startTime' required placeholder='Start date and time' defaultValue={startTimeString?? ''} className='dark:bg-gray-900 border-2 dark:text-white dark:border-gray-500 border-gray-500 rounded p-1 placeholder'/>
            <input type="datetime-local" name='endTime' required placeholder='End date and time' defaultValue={endTimeString?? ''} className='dark:bg-gray-900 border-2 dark:text-white dark:border-gray-500 border-gray-500 rounded p-1 placeholder'/>
            <textarea required name='description' placeholder='Description...' defaultValue={event?.description} className='dark:bg-gray-900 border-2 dark:text-white dark:border-gray-500 border-gray-500 rounded p-1 placeholder'/>
            <input type="text" name='location' required maxLength={75} placeholder='Location' defaultValue={event?.location} className='dark:bg-gray-900 border-2 dark:text-white dark:border-gray-500 border-gray-500 rounded p-1 placeholder'/>
            <input type="text" name='locationLink' required maxLength={75} placeholder='Location Link' defaultValue={event?.locationLink} className='dark:bg-gray-900 border-2 dark:text-white dark:border-gray-500 border-gray-500 rounded p-1 placeholder'/>
            <div className='flex gap-1 place-content-center'>
                <span className='dark:text-white text-2xl'>$</span>
                <input type="text" name='entryFee' inputMode='numeric' pattern='[0-9]*' placeholder='Entry Fee' defaultValue={event?.entryFee} className='grow dark:bg-gray-900 border-2 dark:text-white dark:border-gray-500 border-gray-500 rounded p-1 placeholder'/>
            </div>
            <button type='submit' name='_action' value={event? 'edit-event' : 'create-event'} className='py-1 px-2 dark:bg-blue-800 bg-blue-500 hover:bg-blue-700 text-white rounded-md dark:hover:bg-blue-600'>{event? 'Update' : 'Create'}</button>
        </Form>
    )
}