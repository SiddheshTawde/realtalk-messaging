// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie';
import auth from '../../firebase/auth';
import getCurrentUser from '../../utils/get-current-user';

type Data = {
  message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    res.status(401).json({ message: "Unauthorized" });
  };

  const idToken = req.body.idToken;

  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  // Create the session cookie. This will also verify the ID token in the process.
  // The session cookie will have the same claims as the ID token.
  // To only allow session cookie setting on recent sign-in, auth_time in ID token
  // can be checked to ensure user was recently signed in before creating a session cookie.

  try {
    const sessionCookie = await auth.createSessionCookie(idToken, {  expiresIn });

    const options = { maxAge: expiresIn, httpOnly: true, secure: true, path: "/" };
    res.status(200).setHeader('Set-Cookie', serialize('session', sessionCookie, options)).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: "error" });
  };
}
