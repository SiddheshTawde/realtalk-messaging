"use client";

import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useSignOut } from "react-firebase-hooks/auth";
import app from "../../../firebase/client-app";

export default function Page() {
    const router = useRouter();
    const [signOut, loading, error] = useSignOut(getAuth(app));

    const handleSignOut = () => {
        fetch("/api/sign-out")
            .then(res => res.json())
            .then(data => {
                signOut()
                    .then(() => router.push("/"))
                    .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
    };

    return (
        <footer className="flex items-center justify-center w-full h-16">
            <button onClick={handleSignOut} className="text-red-600 font-bold">Sign Out</button>
        </footer>
    );
};
