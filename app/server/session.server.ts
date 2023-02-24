import bcrypt from 'bcryptjs';
import { db } from './db.server';
import { createCookieSessionStorage, redirect } from '@remix-run/node';
import * as process from 'process';

type LoginForm = {
  username: string;
  password: string;
};

type CreateAccountForm = {
  username: string;
  password: string;
  verifyPassword: string;
};

export async function login({ username, password }: LoginForm) {
  const user = await findUserByUsername(username);
  if (!user) return null;

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isCorrectPassword) return null;

  return { id: user.id, username };
}

export async function createAccount({
  username,
  password,
  verifyPassword,
}: CreateAccountForm) {
  const user = await findUserByUsername(username);
  if (user) {
    return null;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  return (await db.user.create({
    data: {
      username,
      passwordHash,
    },
  })) as any;
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set');
}

const storage = createCookieSessionStorage({
  cookie: {
    name: 'AE_session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set('userId', userId);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') {
    return null;
  }
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  console.log(userId);
  if (!userId || typeof userId !== 'string') {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect('/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== 'string') {
    return null;
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    });
    return user;
  } catch {
    throw logout(request);
  }
}

async function findUserByUsername(username: string) {
  return await db.user.findUnique({
    where: {
      username,
    },
  });
}
