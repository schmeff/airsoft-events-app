import { useLoaderData } from "@remix-run/react";
import { type Event } from "~/types/event";
import EventItem from "~/components/event-item";
import {getAllEvents} from "~/server/event.server";

export async function loader() {
  return await getAllEvents()
}

export default function Index() {
  const events: Event[] = useLoaderData<typeof loader>()

  return (
    <div className='grid gap-3'>
      {events.map(event => <EventItem key={event.id} event={event} />)}
    </div>
  );
}
