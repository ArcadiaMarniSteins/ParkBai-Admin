$(document).ready(function () {
    $("#logout").click(function (e) {
        e.preventDefault();
        if (confirm("Confirm Log Out?")) {
            $.post("../Home/Logout", function (res) {
                if (res.success) {
                    window.location.href = "../Home/Login";
                    location.reload();
                }
            });
        } else {
            // Handle cancelation
        }
    });
});
