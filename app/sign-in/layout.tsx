import { redirect } from "next/navigation";
import { ReactNode, use } from "react";
import getCurrentUser from "../../utils/get-current-user";

export default function SignInLayout({ children }: { children: ReactNode }) {
    const user = use(getCurrentUser());

    if (user !== null) {
        redirect("/");
    }

    return (
        <main className="h-full w-full flex items-center justify-center flex-col bg-gradient-to-tr from-gradient-end to-gradient-start">
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl font-bold text-black/60">RealTalk</p>
            </div>
            {children}
        </main>
    );
};
