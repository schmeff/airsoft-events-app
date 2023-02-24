import { type ActionArgs, type LoaderArgs, redirect } from '@remix-run/node';
import { db } from '~/server/db.server';
import { useLoaderData } from '@remix-run/react';
import EventForm from '~/components/event-form';
import { type Event } from '~/types';
import { requireUserId } from '~/server/session.server';
import { getEvent } from '~/server/event.server';

export async function loader({ params, request }: LoaderArgs) {
  const userId = await requireUserId(request, '/login');
  const id = params.id as string;
  const event = await getEvent(id);

  if (!event || event.userId != userId) {
    redirect('/');
  }

  return event;
}

export async function action({ request, params }: ActionArgs) {
  const id = params.id;
  const formData = await request.formData();
  let { startDate, startTime, endDate, endTime, title, description, location, locationLink, entryFee, useEndTime } = Object.fromEntries(formData);


  const startTimeVal = new Date(startDate + ' ' + startTime)
  let endTimeVal = null
  if (useEndTime) {
    endTimeVal = new Date(endDate + ' ' + endTime)
  }

  const entryFeeVal = +entryFee

  await db.event.update({
    data: {
      title,
      description,
      location,
      locationLink,
      entryFee: entryFeeVal,
      startTime: startTimeVal,
      endTime: endTimeVal
    } as any,
    where: {
      id,
    },
  });

  return redirect('/');
}

export default function EditEvent() {
  const event = useLoaderData<typeof loader>() as Event | null;

  return <EventForm event={event} actionData={null} />;
}
