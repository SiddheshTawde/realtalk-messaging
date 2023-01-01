import { getFirestore } from "firebase-admin/firestore";
import admin from "./admin";

const firestore = getFirestore(admin);

export default firestore;