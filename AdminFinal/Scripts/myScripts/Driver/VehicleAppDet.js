import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, child, onValue, get, update, set,remove } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getStorage, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";


const uid = sessionStorage.getItem("uid");
const platenumberID = sessionStorage.getItem("platenumber");


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
var email;

//FETCHING VEHICLE DETAILS
const dbRef = ref(db, 'DRIVER/' + uid + '/VEHICLE/' + platenumberID);
get(dbRef).then((snapshot) => {
    if (snapshot.exists()) {
        var vehicleData = snapshot.val();
        // console.log(vehicleData);    
        document.getElementById("txt_app").value = vehicleData.vehicle_app;
        document.getElementById("txt_brand").value = vehicleData.brand;
        document.getElementById("txt_model").value = vehicleData.model;
        document.getElementById("txt_color").value = vehicleData.color;
        document.getElementById("txt_type").value = vehicleData.type;

    }
    else {
        console.log("error");
    }
});


//FETCHING DRIVER DETAILS
const driverRef = ref(db, 'DRIVER/' + uid + '/ACCOUNT');
get(driverRef).then((snapshot) => {
    if (snapshot.exists()) {
        var driverData = snapshot.val();
        //console.log(driverData);
        document.getElementById("txt_name").value = driverData.lastname + ", " + driverData.firstname + " " + driverData.middlename + " ";
        document.getElementById("txt_add").value = driverData.address;
        document.getElementById("txt_email").value = driverData.email;
        document.getElementById("txt_phone").value = driverData.phonenumber;
        document.getElementById("txt_bal").value = "₱ " + driverData.balance.toFixed(2);

        email = driverData.email;
    }
    else {
        console.log("error");
    }
});




var newCard = "";

//APPLICATION ACCEPTED
document.getElementById("btn_accept").onclick = function () { App_Accept() };
function App_Accept() {
    if (confirm("Accept this Application?")) {
        try {
           
            var message = "Your vehicle application has been accepted! Your RFID card will be delivered to your address within the next few days.";
            //FETCHING RFID CARD
            const RFIDRef = ref(db, 'ADMIN/RFID_CARDS');
            const card = [];

            get(RFIDRef).then((snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    const rfids = childSnapshot.key;
                    card.push(rfids); 

                });

                //console.log(card);
                newCard = card[0];
                if (card.length != 0) {
                    addRtoV(newCard);
                    addRtoD(newCard);
                    deleteRFID(newCard);
                    SendEmail(message);
                    changeStat();
                }
                else {
                    alert("No RFID Cards Available.");
                }
            });
           // console.log(card.length);
            
          

        }
        catch (error) {
            alert('Error: ' + error);
        }
    }

    else {
        window.location.href = `/Home/VehicleAppDet`;
    }

};


//CHANGING APPLICATION STATUS
function changeStat() {
    var apply = "ACCEPTED";
    update(ref(db, 'DRIVER/' + uid + '/VEHICLE/' + platenumberID), {
        vehicle_app: apply,
    });
    window.location.href = `/Home/VehicleApp`;
}

//CONNECTING RFID TO VEHICLE
const RefRtoV = ref(db, 'ADMIN/RFID-TO-VEHICLE');
function addRtoV(newCard) {
    console.log("VEHICLE " + newCard);
    update(RefRtoV, {
        [newCard]: platenumberID
    });
};

//CONNECTING RFID TO DRIVER
const RefRtoD = ref(db, 'ADMIN/RFID-TO-DRIVER');
function addRtoD(newCard) {
    console.log("driver " + newCard);
    update(RefRtoD, {
        [newCard]: uid
    });
}

//REMOVING THE RFID FROM NOT OWNED RFID CARDS
function deleteRFID(newCard) {
    
    console.log("Transfering RFID card "+ newCard);
    
    const databaseRef = ref(db, 'ADMIN/RFID_CARDS/' + newCard);
    remove(databaseRef);

}

//SENDING EMAIL NOTIFICATION
function SendEmail(message) {
    var eventValue = 'AorR';
    var key = 'bCeK7RsJ8eJaOMxpUkmOdv';
    $.ajax({
        type: 'POST',
        url: '/Home/TriggerIFTTT',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            eventValue: eventValue,
            key: key,
            email: email,
            message: message
        }),
        success: function (data) {
            console.log("success");

        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
}





//APPLICATION REJECTED
document.getElementById("btn_reject").onclick = function () { App_Reject() };
function App_Reject() {
    //alert("Reject");
   
    if (confirm("Reject this Application?")) {
        try {
            let reason = prompt("Reason for Rejecting this Application: ", "");
            let message = "Vehicle Application Rejected. Reason: " + reason;
            
            SendEmail(message);
            var apply = "REJECTED";
            update(ref(db, 'DRIVER/' + uid + '/VEHICLE/' + platenumberID), {
                vehicle_app: apply
            });
            updateReason(reason);
            window.location.href = `/Home/VehicleApp`;

        }
        catch (error) {
            alert('Error: ' + error);
        }
    }

    else {
        window.location.href = `/Home/VehicleAppDet`;
    }
}

function updateReason(reason) {

     update(dbRef, {
        reason: reason
    });
}


























document.getElementById("btn_cor").addEventListener('click', function () {
    openFileFromVehicle('vehicleDocument');
    console.log("cor");

});

document.getElementById('btn_vehicle').addEventListener('click', function () {
    openFileFromVehicle('vehicleImage');
    console.log("vehicle");
});




















function openFileFromVehicle(fileType) {
    /*console.log(uid , platenumberID, fileType);*/
    const fileRef = ref(db, '/DRIVER/' + uid + '/VEHICLE/' + platenumberID + "/" + fileType);
    get(fileRef).then((snapshot) => {
        if (snapshot.exists()) {
            const filePath = snapshot.val();
            /*const storageReference = storageRef(storage, filePath);*/
            /*openFileInNewTab(filePath);*/
            /* console.log(filePath);*/
            window.open(filePath, '_blank');
        }
        else {
            console.error('File path not found in the database.');
        }
    }).catch((error) => {
        console.error('Error fetching file path from the database', error);
    });
}















document.getElementById("btn_license").addEventListener('click', function () {
    openFileFromDriver('imageDLUrl');
    console.log("license");

});

document.getElementById('btn_pic').addEventListener('click', function () {
    openFileFromDriver('imageUrl');
    console.log("picture");
});


function openFileFromDriver(fileType) {
    /*console.log(uid, platenumberID, fileType);*/
    const fileRef = ref(db, '/DRIVER/' + uid + '/ACCOUNT/' + fileType);
    get(fileRef).then((snapshot) => {
        if (snapshot.exists()) {
            const filePath = snapshot.val();
            /*const storageReference = storageRef(storage, filePath);*/
            /*openFileInNewTab(filePath);*/
            /*console.log(filePath);*/
            window.open(filePath, '_blank');
        }
        else {
            console.error('File path not found in the database.');
        }
    }).catch((error) => {
        console.error('Error fetching file path from the database', error);
    });
}


