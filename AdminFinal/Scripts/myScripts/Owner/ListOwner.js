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


    const dbRef = ref(db, 'PARK_OWNER');

    //GETTING THE DRIVERS UIDS
    get(dbRef).then((snapshot) => {
        const OwnerUID = [];

        snapshot.forEach((childSnapshot) => {
            // Collect the child IDs (keys)
            const childId = childSnapshot.key;
            OwnerUID.push(childId);

        });
        getOwner(OwnerUID);

        //SEARCH FOR OWNER
        $('#searchBtn').on('click', function () {
            console.log("Search");
            var searchText = document.getElementById("searchTxt");
            var findOwner = searchText.value.trim();  // Remove leading and trailing whitespaces

            if (findOwner !== "") {
                searchOwner(OwnerUID, findOwner);
            } else {
                // Handle the case when the search text is empty
            }

            // Clear the value inside the "searchTxt" input
            searchText.value = "";
        });

        $('#StatAcc').on('click', function () {
            var AppStat = "ACCEPTED";
            showByStat(OwnerUID, AppStat);
        })

        $('#StatRej').on('click', function () {
            var AppStat = "REJECTED";
            showByStat(OwnerUID, AppStat);
        })

        $('#refreshBtn').on('click', function () {
            console.log("Search");
            getOwner(OwnerUID);
        })

    });


    function getOwner(OwnerUID) {
        var itemsPerPage = 8;
        var currentPage = 1;

        function displayTablePage(page) {
            $('#tbody').empty();
            //console.log(page);
            var startIndex = (page - 1) * itemsPerPage;
            var endIndex = startIndex + itemsPerPage;

            for (var i = startIndex; i < endIndex && i < OwnerUID.length; i++) {
                const VehicleRef = ref(db, "PARK_OWNER/" + OwnerUID[i] + "/ACCOUNT");
                let ownerID = OwnerUID[i];

                get(VehicleRef).then((snapshot) => {
                    const details = snapshot.val();
                    const appDet = details.Application;
                    console.log(appDet);
                    if (appDet !== "PENDING") {
                        let trow = $('<tr>');
                        let td1 = $('<td>').text(details.Last_Name + ", " + details.First_Name + " " + details.Middle_Name);
                        let td2 = $('<td>').text(details.Application);

                        let button = $('<button>').addClass('btnView')
                            .attr({
                                'type': 'button',
                                'data-id': ownerID
                            })
                            .text('VIEW');

                        trow.append(td1, td2, $('<td>').append(button));
                        $('#tbody').append(trow);
                    }
                    
                });
            }

            // Event delegation for the btnView click event
            $('#tbody').on("click", ".btnView", function () {
                const uid = $(this).data("id");
                sessionStorage.setItem("uid", uid);
                window.location.href = '/Home/OwnerDetails';
            });

            $('#currentPage').text(page);

            // Hiding buttons
            if (currentPage === 1) {
                $('#prevBtn').prop("disabled", true).addClass("inactive");
            } else {
                $('#prevBtn').prop("disabled", false).removeClass("inactive");
            }

            if (startIndex + itemsPerPage >= OwnerUID.length) {
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
            if (currentPage < Math.ceil(OwnerUID.length / itemsPerPage)) {
                currentPage++;
                displayTablePage(currentPage);
            }
        });

    }

    function searchOwner(OwnerUID, findName) {
        $('#tbody').empty();
        var i = 0;
        var promises = [];

        // Convert the search string to lowercase for case-insensitive comparison
        const findNameLower = findName.toLowerCase();

        while (i < OwnerUID.length) {
            const LotOwnerRef = ref(db, "PARK_OWNER/" + OwnerUID[i] + "/ACCOUNT");
            let ownerID = OwnerUID[i];

            // Create a promise for each get operation
            const promise = new Promise((resolve) => {
                get(LotOwnerRef).then((snapshot) => {
                    const details = snapshot.val();
               

                    // Convert details to lowercase for case-insensitive comparison
                    const firstNameLower = details.First_Name.toLowerCase();
                    const middleNameLower = details.Middle_Name.toLowerCase();
                    const lastNameLower = details.Last_Name.toLowerCase();

                    if (
                        findNameLower === firstNameLower ||
                        findNameLower === middleNameLower ||
                        findNameLower === lastNameLower
                    ) {
                        let trow = $('<tr>');                       
                        let td1 = $('<td>').text(details.Last_Name + ", " + details.First_Name + " " + details.Middle_Name);
                        let td2 = $('<td>').text(details.Application);

                        let button = $('<button>').addClass('btnView')
                            .attr({
                                'type': 'button',
                                'data-id': ownerID
                            })
                            .text('VIEW');

                        trow.append(td1, td2, $('<td>').append(button));
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
                window.location.href = '/Home/OwnerDetails';
            });
        });
    }

    function showByStat(OwnerUID, AppStat) {
        var itemsPerPage = 8;
        var currentPage = 1;

        function displayTablePage(page) {
            $('#tbody').empty();
            //console.log(page);
            var startIndex = (page - 1) * itemsPerPage;
            var endIndex = startIndex + itemsPerPage;

            for (var i = startIndex; i < endIndex && i < OwnerUID.length; i++) {
                const VehicleRef = ref(db, "PARK_OWNER/" + OwnerUID[i] + "/ACCOUNT");
                let ownerID = OwnerUID[i];

                get(VehicleRef).then((snapshot) => {
                    const details = snapshot.val();

                    if (details.Application == AppStat) {
                        let trow = $('<tr>');
                        let td1 = $('<td>').text(details.Last_Name + ", " + details.First_Name + " " + details.Middle_Name);
                        let td2 = $('<td>').text(details.Application);

                        let button = $('<button>').addClass('btnView')
                            .attr({
                                'type': 'button',
                                'data-id': ownerID
                            })
                            .text('VIEW');

                        trow.append(td1, td2, $('<td>').append(button));
                        $('#tbody').append(trow);
                    }

                });
            }

            // Event delegation for the btnView click event
            $('#tbody').on("click", ".btnView", function () {
                const uid = $(this).data("id");
                sessionStorage.setItem("uid", uid);
                window.location.href = '/Home/OwnerDetails';
            });

            $('#currentPage').text(page);

            // Hiding buttons
            if (currentPage === 1) {
                $('#prevBtn').prop("disabled", true).addClass("inactive");
            } else {
                $('#prevBtn').prop("disabled", false).removeClass("inactive");
            }

            if (startIndex + itemsPerPage >= OwnerUID.length) {
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
            if (currentPage < Math.ceil(OwnerUID.length / itemsPerPage)) {
                currentPage++;
                displayTablePage(currentPage);
            }
        });

    }




});
