import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, child, onValue, get, update, set, remove } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getStorage, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";


const uid = sessionStorage.getItem("uid");
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
var email;

//FETCHING LOT OWNER DETAILS
const dbRef = ref(db, 'PARK_OWNER/' + uid + '/ACCOUNT');
get(dbRef).then((snapshot) => {
    if (snapshot.exists()) {
        var ownerData = snapshot.val();
        //console.log(ownerData);    
        document.getElementById("txtName").value = ownerData.Last_Name + ", " + ownerData.First_Name + " " + ownerData.Middle_Name;
        document.getElementById("txtStat").value = ownerData.Application;
        document.getElementById("txtEmail").value = ownerData.Email;
        document.getElementById("txtPhone").value = ownerData.Phone;
 
        email = ownerData.Email;
    }
    else {
        console.log("error");
    }
});


//FETCHING LOT ADDRESS
const lotRef = ref(db, 'PARK_OWNER/' + uid + '/PARKING_LOT');
get(lotRef).then((snapshot) => {
    if (snapshot.exists()) {
        var ownerData = snapshot.val();
        //console.log(ownerData);
        document.getElementById("txtAdd").value = ownerData.Address;
        document.getElementById("txtCom").value = ownerData.Company;
        


    }
    else {
        console.log("error");
    }
});







////APPLICATION ACCEPTED
//document.getElementById("btn_accept").onclick = function () { App_Accept() };
//function App_Accept() {
//    if (confirm("Accept this Application?")) {
//        try {
//            var message = "Your vehicle application has been accepted! You will be informed for your schedule for physical visit and contract signing in the next few days.";
                 
//                    SendEmail(message);
//                    changeStat();
             
//        }
//        catch (error) {
//            alert('Error: ' + error);
//        }
//    }

//    else {
//        window.location.href = `/Home/OwnerAppDet`;
//    }

//};


////CHANGING APPLICATION STATUS
//function changeStat() {
//    var apply = "ACCEPTED";
//    update(ref(db, 'PARK_OWNER/' + uid + '/ACCOUNT'), {
//        Application: apply,
//    });
//    window.location.href = `/Home/OwnerApp`;
//}


////SENDING EMAIL NOTIFICATION
//function SendEmail(message) {
//    var eventValue = 'AorR';
//    var key = 'bCeK7RsJ8eJaOMxpUkmOdv';
//    $.ajax({
//        type: 'POST',
//        url: '/Home/TriggerIFTTT',
//        contentType: 'application/json; charset=utf-8',
//        data: JSON.stringify({
//            eventValue: eventValue,
//            key: key,
//            email: email,
//            message: message
//        }),
//        success: function (data) {
//            console.log("success");

//        },
//        error: function (error) {
//            console.error('Error:', error);
//        }
//    });
//}





////APPLICATION REJECTED
//document.getElementById("btn_reject").onclick = function () { App_Reject() };
//function App_Reject() {
//    //alert("Reject");

//    if (confirm("Reject this Application?")) {
//        try {
//            let reason = prompt("Reason for Rejecting this Application: ", "");
//            let message = "Application Rejected. Reason: " + reason;

//            SendEmail(message);
//            var apply = "REJECTED";
//            update(ref(db, 'PARK_OWNER/' + uid + '/ACCOUNT'), {
//                Application: apply,
//            });
//            updateReason(reason);
//            window.location.href = `/Home/OwnerApp`;

//        }
//        catch (error) {
//            alert('Error: ' + error);
//        }
//    }

//    else {
//        window.location.href = `/Home/OwnerAppDet`;
//    }
//}

//function updateReason(reason) {

//    update(dbRef, {
//        reason: reason
//    });
//}



//document.getElementById("btn_bp").addEventListener('click', function () {
//    openFileFromOwner('Business_Permit');
//    //console.log("cor");

//});

//document.getElementById('btn_land').addEventListener('click', function () {
//    openFileFromOwner('Land_Title');
//    //console.log("vehicle");
//});


function openFileFromOwner(fileType) {
    /*console.log(uid , platenumberID, fileType);*/
    const fileRef = ref(db, '/PARK_OWNER/' + uid + '/Files/' + fileType + "/downloadURL" );
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



document.getElementById("btn_lot").addEventListener('click', function () {
    openFileFromLot('Profile_Picture');
   // console.log("license");

});


function openFileFromLot(fileType) {
    /*console.log(uid, platenumberID, fileType);*/
    const fileRef = ref(db, '/PARK_OWNER/' + uid + '/PARKING_LOT/' + fileType);
    get(fileRef).then((snapshot) => {
        if (snapshot.exists()) {
            const filePath = snapshot.val();
            console.log(filePath);
            //window.open(filePath, '_blank');
        }
        else {
            console.error('File path not found in the database.');
        }
    }).catch((error) => {
        console.error('Error fetching file path from the database', error);
    });
}


