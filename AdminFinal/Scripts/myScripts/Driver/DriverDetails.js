import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, child, onValue, get, update } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getStorage, ref as storageRef, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";


const uid = sessionStorage.getItem("uid");
//console.log("hello");
//console.log(uid);

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
const storage = getStorage(app);


//FETCHING DATA FROM DRIVER ACCOUNT
const driverRef = ref(db, 'DRIVER/' + uid + '/ACCOUNT');
get(driverRef).then((snapshot) => {
    /*console.log("hello");*/
    //console.log(platenumberID);
    /*const accountSnapshot = childSnapshot.child('ACCOUNT');*/
    if (snapshot.exists()) {
        // Push the value of "ACCOUNT" to the owners array
        var driverData = snapshot.val();
        /* console.log(driverData);*/
        // Set the value of the textbox with id "nameTextbox"
        document.getElementById("txt_name").value = driverData.lastname + ", " + driverData.firstname + " " + driverData.middlename + " ";
        document.getElementById("txt_address").value = driverData.address;
        document.getElementById("txt_email").value = driverData.email;
        document.getElementById("txt_phonenum").value = driverData.phonenumber;
        document.getElementById("txt_bal").value = "₱ " + driverData.balance;


    }
    else {
        console.log("error");
    }
});

//BTN LICENSE
document.getElementById("btn_license").addEventListener('click', function () {
    openFileFromDriver('imageDLUrl');
    /*console.log("license");*/

});

//BTN IMAGE
document.getElementById('btn_pic').addEventListener('click', function () {
    openFileFromDriver('imageUrl');
    /*console.log("picture");*/
});

//BTN FETCHING AND OPENING FILES IN NEW WINDOW
function openFileFromDriver(fileType) {
    /*console.log(uid, platenumberID, fileType);*/
    const fileRef = ref(db, '/DRIVER/' + uid + '/ACCOUNT/' + fileType);
    get(fileRef).then((snapshot) => {
        if (snapshot.exists()) {
            const filePath = snapshot.val();
            window.open(filePath, '_blank');
        }
        else {
            console.error('File path not found in the database.');
        }
    }).catch((error) => {
        console.error('Error fetching file path from the database', error);
    });
}



//GETTING THE NUMBER OF VEHICLE OF THE SPECIFIC DRIVER
const VehicleRef = ref(db, "DRIVER/" + uid + "/VEHICLE");
let platenumlist = [];
let plateLength;
get(VehicleRef).then((snapshot) => {
    snapshot.forEach((childSnapshot) => {
        if (snapshot.exists) {
            // Collect the child IDs (keys)
            const platenum = childSnapshot.key;
            platenumlist.push(platenum);
        }
        else {
            console.log("error");

        }
    })
    plateLength = platenumlist.length
    vehicleButton();

});





//DISPLAYING VEHICLE BUTTONS
function vehicleButton() {

    var i = 0;
    var tbody = $('#tbody');

    while (i < plateLength) {
        var pNum = platenumlist[i];
        console.log(pNum);

        let m = i + 1;
        let trow = $('<tr>');

        let button = $('<button>').addClass('btnVehicle')
            .attr({
                'type': 'button',
                'data-toggle': 'modal',
                'data-target': '#exampleModalCenter',
                'data-id': pNum,
                'data-id2': uid
            })
            .text(pNum);

        trow.append($('<td>').append(button));
        tbody.append(trow);

        i++;
    }

    tbody.on("click", ".btnVehicle", function () {
        const plateNum = $(this).data("id");
        sessionStorage.setItem("platenum", plateNum);
        const uid = $(this).data("id2");
        sessionStorage.setItem("uid", uid);

        window.location.href = `/Home/VehicleDetails`;
        /*window.location.href = `/Home/draftPage`;*/
    });
};



