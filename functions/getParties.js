import { db } from '../firebase/firebase-config'
import { getDocs, collectionGroup } from "firebase/firestore";

const getParties = async function () {

    const querySnapshot = await getDocs(collectionGroup(db, "parties"));

    const parties = [];
    
    querySnapshot.forEach((doc) => { 

        parties.push({
            ...doc.data(),
            id: doc.id,
            organizer: doc.ref.parent.parent.id
        })            
    });

    return parties;
}

export default getParties