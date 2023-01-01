import Image from "next/image";
import { Fragment, ReactNode, use } from "react";
import { HiBadgeCheck } from "react-icons/hi";

import getCurrentUser from "../../../utils/get-current-user";
import getUserDetails from "../../../utils/get-user-details";
import BackButton from "./BackButton";

export default function Page({ params, children }: { params: { id: string }, children: ReactNode }) {
    const currentUser = use(getCurrentUser());
    const user = use(getUserDetails(params.id));

    return (
        <main className="h-full w-full flex items-center justify-between flex-col bg-gradient-to-tr from-gradient-end to-gradient-start px-4 relative">
            <header className="h-16 w-full flex items-center justify-between">
                <BackButton />
                <p className="text-xl font-bold text-black/60 mr-4">User Details</p>
                <p>{""}</p>
            </header>

            <section className="flex-1 flex flex-col justify-start items-center bg-black/10 mx-4 w-full rounded-md p-4">
                <Image src={user?.photoURL || ""} alt={user?.displayName || ""} width={96} height={96} className="rounded-md mt-12" />
                <p className="text-xl font-bold text-black/60 mt-4 flex items-center">{user?.displayName} <span>{user?.emailVerified ? <HiBadgeCheck className="text-green-600 ml-2" /> : null}</span></p>
                <p className="text-sm font-bold text-black/40">{user?.email}</p>
            </section>

            {currentUser?.uid === user?.uid ?
                <Fragment>
                    {children}
                </Fragment>
                : null
            }
        </main>
    )
};
