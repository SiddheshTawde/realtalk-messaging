import { use } from 'react';
import Link from "next/link";
import Image from "next/image";
import { redirect } from 'next/navigation';
import getCurrentUser from '../utils/get-current-user'
import firestore from '../firebase/firestore';
import { QueryDocumentSnapshot, DocumentData } from 'firebase-admin/firestore';
import getUserDetails from '../utils/get-user-details';
import { UserRecord } from 'firebase-admin/auth';
import LastMessage from './LastMessage';

export default function Page() {
    const currentUser = use(getCurrentUser());

    if (currentUser === null) {
        redirect("/sign-in")
    };

    const conversations = use(firestore.collection("conversations").where("participants." + currentUser.uid, "==", true).get()).docs;

    return (
        <main className="h-full w-full flex items-center justify-center flex-col bg-gradient-to-tr from-gradient-end to-gradient-start px-4">
            <header className="h-16 w-full flex items-center justify-between">
                <p className="text-xl font-bold text-black/60">RealTalk</p>
                <Link href={"/user/" + currentUser?.uid}>
                    <Image src={currentUser?.photoURL || ""} alt={currentUser?.displayName || ""} height={40} width={40} className="rounded-md" />
                </Link>
            </header>


            <section className="flex-1 bg-black/10 mb-4 mx-4 w-full rounded-md p-4">
                <ul>
                    {conversations.map(conversation =>
                        <ConversationItem key={conversation.id} conversation={conversation} currentUser={currentUser!} />
                    )}
                </ul>
            </section>
        </main>
    )
}

function ConversationItem({ conversation, currentUser }: { conversation: QueryDocumentSnapshot<DocumentData>, currentUser: UserRecord }) {
    const userId = Object.keys(conversation.data().participants).filter(participant => participant !== currentUser.uid)[0]
    const user = use(getUserDetails(userId));

    if (!user) {
        return null;
    }

    return (
        <Link href={"/conversation/" + conversation.id}>
            <li className="w-full flex items-center py-2 rounded-md bg-transparent hover:bg-black/5 transition-colors">
                <Image src={user?.photoURL || ""} alt={user?.displayName || ""} height={40} width={40} className="rounded-md" />
                <div className="w-full ml-2">
                    <p className="text-base font-bold text-black/60">{user?.displayName}</p>
                    <LastMessage conversationId={conversation.id} />
                </div>
            </li>
        </Link>
    )
}