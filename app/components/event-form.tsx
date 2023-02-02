import { Form } from "@remix-run/react";
import { type Event } from "~/types";

export default function EventForm({ event, actionData }: { event: Event | null, actionData: any }) {
  const startTimeString = event?.startTime.toString().split(':').slice(0, 2).join(':')
  const endTimeString = event?.endTime.toString().split(':').slice(0, 2).join(':')

  return (
    <Form method='post' action={event ? `/event-details/${event.id}/edit-event` : '/create-event'} className='flex flex-col gap-5'>
      <div className="flex flex-col">
        <label htmlFor="title" className="dark:text-gray-200">Title</label>
        <input type="text" name='title' maxLength={75} placeholder='Title' defaultValue={event?.title} className='dark:bg-gray-900 border-2 dark:border-gray-500 border-gray-500 rounded p-1 placeholder' />
        {actionData?.fieldErrors?.title && <p className='text-sm text-red-600'>{actionData?.fieldErrors?.title}</p>}
      </div>

      <div className='flex flex-col'>
        <label htmlFor="startTime" className="dark:text-gray-200">Start Date</label>
        <input type="datetime-local" name='startTime' required placeholder='Start date and time' defaultValue={startTimeString ?? ''} className='dark:bg-gray-900 border-2 dark:border-gray-500 border-gray-500 rounded p-1 placeholder' />
      </div>
      <div className="flex flex-col">
        <label htmlFor="endTime" className="dark:text-gray-200">End Date</label>
        <input type="datetime-local" name='endTime' required placeholder='End date and time' defaultValue={endTimeString ?? ''} className='dark:bg-gray-900 border-2 dark:border-gray-500 border-gray-500 rounded p-1 placeholder' />
      </div>
      <div className="flex flex-col">
        <label htmlFor="description" className="dark:text-gray-200">Details</label>
        <textarea name='description' placeholder='Details...' defaultValue={event?.description} className='dark:bg-gray-900 border-2 dark:border-gray-500 border-gray-500 rounded p-1 placeholder' />
        {actionData?.fieldErrors?.description && <p className='text-sm text-red-600'>{actionData?.fieldErrors?.description}</p>}
      </div>
      <div className="flex flex-col">
        <label htmlFor="location" className="dark:text-gray-200">Location</label>
        <input type="text" name='location' maxLength={75} placeholder='Location' defaultValue={event?.location} className='dark:bg-gray-900 border-2 dark:border-gray-500 border-gray-500 rounded p-1 placeholder' />
        {actionData?.fieldErrors?.location && <p className='text-sm text-red-600'>{actionData?.fieldErrors?.location}</p>}
      </div>
      <div className="flex flex-col">
        <label htmlFor="locationLink" className="dark:text-gray-200">Location Link</label>
        <input type="text" name='locationLink' required maxLength={75} placeholder='Location Link' defaultValue={event?.locationLink} className='dark:bg-gray-900 border-2 dark:border-gray-500 border-gray-500 rounded p-1 placeholder' />
      </div>
      <div className="flex flex-col">
        <label htmlFor="entryFee" className="dark:text-gray-200">Entry Fee</label>
        <div className='flex gap-1 place-content-center'>
          <span className='text-2xl'>$</span>
          <input required type="text" name='entryFee' inputMode='numeric' pattern='d*' placeholder='Entry Fee' defaultValue={event?.entryFee} className='grow dark:bg-gray-900 border-2 dark:border-gray-500 border-gray-500 rounded p-1 placeholder' />
        </div>
        {actionData?.fieldErrors?.entryFee && <p className='text-sm text-red-600'>{actionData?.fieldErrors?.entryFee}</p>}
      </div>
      <button type='submit' name='_action' value={event ? 'edit-event' : 'create-event'} className='py-1 px-2 dark:bg-blue-800 bg-blue-500 hover:bg-blue-700 text-white rounded-md dark:hover:bg-blue-600'>{event ? 'Update' : 'Create'}</button>
    </Form>
  )
}