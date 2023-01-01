import { redirect } from 'next/navigation';
import { Fragment, ReactNode, use } from "react";

import getCurrentUser from "../../utils/get-current-user";

export default function ConversationLayout({ children }: { children: ReactNode }) {
    const user = use(getCurrentUser());

    if (user === null) {
        redirect("/sign-in");
    }

    return (
        <Fragment>{children}</Fragment>
    )
};
