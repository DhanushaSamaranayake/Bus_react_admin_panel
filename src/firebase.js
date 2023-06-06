import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage} from "firebase/storage";


//import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBt2vuqjDN4Vsur--dakJyw6sFwrrvZlqA",
  authDomain: "bus-ola-and-indriver.firebaseapp.com",
  databaseURL: "https://bus-ola-and-indriver-default-rtdb.firebaseio.com",
  projectId: "bus-ola-and-indriver",
  storageBucket: "bus-ola-and-indriver.appspot.com",
  messagingSenderId: "43640956920",
  appId: "1:43640956920:web:1c0590cb22af99c756580d",
  measurementId: "G-JVWVB173VN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
//export const dbRef = ref(db,'server/saving-data/fireblog');
export const storage = getStorage(app);

//const analytics = getAnalytics(app);