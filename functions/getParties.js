import { db } from '../firebase/firebase-config'
import { getDocs, collectionGroup } from "firebase/firestore";

async function getParties () {

    const querySnapshot = await getDocs(collectionGroup(db, "parties"));

    const parties = [];
    
    querySnapshot.forEach((doc) => { 
        parties.push({
            ...doc.data(),
            id: doc.id,
            organizer: doc.ref.parent.parent.id
        })
    });
    console.log(parties)
    return parties
}

export {getParties}