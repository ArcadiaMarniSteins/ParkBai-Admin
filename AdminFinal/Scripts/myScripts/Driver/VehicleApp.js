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



    const dbRef = ref(db, 'DRIVER');

    //GETTING THE DRIVERS UIDS
    get(dbRef).then((snapshot) => {
        const DriverUID = [];

        snapshot.forEach((childSnapshot) => {
            // Collect the child IDs (keys)
            const childId = childSnapshot.key;
            DriverUID.push(childId);

        });
        /*console.log("Child IDs:", DriverUID);*/
        getVehicle(DriverUID);
        
    });

    //GETTING THE VEHICLE PLATE NUMBER
    function getVehicle(DriverUID) {
        var itemsPerPage = 8;
        var currentPage = 1;
        var table = $("#table");
        var tbody = $('#tbody');

        function displayTablePage(page) {
            tbody.empty();
            var startIndex = (page - 1) * itemsPerPage;
            var endIndex = startIndex + itemsPerPage;
            var resultRow = 0;

            for (var i = startIndex; i < endIndex && i < DriverUID.length; i++) {
                const VehicleRef = ref(db, "DRIVER/" + DriverUID[i] + "/VEHICLE");
                let driverID = DriverUID[i];

                get(VehicleRef).then((snapshot) => {
                    snapshot.forEach((childSnapshot) => {
                        const platenumber = childSnapshot.key;
                        const details = childSnapshot.val();

                        if (details.vehicle_app == "PENDING" || details.vehicle_app == "pending") {
                            document.getElementById('emptyText').style.display = 'none';
                            let trow = $('<tr>');
                            let td2 = $('<td>').text(platenumber);
                            let td3 = $('<td>').text(details.vehicle_app);

                            let button = $('<button>').addClass('btnView')
                                .attr({
                                    'type': 'button',
                                    'data-id': platenumber,
                                    'data-id2': driverID
                                })
                                .text('VIEW');

                            trow.append(td2, td3, $('<td>').append(button));
                            tbody.append(trow);
                            resultRow++;
                        }
                        else {
                            document.getElementById('emptyText').style.display = 'block';
                        }
                    });
                });
            }

            // Event delegation for the btnView click event
            tbody.on("click", ".btnView", function () {
                const uid = $(this).data("id2");
                const platenumber = $(this).data("id");
                sessionStorage.setItem("uid", uid);
                sessionStorage.setItem("platenumber", platenumber);
                window.location.href = `/Home/VehicleAppDet`;
            });

            $('#currentPage').text(page);

            // Hiding buttons
            if (currentPage === 1) {
                $('#prevBtn').prop("disabled", true).addClass("inactive");
            } else {
                $('#prevBtn').prop("disabled", false).removeClass("inactive");
            }

            if (startIndex + itemsPerPage >= resultRow) {
                $('#nextBtn').prop("disabled", true).addClass("inactive");
            } else {
                $('#nextBtn').prop("disabled", false).removeClass("inactive");
            }
        }

        // Initial display of the first page
        displayTablePage(currentPage);

        // Event handlers for pagination buttons
        $('#prevBtn').on('click', function () {
            if (currentPage > 1) {
                currentPage--;
                displayTablePage(currentPage);
            }
        });

        $('#nextBtn').on('click', function () {
            var totalPages = Math.ceil(DriverUID.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                displayTablePage(currentPage);
            }
        });
    }


});
