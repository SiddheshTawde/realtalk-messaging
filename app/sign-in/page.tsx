"use client";

import Image from "next/image";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { RotatingLines } from "react-loader-spinner";
import { doc, getDoc, getFirestore, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";

import SignInWithGoogle from "./btn_google_dark_normal.svg";
import app from "../../firebase/client-app";

export default function Page() {
    const router = useRouter();

    const [signInWithGoogle, authUser, loading, error] = useSignInWithGoogle(getAuth(app));

    useEffect(() => {
        if (authUser) {
            authUser.user.getIdToken()
                .then(idToken => {
                    fetch("/api/sign-in", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken }) })
                        .then(res => res.json())
                        .then(data => {

                            if (data.message === "success") {
                                const uid = authUser.user.uid;

                                getDoc(doc(getFirestore(app), "users/" + uid))
                                    .then(user => {
                                        const newUserRecord = authUser.user.toJSON();
                                        // @ts-ignore - Recieved undefined for following values
                                        newUserRecord.phoneNumber = null;
                                        // @ts-ignore - removing these keys
                                        delete newUserRecord.stsTokenManager; delete newUserRecord.providerData; delete newUserRecord.tenantId; delete newUserRecord._redirectEventId;

                                        if (user.exists()) {
                                            // @ts-ignore - Updating Last Login Date-Time
                                            newUserRecord.lastLoginAt = new Date(Date.now()).toString();
                                            updateDoc(doc(getFirestore(app), "users/" + uid), newUserRecord)
                                                .then(() => {
                                                    router.push("/");
                                                })
                                                .catch(error => console.error(error))
                                        } else {
                                            setDoc(doc(getFirestore(app), "users/" + uid), newUserRecord)
                                                .then(() => {
                                                    router.push("/");
                                                })
                                                .catch(error => console.error(error))
                                        }
                                    })



                            } else {
                                console.log(data);
                            }
                        })
                        .catch(error => console.error(error));
                })
                .catch(error => console.error(error));

        }
    }, [authUser]);

    return (
        <div className="flex-1 flex items-center justify-center">
            {loading ?
                <RotatingLines
                    strokeColor="rgb(0 0 0 / 0.7)"
                    strokeWidth="2"
                    animationDuration="1.00"
                    width="24"
                    visible={true}
                /> :
                <button onClick={() => signInWithGoogle()} className="flex items-center bg-blue-500 hover:bg-blue-600 rounded-sm shadow-sm hover:shadow-lg transition-all">
                    <Image src={SignInWithGoogle} alt="SignInWithGoogle" />
                    <p className="text-base text-white ml-2 mr-4">Sign in with Google</p>
                </button>
            }
        </div>
    )
};
