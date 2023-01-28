import {type ActionArgs, type LoaderArgs, redirect} from "@remix-run/node";
import {db} from "~/utils/db.server";
import {useLoaderData} from "@remix-run/react";
import EventForm from "~/components/event-form";
import {type Event} from "~/interfaces/event";
import {getUserId, requireUserId} from "~/utils/session.server";

export async function loader({params, request}: LoaderArgs){
    const userId = await requireUserId(request, '/login')
    const id = params.id
    const event = await db.event.findFirst({
        where: {
            id
        }
    }) as Event | null

    if(!event || event.userId != userId){
        redirect('/')
    }

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
    const event = useLoaderData<typeof loader>() as Event | null

    return (
        <EventForm event={event} />
    )
}