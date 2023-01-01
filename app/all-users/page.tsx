import { use } from "react";
import { redirect } from "next/navigation";

import BackButton from "./BackButton";
import firestore from "../../firebase/firestore"
import getCurrentUser from "../../utils/get-current-user";
import UserItem from "./UserItem";

export default function AllUsersLayout() {
    const currentUser = use(getCurrentUser());

    if (currentUser === null) {
        redirect("/sign-in");
    }

    const users = use(firestore.collection("users").get()).docs;

    return (
        <main className="h-full w-full flex items-center justify-between flex-col bg-gradient-to-tr from-gradient-end to-gradient-start px-4 relative">
            <header className="h-16 w-full flex items-center justify-between">
                <BackButton />
                <p className="text-xl font-bold text-black/60 mr-4">All Users</p>
                <p>{""}</p>
            </header>

            <section className="flex-1 flex flex-col justify-start items-center bg-black/10 mx-4 w-full rounded-md p-4">
                <ul className="w-full">
                    {users.map(user =>
                        user.id !== currentUser.uid ?
                            <UserItem key={user.id} user={user.data()} userId={user.id} currentUserId={currentUser!.uid} />
                            : null
                    )}
                </ul>
            </section>
        </main >
    )
}
``