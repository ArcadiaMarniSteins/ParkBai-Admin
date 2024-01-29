import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getDatabase, ref, set, push, get, update } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";

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


    //$('#payoutButton').on('click', function () {
    //    initiatePayout();
    //});

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
                const VehicleRef = ref(db, "PARK_OWNER/" + OwnerUID[i] + "/INCOME/Withdraw_Request");
                let ownerID = OwnerUID[i];
                
                get(VehicleRef).then((snapshot) => {
                    snapshot.forEach((childSnapshot) => {
                        const requestUID = childSnapshot.key;
                        const details = childSnapshot.val();
                        let amount = details.Amount;
                        let name = details.Account_Lname + ", " + details.Account_Fname + " " + details.Account_Mname;
                        
                        if (details.Request_Status == "PENDING") {
                            document.getElementById('emptyText').style.display = 'none';
                            let trow = $('<tr>');
                            let td1 = $('<td>').text(details.Account_Lname + ", " + details.Account_Fname + " " + details.Account_Mname);
                            let td2 = $('<td>').text(details.Account_Email).addClass('low');
                            let td3 = $('<td>').text("₱ " + details.Amount.toFixed(2));

                            let btnRelease = $('<button>').addClass('btnView')
                                .attr({
                                    'type': 'button',
                                    'id': 'btnRelease',
                                    'data-id': requestUID,
                                    'data-id1': amount,
                                    'data-id2': ownerID,
                                    'data-id3': name

                                })
                                .text('Release');

                            let btnReject = $('<button>').addClass('btnView')
                                .attr({
                                    'type': 'button',
                                    'id': 'btnReject',
                                    'data-id': requestUID,
                                    'data-id1': ownerID
                                })
                                .text('Reject');

                            trow.append(td1, td2, td3, $('<td>').append(btnRelease, btnReject));
                            $('#tbody').append(trow);
                        }
                        else {
                            document.getElementById('emptyText').style.display = 'block';
                        }
                    });

                });
            }

            // Event delegation for the btnView click event
            $('#tbody').on("click", "#btnRelease", function () {
                const reqUID = $(this).data("id");
                const amount = $(this).data("id1");
                const OwnerID = $(this).data("id2");
                const OwnerName = $(this).data("id3");
                //console.log(reqUID, amount, OwnerID);
                initiatePayout(reqUID, amount, OwnerID, OwnerName);
            });
            $('#tbody').on("click", "#btnReject", function () {
                const reqUID = $(this).data("id");
                const OwnerID = $(this).data("id1");
                rejectRequest(reqUID, OwnerID)
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

    async function initiatePayout(reqUID, amount, OwnerID, OwnerName) {
     
        var Balance = await GetBalance(OwnerID);
        var NewBal = Balance - amount;
        var payoutUrl = '/CashOut/InitiatePayout';

        $.ajax({
            type: 'POST',
            url: payoutUrl,
            contentType: 'application/json',
            data: JSON.stringify({ amount: amount }),
            success: function (response) {
                if (response.success) {
                    updateRequest(OwnerID, reqUID, NewBal, response.transactionId, amount, OwnerName);
                } else {
                    console.error('Error initiating payout:', response.message);
                }
            },
            error: function (error) {
                console.error('AJAX error:', error);
            }
        });

    }

    function GetBalance(UserID) {
        return new Promise((resolve, reject) => {
            const IncomeRef = ref(db, "PARK_OWNER/" + UserID + "/INCOME");
            get(IncomeRef).then((snapshot) => {
                const IncomeData = snapshot.val();
                if (snapshot.exists()) {
                    const CurrentBalance = IncomeData.Current_Balance;
                    console.log(CurrentBalance);
                    resolve(CurrentBalance);
                } else {
                    reject('File path not found in the database.');
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }


    async function updateRequest(UserID, RefNum, NewBal, transactionId, amount, OwnerName) {
        var AdminBal = await getAdminBal();
        var NewAdminBal = AdminBal - amount;
        var status = "RELEASED";
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-GB');

        const IncomeRef = ref(db, "PARK_OWNER/" + UserID + "/INCOME");
        const RequestRef = ref(db, "PARK_OWNER/" + UserID + "/INCOME/Withdraw_Request/" + RefNum);
        const AdminRef = ref(db, "ADMIN");

        await update(IncomeRef, { Current_Balance: NewBal });

        await update(RequestRef, {
            Request_Status: status,
            Release_Date: formattedDate,
            Reference_Number: transactionId,
        });

        await update(AdminRef, { general_balance: NewAdminBal });

        
        OutTrans(OwnerName,UserID, amount, formattedDate, transactionId);
        alert("Cash Released Successfully!");
        location.reload();
    }

    function getAdminBal() {
        return new Promise((resolve, reject) => {
            const AdminRef = ref(db, "ADMIN");
            get(AdminRef).then((snapshot) => {
                const AdminData = snapshot.val();
                if (snapshot.exists()) {
                    const CurrentBalance = AdminData.general_balance;
                    resolve(CurrentBalance);
                } else {
                    reject('File path not found in the database.');
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }

    //Add Transaction to Admin
    function OutTrans(OwnerName,UserID, amount, formattedDate, transactionId) {
        const adminRef = ref(db, "ADMIN/TRANSACTIONS/OWNER");
        const newReqOut = push(adminRef);

         set(newReqOut, {
      
             Name: OwnerName,
             UID: UserID,
            Amount: amount,
            Date: formattedDate,
            Ref_Num: transactionId,

        });
    }

    //REJECT REQUEST
    function rejectRequest(reqUID, OwnerID) {
        const RequestRef = ref(db, "PARK_OWNER/" + OwnerID + "/INCOME/Withdraw_Request/" + reqUID);
        var status = "REJECTED";
        if (confirm("Reject this Request?")) {
            try {
                let reason = prompt("Reason for Rejecting this Request: ", "");
                
                update(RequestRef, {
                    Request_Status: status,
                    comment: reason
                });
                window.location.href = `/Home/OwnerCashOut`;

            }
            catch (error) {
                alert('Error: ' + error);
            }
        }

        
    }
});