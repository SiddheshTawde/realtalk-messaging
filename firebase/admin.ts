import admin from "firebase-admin"

import serviceAccount from "./realtalk-messaging-firebase-adminsdk.json";

try {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: serviceAccount.project_id,
            privateKey: serviceAccount.private_key,
            clientEmail: serviceAccount.client_email
        })
    });
} catch (error: any) {
    // we skip the "already exists" message which is
    // not an actual error when we're hot-reloading
    if (error.code === "app/duplicate-app") {
        // console.error('Firebase initialization error', error.message);
    }
}

export default admin.app();