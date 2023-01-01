"use client";

import { useState } from "react";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, doc, getFirestore, setDoc, Timestamp } from "firebase/firestore";
import { useCollection, useDocumentData, useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { HiArrowSmLeft } from "react-icons/hi";
import { MdSend } from "react-icons/md";

import app from "../../../firebase/client-app";
import moment from "moment";

export default function Page({ params }: { params: { id: string } }) {
    const router = useRouter();
    const firestore = getFirestore(app);

    const [content, updateContent] = useState("");

    const [currentUser, currentUserLoading] = useAuthState(getAuth(app));
    const [conversation, conversationLoading] = useDocumentDataOnce(doc(firestore, "conversations/" + params.id));
    const [messages, messagesLoading] = useCollection(collection(firestore, "conversations/" + params.id + "/messages/"));
    const [user, userLoading] = useDocumentData(doc(firestore, "users/" + Object.keys(conversation?.participants || {}).filter((participant: string) => participant !== currentUser?.uid)[0]));

    if (currentUserLoading || messagesLoading || conversationLoading || userLoading) {
        return (
            <div>Loading...</div>
        )
    };

    const sendMessage = () => {
        const messageDoc = {
            media: "",
            content: content,
            sentAt: Timestamp.fromMillis(Date.now()),
            userId: currentUser?.uid,
        };

        if (content.length > 0) {
            setDoc(doc(firestore, "conversations/" + params.id + "/messages", Date.now().toString()), messageDoc)
                .then(() => {
                    updateContent("")
                })
                .catch(error => {
                    console.error(error);
                })
        };
    }

    return (
        <main className="h-full w-full flex items-center justify-center flex-col bg-gradient-to-tr from-gradient-end to-gradient-start px-4">
            <header className="h-16 w-full flex items-center justify-start">
                <button onClick={() => router.back()} className="h-6 w-6 flex items-center justify-center text-black/60">
                    <HiArrowSmLeft />
                </button>
                <p className="text-xl font-bold text-black/60 ml-2">{user?.displayName}</p>
            </header>

            <section className="flex-1 bg-black/10 mb-4 mx-4 w-full rounded-md p-4">
                <ul className="flex flex-col items-center justify-end h-[calc(100vh-192px)] overflow-y-auto">
                    {messages?.docs.map(message =>
                        message.data().userId === currentUser?.uid ?
                            <li key={message.id} className="w-full flex justify-end my-2">
                                <div className="w-3/4 p-2 flex flex-col items-end rounded-md">
                                    <p className="text-base whitespace-pre">{message.data().content}</p>
                                    <p className="text-xs">You - {moment(new Timestamp(message.data().sentAt.seconds, message.data().sentAt.nanoseconds).toDate()).fromNow()}</p>
                                </div>
                            </li>
                            : <li key={message.id} className="w-full flex items-center my-2 relative">
                                <button onClick={() => router.push("/user/" + message.data().userId)} className="absolute bottom-[-4px] left-1">
                                    <img src={user?.photoURL} alt={user?.displayName} width={18} height={18} referrerPolicy="no-referrer" className="rounded-full" />
                                </button>
                                <div className="ml-2 px-4 py-2 w-3/4 flex flex-col items-start rounded-md">
                                    <p className="text-base whitespace-pre">{message.data().content}</p>
                                    <p className="text-xs">{moment(new Timestamp(message.data().sentAt.seconds, message.data().sentAt.nanoseconds).toDate(), "").fromNow()}</p>
                                </div>
                            </li>
                    )}
                </ul>
            </section>

            <footer className="w-full h-16 mb-4">
                <div className="h-full w-full flex items-center justify-center">
                    <textarea
                        value={content}
                        onChange={event => updateContent(event.target.value)}
                        placeholder="Say Hi"
                        className="flex-1 text-sm h-full bg-black/10 placeholder:text-black/30 rounded-md p-2 outline-none resize-none"
                    />

                    <button disabled={content.length === 0} onClick={sendMessage} className="h-12 w-12 ml-2 flex items-center justify-center text-black/60 hover:text-black/80 disabled:text-black/20 transition-colors">
                        <MdSend />
                    </button>
                </div>
            </footer>
        </main>
    )
};
