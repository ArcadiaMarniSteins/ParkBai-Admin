import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getDatabase,get ,ref} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { getStorage, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";


$(document).ready(function () {
    const firebaseConfig = {
        apiKey: "AIzaSyBrmIkzH9xI9BHHSJOJMYDd-J3UkPJsS7k",
        authDomain: "parkbai-c8f04.firebaseapp.com",
        databaseURL: "https://parkbai-c8f04-default-rtdb.firebaseio.com",
        projectId: "parkbai-c8f04",
        storageBucket: "parkbai-c8f04.appspot.com",
        messagingSenderId: "195961929914",
        appId: "1:195961929914:web:f609827668b79399b80283",
        measurementId: "G-0THPRYGBY6"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const auth = getAuth(app);
    


    //PARKBAI LOGO FETCHING
    //var imageRef = ref(storageRef, imagePath);
    //getDownloadURL(imageRef).then(url => {
    //    const imgElement = document.getElementById('ParkBaiLogo');
    //    imgElement.src = url;
    //}).catch(function (error) {
    //    console.error(error);
    //});

    //get image url
    //const storage = getStorage(app);
    //const storageRef = ref(storage);
    //const imagePath = 'ADMIN/ASSETS/parkbai icon.png';
    //var imageRef = ref(storageRef, imagePath);
    //getDownloadURL(imageRef).then(url => {
    //    console.log(url);
    //}).catch(function (error) {
    //    console.error(error);
    //});

    const imgRef = ref(db, '/ADMIN/ASSETS/Logo');
    get(imgRef).then((snapshot) => {
        if (snapshot.exists()) {
            const imgElement = document.getElementById('ParkBaiLogo');
            imgElement.src = snapshot.val();
        }
        else {
            console.error('File path not found in database.');
        }
    }).catch((error) => {
        console.error('Error fetching file', error);
    });


    //togglePassword
    const togglePassword = document.querySelector("#togglePassword");
    const password = document.querySelector("#txtpass");

    togglePassword.addEventListener("click", function () {
        
        const type = password.getAttribute("type") === "password" ? "text" : "password";
        password.setAttribute("type", type);

        this.classList.toggle("bi-eye");
    });

    const form = document.querySelector("form");
    form.addEventListener('submit', function (e) {
        e.preventDefault();
    })


    //BUTTON CLICK FOR LOG IN
    $("#btnLogin").click(function () {
        /*alert("hello");*/
        console.log("attempting");
        //event.preventDefault();
        login();
    });


    //CREDENTIAL VERIFICATIONS
    function login() {
        var username = $("#txtuser").val();
        var password = $("#txtpass").val();

        signInWithEmailAndPassword(auth, username, password)
            .then((userCredential) => {

                const user = userCredential.user;
                //console.log(user);
                //console.log(user.uid);
                getUser(user.uid);

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
            });
    }

    //SESSION USER AUTHENTICATION
    function getUser(uid) {
        const user = auth.currentUser;
        onAuthStateChanged(auth, (user) => {
            if (user) {
                $.post("..//Home/LoginSession", {
                    uid: uid,
                }, function (res) {
                    if (res[0].mess == 1) {
                        /*alert("Logged in !");   */
                        window.location.href = "../Home/AdminMain";
                        clearTxt();
                        
                    }
                    else {

                    }

                   
                })
            } else {
                console.error("Authentication error:", error);
            }
        });
    }

    //empty values of user and pass
    function clearTxt() {
        var clearUser = document.getElementById('txtuser');
        var clearPass = document.getElementById('txtpass');

        clearUser.value = "";
        clearPass.value = "";
    }
});

