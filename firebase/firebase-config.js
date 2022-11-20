// Import the functions you need from the SDKs you need
import { withBuildScriptExtMinimumVersion } from "@expo/config-plugins/build/android/Version";
import { initializeApp } from "firebase/app";

//Authentication
import { 
  getAuth,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";


//Firestore
import { getFirestore } from "firebase/firestore";
import { collection, setDoc, getDoc, addDoc, doc } from "firebase/firestore"; 

//Storage
import { getStorage, ref, getDownloadURL, uploadBytes, putFile, put } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCd2e4UPkyUCvts_oKush6gMhqr6RC1yOI",
  authDomain: "brynol-app.firebaseapp.com",
  projectId: "brynol-app",
  storageBucket: "brynol-app.appspot.com",
  messagingSenderId: "472747692296",
  appId: "1:472747692296:web:cfcad86ad9035920bf1cbd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);


export const storage = getStorage(app);



export async function signInWithEmail (email, password){
  return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        })
}


export async function createUserWithEmail (username, email, password, avatar){
  return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            verifyEmail();
            const image = uploadImage(userCredential.user.uid, avatar);
            adduser(userCredential.user.uid, email, username, image)
            //uploadImage(userCredential.user.uid, username, email, avatar)
        })
        .catch((error) => {
            console.log('error: ', error.message)
            // ..
        });
    
}


export async function forgotPassword(email){
  return sendPasswordResetEmail(auth, email)
        .then(() => {
          // Password reset email sent!
          // ..
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
}    


async function verifyEmail(){

  return sendEmailVerification(auth.currentUser)
  .then(function() {
    // Verification email sent.
  })
  .catch(function(error) {
    // Error occurred. Inspect error.code.
  });
}


export async function adduser(uid, email, username, avatar){
  try {
    await setDoc(doc(db, "users", uid), {
      username: username,
      email: email,
      avatar: avatar,
      score: 2.5
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}



export async function addEvent(event){
  try {
    
    const newEventRef = await addDoc(collection(db, "parties"), {
      title: event.title,
      day: event.day,
      month: event.month,
      year: event.year,
      hour: event.hour,
      minutes: event.minutes,
      type: event.type,
      place: event.place,
      maxGuests: event.maxGuests,
      description: event.description,
      latitude: event.latitude,
      longitude: event.longitude,
      organizer_uid: event.organizer_uid,
      organizer_username: event.organizer_username,
      organizer_avatar: event.organizer_avatar,
      organizer_score: event.organizer_score
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  console.log(event.organizer_uid)
}


export async function uploadImage(uid, avatar) {

  setUploading(true);

  const response = await fetch(avatar);
  const blob = response.blob();

  var ref = storage.ref().child(`profilePictures/${uid}`).put(blob);

  try{
    await ref;
  }
  catch(e){
    console.log(e);
  }

  setUploading(false);
  alert("Photo uploaded");
  
}


export async function getURL(uid, avatar) {
  let storageRef = ref(storage, `/profilePictures/${uid}`)
  getDownloadURL(storageRef).then((url) => {
    console.log(url)
    return url;
  })
}

