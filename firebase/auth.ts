import { getAuth } from "firebase-admin/auth";
import admin from "./admin";

const auth = getAuth(admin);

export default auth;