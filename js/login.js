$(document).ready(() => {

  SDK.Student.loadNav();

  $("#login-button").click(() => {

    const studentemail = $("#inputEmail").val();
    const studentpassword = $("#inputPassword").val();

    SDK.Student.login(studentemail, studentpassword, (err, data) => {
      if (err && err.xhr.status === 401) {
        $(".form-group").addClass("has-error");
      }
      else if (err){
        console.log("Der gik noget galt - prøv venligst igen")
      } else {
        window.location.href = "index.html";
      }
    });

  });

});