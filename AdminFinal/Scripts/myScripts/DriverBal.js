import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, child, onValue, get, update } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

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

    var uid = 0;
    var drvNo = 0;



    const dbRef = ref(db, 'ADMIN/TRANSACTIONS/DRIVER');

    //GETTING THE DRIVERS UIDS
    get(dbRef).then((snapshot) => {
        const DriverUID = [];

        snapshot.forEach((childSnapshot) => {
            // Collect the child IDs (keys)
            const childId = childSnapshot.key;
            DriverUID.push(childId);

        });
        console.log("Child IDs:", DriverUID);
        getVehicle(DriverUID);
    });

    //GETTING THE VEHICLE PLATE NUMBER
    function getVehicle(DriverUID) {
        var itemsPerPage = 8;
        var currentPage = 1;
        var table = $("#table");
        var tbody = $('#tbody');

        function displayTablePage(page, data) {
            tbody.empty();
            var startIndex = (page - 1) * itemsPerPage;
            var endIndex = startIndex + itemsPerPage;
            var resultRow = 0;

            for (var i = startIndex; i < endIndex && i < data.length; i++) {
                const details = data[i];
                let trow = $('<tr>');
                let td1 = $('<td>').text(details.fullname);
                let td2 = $('<td>').text(details.amount);
                let td3 = $('<td>').text(details.date);
                let td4 = $('<td>').text(details.ref_number);
                trow.append(td1, td2, td3, td4);
                tbody.append(trow);
                resultRow++;
            }

            $('#currentPage').text(page);

            if (currentPage === 1) {
                $('#prevBtn').prop("disabled", true).addClass("inactive");
            } else {
                $('#prevBtn').prop("disabled", false).removeClass("inactive");
            }

            var totalPages = Math.ceil(data.length / itemsPerPage);

            if (page >= totalPages) {
                $('#nextBtn').prop("disabled", true).addClass("inactive");
            } else {
                $('#nextBtn').prop("disabled", false).removeClass("inactive");
            }
        }

        // Fetch data from Firebase
        var promises = DriverUID.map(uid => {
            const VehicleRef = ref(db, "ADMIN/TRANSACTIONS/DRIVER/" + uid);
            return get(VehicleRef).then(snapshot => snapshot.val());
        });

        Promise.all(promises).then(data => {
            // Sort data based on the date field in descending order
            data.sort((a, b) => {
                const dateA = parseDate(a.date);
                const dateB = parseDate(b.date);
                return dateB - dateA;
            });

            // Initial display of the first page
            displayTablePage(currentPage, data);

            // Event handlers for pagination buttons
            $('#prevBtn').on('click', function () {
                if (currentPage > 1) {
                    currentPage--;
                    displayTablePage(currentPage, data);
                }
            });

            $('#nextBtn').on('click', function () {
                var totalPages = Math.ceil(data.length / itemsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    displayTablePage(currentPage, data);
                }
            });
        });
    }

    function parseDate(dateString) {
        const [day, month, year] = dateString.split('/');
        return new Date(`${month}/${day}/${year}`);
    }



});
