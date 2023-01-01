"use client";

import app from "../firebase/client-app";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, getFirestore, limit, orderBy, query, Timestamp } from "firebase/firestore";
import moment from "moment";

export default function LastMessage({ conversationId }: { conversationId: string }) {
    const [messages, messagesLoading] = useCollection(query(collection(getFirestore(app), "conversations/" + conversationId + "/messages/"), orderBy("sentAt", "desc"), limit(1)))

    if (messagesLoading) {
        return <p className="text-xs text-black/60 w-[75vw] whitespace-pre overflow-hidden overflow-ellipsis">Getting last messages</p>
    };

    return (
        <div className="flex items-center justify-between">
            <p className="text-xs text-black/60 w-[50vw] whitespace-pre overflow-hidden overflow-ellipsis">{messages?.docs[0]?.data().content}</p>
            <p className="text-xs text-black/60 w-fit">{moment(new Timestamp(messages?.docs[0]?.data().sentAt.seconds, messages?.docs[0]?.data().sentAt.nanoseconds).toDate()).fromNow()}</p>
        </div>
    )
}