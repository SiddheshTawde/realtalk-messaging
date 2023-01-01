import { cookies } from "next/headers"

import auth from "../firebase/auth";

export default async function getCurrentUser() {
    const cookiesList = cookies();

    if (!cookiesList.has("session")) {
        return null;
    }

    const session = cookiesList.get("session");

    try {
        const decodedIdToken = await auth.verifySessionCookie(session!.value);
        const user = await auth.getUser(decodedIdToken.uid);
        return user;
    } catch (error) {
        return null;
    }
};