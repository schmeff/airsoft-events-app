import { type ActionArgs, type LoaderArgs, redirect } from "@remix-run/node";
import { Form, NavLink, useLoaderData, useTransition } from "@remix-run/react";
import { isMultiDay, getDuration, getLocalTimeString } from "~/utils/dates";
import { getUserId, requireUserId } from "~/server/session.server";
import { AiFillCheckCircle, AiFillCloseCircle, AiFillStar } from 'react-icons/ai'
import { getEvent, saveUserEvent } from "~/server/event.server";
import { UserEventStatus } from "@prisma/client";
import { getComments, saveComment } from "~/server/comment.server";
import { type Comment } from "~/types";
import { useEffect, useRef } from "react";

export async function loader({ params, request }: LoaderArgs) {
  const id = params.id as string;
  const userId = await getUserId(request)

  const event = await getEvent(id)
  const comments = await getComments(id)

  if (!event) {
    redirect('/')
  }

  console.log(comments[0])

  return { event, isOwner: event?.userId === userId, userId, comments }
}

export async function action({ request, params }: ActionArgs) {
  const eventId: string | undefined = params.id
  const userId: string | null = await requireUserId(request, `/event-details/${eventId}`)
  const formData = await request.formData()
  const { _action, ...values } = Object.fromEntries(formData)

  if (typeof eventId !== 'string') throw redirect('/')

  switch (_action) {
    case 'setUserEventStatus':
      await saveUserEvent(userId, eventId, values['userEventStatus'] as UserEventStatus)
      break
    case 'saveComment':
      const comment = values['commentText'] as string
      if (!comment.length) {
        return null
      }
      await saveComment(eventId, userId, values['commentText'] as string)
      break
    default:
      throw new Error(`Invalid action type: ${_action}`)
  }

  return null
}

export default function EventDetails() {
  const { event, isOwner, userId, comments } = useLoaderData<typeof loader>() as any
  const multiDay = isMultiDay(event.startTime, event.endTime)
  const duration = getDuration(event.startTime, event.endTime)
  const eventStatus = event.userEvent.find((a: any) => a.userId === userId)?.status
  const goingCount = event.userEvent.filter((a: any) => a.status === UserEventStatus.GOING).length
  const interestedCount = event.userEvent.filter((a: any) => a.status === UserEventStatus.INTERESTED).length
  const transition = useTransition()
  const isPostingComment = transition.state === 'submitting' && transition.submission.formData.get('_action') === 'saveComment'

  let formRef: any = useRef()

  useEffect(() => {
    if (!isPostingComment) {
      return formRef.current?.reset()
    }
  }, [isPostingComment])

  return (
    <div>
      <div className='event-details'>
        {isOwner && <NavLink to='edit-event'>Edit</NavLink>}
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
          <p>{goingCount} going</p>
          <p>{interestedCount} interested</p>
        </div>

        <div className='flex my-3 p-2 gap-3'>
          <Form method='post'>
            <input type="hidden" name='userEventStatus' value={UserEventStatus.GOING} />
            <button type='submit' name='_action' value='setUserEventStatus'
              className={`py-2 px-3 rounded-md dark:bg-gray-700 hover:dark:bg-gray-500 bg-gray-200 hover:bg-gray-300 ${eventStatus === UserEventStatus.GOING ? 'text-teal-400 text-teal-600' : ''}`}>
              Going <AiFillCheckCircle className='inline text-xl mb-1' />
            </button>
          </Form>
          <Form method='post'>
            <input type="hidden" name='userEventStatus' value={UserEventStatus.NOT_GOING} />
            <button type='submit' name='_action' value='setUserEventStatus'
              className={`py-2 px-3 rounded-md dark:bg-gray-700 hover:dark:bg-gray-500 bg-gray-200 hover:bg-gray-300 ${eventStatus === UserEventStatus.NOT_GOING ? 'text-teal-400 text-teal-600' : ''}`}>
              Not Going <AiFillCloseCircle className='inline text-xl mb-1' />
            </button>
          </Form>
          <Form method='post'>
            <input type="hidden" name='userEventStatus' value={UserEventStatus.INTERESTED} />
            <button type='submit' name='_action' value='setUserEventStatus'
              className={`py-2 px-3 rounded-md dark:bg-gray-700 hover:dark:bg-gray-500 bg-gray-200 hover:bg-gray-300 ${eventStatus === UserEventStatus.INTERESTED ? 'dark:text-teal-400 text-teal-600' : ''}`}>
              Interested <AiFillStar className='inline text-xl mb-1' />
            </button>
          </Form>
        </div>
      </div>
      <hr />
      <div className='event-comments mt-4'>
        <p className='text-xl'>Comments</p>
        <Form method='post' className='flex gap-2 my-3' ref={formRef}>
          <textarea name='commentText' rows={1} className='grow rounded-md dark:bg-gray-700 p-1 bg-gray-200' placeholder='Leave a comment...' />
          <button type='submit' name='_action' value='saveComment'
            className='py-1 px-2 dark:bg-blue-800 bg-blue-500 hover:bg-blue-700 text-white rounded-md dark:hover:bg-blue-600 max-h-10'>Post
          </button>
        </Form>
        <div className='flex flex-col gap-2'>
          {
            comments.map((comment: Comment) => <div key={comment.id}
              className='dark:bg-gray-800 rounded-md p-2 border-2 border-teal-800'>
              <div className='flex justify-between dark:text-gray-300 mb-2'>
                <p>{comment.user.username}</p>
                <p>{`${new Date(event.createdAt).toDateString()} ${getLocalTimeString(comment.createdAt)}`}</p>
              </div>
              {comment.content}
            </div>)
          } </div>
      </div>
    </div>
  )
}
