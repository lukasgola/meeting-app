import { db, auth } from '../../firebase/firebase-config';
import { getDoc, doc } from "firebase/firestore"; 

import { USER_STATE_CHANGE } from '../constans/index';

export async function fetchUser(){

    await getDoc(doc(db, "users", auth.currentUser.uid))
    .then(docSnap => {
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            return {type: USER_STATE_CHANGE, currentUser: docSnap.data()}
        } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        }
    })


    

}