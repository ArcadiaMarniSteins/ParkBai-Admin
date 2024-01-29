import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getDatabase, get, ref } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
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


    //PARKBAI ICON FETCHING
    const imgRef = ref(db, '/ADMIN/ASSETS/Icon');
    get(imgRef).then((snapshot) => {
        if (snapshot.exists()) {
            const imgElement = document.getElementById('ParkBaiIcon');
            imgElement.src = snapshot.val();
        }
        else {
            console.error('File path not found in database.');
        }
    }).catch((error) => {
        console.error('Error fetching file', error);
    });

    //GENBAL FETCH
    const balRef = ref(db, 'ADMIN/general_balance');
    get(balRef).then((snapshot) => {
        var adminData = snapshot.val().toFixed(2);
        if (snapshot.exists()) {
                   
            var bal = numberWithSpaces(adminData);
            document.getElementById('genBal').value = "₱ " + bal;
            
        }
        else {
            console.error('File path not found in database.');
        }
    })

    //PARKBAI BALANCE FETCH
    const balPBRef = ref(db, 'ADMIN/parkbai_balance');
    get(balPBRef).then((snapshot) => {
        var adminData = snapshot.val().toFixed(2);
        if (snapshot.exists()) {

            var bal = numberWithSpaces(adminData);
            document.getElementById('parkBaiBal').value = "₱ " + bal;

        }
        else {
            console.error('File path not found in database.');
        }
    })

    //arrange the numbers
    function numberWithSpaces(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return parts.join(".");
    }


    //get sum of all driver balance
    const driverRef = ref(db, 'DRIVER');
    get(driverRef).then((snapshot) => {
        const DriverUID = [];

        snapshot.forEach((childSnapshot) => {
            const childId = childSnapshot.key;
            DriverUID.push(childId);
        });

        // Use Promise.all to wait for all asynchronous calls to complete
        Promise.all(DriverUID.map(getDriver)).then((driverBalances) => {
            const totalDriverBal = driverBalances.reduce((acc, bal) => acc + bal, 0);
            const totDriverBal = totalDriverBal.toFixed(2);
            const totBal = numberWithSpaces(totDriverBal);
            // Display the total balance on the button
            document.getElementById('balDriver').value = "₱ " + totBal;


        });
    });

    function getDriver(driverUID) {
        const VehicleRef = ref(db, `DRIVER/${driverUID}/ACCOUNT/balance`);

        return get(VehicleRef).then((snapshot) => {
            const bal = snapshot.val() || 0;
            return bal;
        });
    };


    //get sum of all Owner balance
    const ownerRef = ref(db, 'PARK_OWNER');
    get(ownerRef).then((snapshot) => {
        const OwnerUID = [];

        snapshot.forEach((childSnapshot) => {
            const childId = childSnapshot.key;
            OwnerUID.push(childId);
        });

        // Use Promise.all to wait for all asynchronous calls to complete
        Promise.all(OwnerUID.map(getOwner)).then((ownerBalances) => {
            const totalOwnerBal = ownerBalances.reduce((acc, bal) => acc + bal, 0);
            const totOwnerBal = totalOwnerBal.toFixed(2);
            const totBal = numberWithSpaces(totOwnerBal);
            // Display the total balance on the button
            document.getElementById('balOwner').value = "₱ " + totBal;
            
        });
    });

    function getOwner(ownerUID) {
        const VehicleRef = ref(db, `PARK_OWNER/${ownerUID}/INCOME/Current_Balance`);

        return get(VehicleRef).then((snapshot) => {
            const bal = snapshot.val() || 0;
            return bal;
        });
    };

    $("#btnDriver").click(function () {
        window.location.href = `/Home/DriverBal`;
    });

    $("#btnOwner").click(function () {
        window.location.href = `/Home/OwnerBal`;
    });
    
});