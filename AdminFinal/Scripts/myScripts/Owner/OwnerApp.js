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
    



    const dbRef = ref(db, 'PARK_OWNER');

    //GETTING THE OWNERS UIDS
    get(dbRef).then((snapshot) => {
        const OwnerUID = [];

        snapshot.forEach((childSnapshot) => {
            // Collect the child IDs (keys)
            const childId = childSnapshot.key;
            OwnerUID.push(childId);
            

        });
        //console.log("Child IDs:", OwnerUID);
        getOwner(OwnerUID);
    });

    //GETTING THE VEHICLE PLATE NUMBER
    function getOwner(OwnerUID) {
        var itemsPerPage = 8;
        var currentPage = 1;
        var table = $("#table");
        var tbody = $('#tbody');

        function displayTablePage(page) {
            tbody.empty();
            var startIndex = (page - 1) * itemsPerPage;
            var endIndex = startIndex + itemsPerPage;
            var resultRow = 0;

            for (var i = startIndex; i < endIndex && i < OwnerUID.length; i++) {
                const OwnerRef = ref(db, "PARK_OWNER/" + OwnerUID[i] + "/ACCOUNT" );
                let ownerID = OwnerUID[i];
               // console.log(ownerID);

                get(OwnerRef).then((snapshot) => {
                    
                        const details = snapshot.val();
                       // console.log(details);
                    if (details.Application == "PENDING" || details.Application == "pending") {
                        document.getElementById('emptyText').style.display = 'none';
                        let trow = $('<tr>');
                        let td2 = $('<td>').text(details.Last_Name + ", " + details.First_Name + " " + details.Middle_Name);
                        let td3 = $('<td>').text(details.Application);

                        let button = $('<button>').addClass('btnView')
                            .attr({
                                'type': 'button',
                                'data-id': ownerID

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
            }

            // Event delegation for the btnView click event
            tbody.on("click", ".btnView", function () {
                const uid = $(this).data("id");
                sessionStorage.setItem("uid", uid);
                //console.log(uid);
                window.location.href = `/Home/OwnerAppDet`;
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
            var totalPages = Math.ceil(OwnerUID.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                displayTablePage(currentPage);
            }
        });
    }


});
