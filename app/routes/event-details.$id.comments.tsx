import { type LoaderArgs } from '@remix-run/node';
import { getComments } from '~/server/comment.server';

export async function loader({ params }: LoaderArgs) {
  return await getComments(params.id as string);
}
