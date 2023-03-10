import { type ActionArgs, redirect } from '@remix-run/node';
import { db } from '~/server/db.server';
import EventForm from '~/components/event-form';
import { requireUserId } from '~/server/session.server';
import { badRequest } from '~/server/request.server';
import { useActionData } from '@remix-run/react';

function validateTitle(title: unknown) {
  if (typeof title !== 'string' || !title.length) {
    return 'Title is required';
  }
}

function validateDescription(description: unknown) {
  if (typeof description !== 'string' || !description.length) {
    return 'Description is required';
  }
}

function validateEntryFee(entryFee: unknown) {
  if (typeof entryFee === 'string' && Number.isNaN(entryFee)) {
    return 'A valid number is required';
  }
}

function validateLocation(location: unknown) {
  if (typeof location !== 'string' || !location.length) {
    return 'A location is required';
  }
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  let { startDate, startTime, endDate, endTime, title, description, location, locationLink, entryFee, useEndTime } = Object.fromEntries(formData);


  const startTimeVal = new Date(startDate + ' ' + startTime)

  let endTimeVal = null
  if (useEndTime) {
    endTimeVal = new Date(endDate + ' ' + endTime)
  }

  if (
    typeof title !== 'string' ||
    typeof description !== 'string' ||
    typeof location !== 'string'
  ) {
    return badRequest({
      fields: null,
      fieldErrors: null,
      formError: 'Form not submitted correctly',
    });
  }

  const entryFeeVal = +entryFee

  const fields = { title, description, location, entryFeeVal };
  const fieldErrors = {
    title: validateTitle(title),
    description: validateDescription(description),
    location: validateLocation(location),
    entryFee: validateEntryFee(entryFeeVal),
  };

  if (Object.entries(fieldErrors).some(Boolean)) {
    return badRequest({
      fields,
      fieldErrors,
      formData: null,
    });
  }

  console.log(title)

  await db.event.create({
    data: {
      title,
      description,
      location,
      locationLink,
      entryFee: entryFeeVal,
      startTime: startTimeVal,
      endTime: endTimeVal,
      userId,
    } as any,
  });

  return redirect('/');
}

export default function CreateEvent() {
  const actionData = useActionData<typeof action>();

  return (
    <div className='flex flex-col'>
      <div className='text-2xl mx-auto my-5'>Create your event</div>
      <EventForm event={null} actionData={actionData} />
    </div>
  );
}
