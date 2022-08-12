// Import the functions you need from the SDKs you need
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
import { collection, setDoc, getDoc, doc } from "firebase/firestore"; 

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
            uploadImage(userCredential.user.uid, username, email, avatar)
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

export async function addEvent(){
  try {
    const docRef = await addDoc(collection(db, "events"), {
      username: username,
      email: email,
      avattar: avatar,
      score: 2.5
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}


export async function uploadImage(uid, email, username, avatar) {
  let storageRef = ref(storage, `/profilePictures/${uid}`)
  const response = await fetch(avatar.uri)
  const blob = await response.blob();
  
  console.log(JSON.stringify(avatar))
  uploadBytes(storageRef, blob).then((snapshot) => {
    getURL(uid, email, username, avatar).then(
      console.log('success')
    )
  });
}



export async function getURL(uid, email, username, avatar) {
  let storageRef = ref(storage, `/profilePictures/${uid}`)
  getDownloadURL(storageRef).then((url) => {
    console.log(url)
    adduser(uid, username, email, url)
  })
}

