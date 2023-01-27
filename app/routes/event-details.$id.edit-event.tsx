import {type ActionArgs, type LoaderArgs, redirect} from "@remix-run/node";
import {db} from "~/utils/db.server";
import {useLoaderData} from "@remix-run/react";
import EventForm from "~/components/event-form";
import {type Event} from "~/interfaces/event";

export async function loader({params}: LoaderArgs){
    const id = params.id
    const event: unknown = db.event.findFirst({
        where: {
            id
        }
    })

    return event;
}

export async function action({request, params}: ActionArgs){
    const id = params.id
    const formData = await request.formData()
    let {_action, ...values} = Object.fromEntries(formData)

    const entryFee = +values['entryFee']
    const startTime = new Date(values['startTime'].toString())
    const endTime = new Date(values['endTime'].toString())
    await db.event.update({
        data: {
            ...values,
            entryFee,
            startTime,
            endTime
        },
        where: {
            id
        }
    })

    return redirect('/')
}

export default function EditEvent(){
    const event: Event = useLoaderData<typeof loader>()

    return (
        <EventForm event={event} />
    )
}