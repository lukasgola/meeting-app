import { db } from '../firebase/firebase-config'
import { getDocs, collectionGroup, query, where } from "firebase/firestore";

async function getParties (category) {

    const collectionRef = collectionGroup(db, "parties");
    let q = query(collectionRef);
    if (category != 'all'){
        q = query(collectionRef, where("category", "==", category));
    }
    
    const querySnapshot = await getDocs(q);

    let temp = [];

    querySnapshot.forEach((doc) => { 

        temp.push({
            ...doc.data(),
            id: doc.id,
            organizer: doc.ref.parent.parent.id
        })
        
    });

    return temp
    
}

export {getParties}