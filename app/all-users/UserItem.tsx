"use client";

import { FC } from "react";
import Image from "next/image";
import { getDocs, collection, DocumentData, getFirestore, query, where, setDoc, doc, addDoc } from "firebase/firestore";
import { HiBadgeCheck } from "react-icons/hi";
import { UserRecord } from "firebase-admin/auth";
import app from "../../firebase/client-app";
import { useRouter } from "next/navigation";

const UserItem: FC<{ user: DocumentData, userId: string, currentUserId: string }> = ({ user, userId, currentUserId }) => {
    const router = useRouter();

    const handleOnClick = () => {
        getDocs(query(collection(getFirestore(app), "conversations"), where("participants." + currentUserId, "==", true), where("participants." + userId, "==", true)))
            .then(snapshot => {
                if (snapshot.empty) {
                    // Create new conversation and redirect
                    const participants: Record<string, any> = {};
                    participants[currentUserId] = true;
                    participants[userId] = true;

                    const conversationPayload = {
                        isGroup: false,
                        displayName: "",
                        photoURL: "",
                        participants: participants
                    }

                    addDoc(collection(getFirestore(app), "conversations"), conversationPayload)
                        .then(docRef => router.push("/conversation/" + docRef.id))
                        .catch(error => console.error(error));
                }

                snapshot.docs.forEach(doc => {
                    router.push("/conversation/" + doc.id);
                });
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <button className="w-full flex items-center py-2 rounded-md bg-transparent hover:bg-black/5 transition-colors" onClick={handleOnClick}>
            <Image src={user?.photoURL || ""} alt={user?.displayName || ""} width={40} height={40} className="rounded-md" />
            <div className="ml-2">
                <p className="text-xl font-bold text-black/60 flex items-center">{user?.displayName} <span>{user?.emailVerified ? <HiBadgeCheck className="text-green-600 ml-2" /> : null}</span></p>
                <p className="text-sm font-bold text-black/40">{user?.email}</p>
            </div>
        </button>
    )
};

export default UserItem;