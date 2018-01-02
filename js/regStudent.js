$(document).ready(() => {

    SDK.Student.loadNav();

    $("#regButton").click(() => {

        const studentfirstName = $("#regFirstName").val();
        const studentlastName = $("#regLastName").val();
        const studentemail = $("#regEmail").val();
        const studentpassword = $("#regPassword").val();
        const verifyPassword = $("#verifyPassword").val();

        if (!studentfirstName || !studentlastName || !studentemail || !studentpassword || !verifyPassword) {
            window.alert("Du mangler vidst at udfylde nogle felter - gør venligst dette før du fortsætter.")

        } else {
            if (studentpassword !== verifyPassword) {
                window.alert("Du har indtastet to forskellige passwords - skriv venligst det samme password begge steder.");
                return;
            } else {
                if (studentpassword.valueOf() === verifyPassword.valueOf()) {
                    SDK.Student.register(studentfirstName, studentlastName, studentemail, studentpassword, verifyPassword, (err, data) => {
                        if (err && err.xhr.status === 400) {
                            $(".form-group").addClass("has-error");
            }

            SDK.Student.register(studentfirstName, studentlastName, studentemail, studentpassword, verifyPassword, (err, data) => {
                if (err && err.xhr.status === 401) {
                    $(".form-group").addClass("has-error");
                }
                else if (err) {
                    console.log("Der gik noget galt - prøv venligst igen.")
                } else {
                    window.alert("Du kan nu logge ind med din oprettede bruger.");
                    window.location.href = "login.html";
                }
            });
        }
    });
});