import {type ActionArgs, redirect} from "@remix-run/node";
import {db} from "~/utils/db.server";
import EventForm from "~/components/event-form";
import {requireUserId} from "~/utils/session.server";

export async function action({request}: ActionArgs){
    const userId = await requireUserId(request)
    const formData = await request.formData()
    let {_action, ...values} = Object.fromEntries(formData)

    const entryFee = +values['entryFee']
    const startTime = new Date(values['startTime'].toString())
    const endTime = new Date(values['endTime'].toString())
    await db.event.create({
        data: {
            ...values,
            entryFee,
            startTime,
            endTime,
            userId
        } as any
    })

    return redirect('/')
}

export default function CreateEvent(){
    return (
        <div className='flex flex-col'>
            <div className='text-2xl mx-auto my-5'>Create your event</div>
            <EventForm event={null}/>
        </div>
    )
}