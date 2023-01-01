// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { parse, serialize } from 'cookie';
import auth from '../../firebase/auth';

type Data = {
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method !== "GET") {
        res.status(401).json({ message: "Unauthorized" });
    };

    const cookiesList = parse(req.headers.cookie!);

    if (!cookiesList.session) {
        res.status(500).json({ message: "error" });
    }

    const session = cookiesList.session;

    auth.verifySessionCookie(session)
        .then(decodedIdToken => {
            auth.revokeRefreshTokens(decodedIdToken.sub)
                .then(() => {
                    const options = { maxAge: -1, httpOnly: true, secure: true, path: "/" };
                    res.status(200).setHeader('Set-Cookie', serialize('session', "", options)).json({ message: "success" });
                })
                .catch(error => {
                    res.status(500).json({ message: "error" });
                });
        })
        .catch(error => {
            res.status(500).json({ message: "error" });
        })

}
