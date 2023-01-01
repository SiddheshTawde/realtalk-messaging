import firestore from "../firebase/firestore";

export default async function getUserDetails(uid: string) {
    try {
        const user = (await firestore.doc("users/" + uid).get()).data();
        return user;
    } catch (error) {
        return null;
    }
};