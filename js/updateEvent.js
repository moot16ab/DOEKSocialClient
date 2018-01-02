$(document).ready(() => {

    SDK.Student.loadNav();

    $("#update-myevent-button").click(() => {

        const eventName = $("#updateEventName").val();
        const location = $("#updateLocation").val();
        const eventDate = $("#updateEventDate").val();
        const description = $("#updateDescription").val();
        const price = $("#updatePrice").val();
        const idEvent = SDK.Link.getParameterByName("eventId");

        SDK.Event.updateEvent(eventName, location, eventDate, description, price, idEvent, (err, data) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error")
            }
            else if (err) {
                alert("Der gik vidst noget galt - prøv venligst igen.")
            } else {
                alert("Succes! Dit event er nu blevet opdateret.");
                window.location.href = "myEvents.html";
            }
        });
    });
});