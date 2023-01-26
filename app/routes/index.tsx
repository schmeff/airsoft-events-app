import {db} from "~/utils/db.server";
import {useLoaderData} from "@remix-run/react";
import {type Event} from "~/interfaces/event";
import EventItem from "~/components/event-item";

export async function loader(){
   const events: unknown = await db.event.findMany()
    return events
}

export default function Index() {
  const events: Event[] = useLoaderData<typeof loader>()

  return (
    <div className='grid gap-3'>
        {events.map(event => <EventItem key={event.id} event={event} />)}
    </div>
  );
}
