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

    
    const dbRef = ref(db, 'DRIVER');

    //GETTING THE DRIVERS UIDS
    get(dbRef).then((snapshot) => {
        const DriverUID = [];

        snapshot.forEach((childSnapshot) => {
            // Collect the child IDs (keys)
            const childId = childSnapshot.key;
            DriverUID.push(childId);

        });
        getVehicle(DriverUID);

        //SEARCH FOR DRIVER
        $('#searchBtn').on('click', function () {
            console.log("Search");
            var searchText = document.getElementById("searchTxt");
            var findDriver = searchText.value.trim();  // Remove leading and trailing whitespaces

            if (findDriver !== "") {
                SearchDriver(DriverUID, findDriver);
            } else {
                // Handle the case when the search text is empty
            }

            // Clear the value inside the "searchTxt" input
            searchText.value = "";
        });

        $('#refreshBtn').on('click', function () {
            console.log("Search");
            getVehicle(DriverUID);
        })

    });

    
    function getVehicle(DriverUID) {
        var itemsPerPage = 8;
        var currentPage = 1;

        function displayTablePage(page) {
            $('#tbody').empty();
            //console.log(page);
            var startIndex = (page - 1) * itemsPerPage;
            var endIndex = startIndex + itemsPerPage;

            for (var i = startIndex; i < endIndex && i < DriverUID.length; i++) {
                const VehicleRef = ref(db, "DRIVER/" + DriverUID[i] + "/ACCOUNT");
                let driverID = DriverUID[i];

                get(VehicleRef).then((snapshot) => {
                    const details = snapshot.val();
                   

                    let trow = $('<tr>');
                    let td2 = $('<td>').text(details.lastname + ", " + details.firstname + " " + details.middlename);

                    let button = $('<button>').addClass('btnView')
                        .attr({
                            'type': 'button',
                            'data-toggle': 'modal',
                            'data-target': '#exampleModalCenter',
                            'data-id': driverID
                        })
                        .text('VIEW');

                    trow.append( td2, $('<td>').append(button));
                    $('#tbody').append(trow);
                });
            }

            // Event delegation for the btnView click event
            $('#tbody').on("click", ".btnView", function () {
                const uid = $(this).data("id");
                sessionStorage.setItem("uid", uid);
                window.location.href = '/Home/DriverDetails';
            });

            $('#currentPage').text(page);

            // Hiding buttons
            if (currentPage === 1) {
                $('#prevBtn').prop("disabled", true).addClass("inactive");
            } else {
                $('#prevBtn').prop("disabled", false).removeClass("inactive");
            }

            if (startIndex + itemsPerPage >= DriverUID.length) {
                $('#nextBtn').prop("disabled", true).addClass("inactive");
            } else {
                $('#nextBtn').prop("disabled", false).removeClass("inactive");
            }
        }



        // Initial display of the first page
        displayTablePage(currentPage);

        $('#prevBtn').on('click', function () {
            if (currentPage > 1) {
                currentPage--;
                displayTablePage(currentPage);

            }
        });

        $('#nextBtn').on('click', function () {
            if (currentPage < Math.ceil(DriverUID.length / itemsPerPage)) {
                currentPage++;
                displayTablePage(currentPage);
            }
        });

    }

    function SearchDriver(DriverUID, findName) {
        $('#tbody').empty();
        var i = 0;
        var promises = [];

        // Convert the search string to lowercase for case-insensitive comparison
        const findNameLower = findName.toLowerCase();

        while (i < DriverUID.length) {
            const VehicleRef = ref(db, "DRIVER/" + DriverUID[i] + "/ACCOUNT");
            let driverID = DriverUID[i];

            // Create a promise for each get operation
            const promise = new Promise((resolve) => {
                get(VehicleRef).then((snapshot) => {
                    const details = snapshot.val();
                   // drvNo++;

                    // Convert details to lowercase for case-insensitive comparison
                    const firstNameLower = details.firstname.toLowerCase();
                    const middleNameLower = details.middlename.toLowerCase();
                    const lastNameLower = details.lastname.toLowerCase();

                    if (
                        findNameLower === firstNameLower ||
                        findNameLower === middleNameLower ||
                        findNameLower === lastNameLower
                    ) {
                        let trow = $('<tr>');
                        //let td1 = $('<td>').text(drvNo);
                        let td2 = $('<td>').text(lastNameLower + ", " + firstNameLower + " " + middleNameLower);

                        let button = $('<button>').addClass('btnView')
                            .attr({
                                'type': 'button',
                                'data-toggle': 'modal',
                                'data-target': '#exampleModalCenter',
                                'data-id': driverID
                            })
                            .text('VIEW');

                        trow.append( td2, $('<td>').append(button));
                        $('#tbody').append(trow);
                    }
                    resolve(); // Resolve the promise once the get operation is complete
                });
            });

            promises.push(promise);
            i++;
        }

        // Use Promise.all to wait for all promises to resolve
        Promise.all(promises).then(() => {
            // Show "No results found" message if no matching results were found
            if ($('#tbody').is(':empty')) {
                var noResultElement = document.getElementById("noResult");
                noResultElement.textContent = "No results found.";
            } else {
                var noResultElement = document.getElementById("noResult");
                noResultElement.textContent = "";
            }

            // Event delegation for the btnView click event
            $('#tbody').on("click", ".btnView", function () {
                const uid = $(this).data("id");
                sessionStorage.setItem("uid", uid);
                window.location.href = '/Home/DriverDetails';
            });
        });
    }




});
