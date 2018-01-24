 /* Denne klasse understøtter createEvent.html og sørger for, at en bruger kan
 * oprette en begivenhed.
 * Den er udviklet med hjælp fra Jesper Bruun Hansen og Morten Dalgaard Laursen
 */

$(document).ready(() => {

    SDK.Student.loadNav();

$("#createEventButton").click(() => {

    const eventName = $("#regEventName").val();
    const location = $("#regEventLocation").val();
    const eventDate = $("#regEventDate").val();
    const description = $("#regEventDescription").val();
    const price = $("#regEventPrice").val();

if (!eventName || !eventLocation || !eventDate || !eventPrice || !eventDescription) {
    alert("Du mangler at udfylde alle felter. Gør venligst dette og prøv igen.");
}

SDK.Event.createEvent(eventName, location, eventDate, description, price, (err, data) => {
    if (err && err.xhr.status === 401) {
    $(".form-group").addClass("has-error");
}
else if (err) {
    console.log("Der gik vidst noget galt. Prøv venligst igen.")
} else {
    window.alert("Dit event er nu oprettet!");
    window.location.href = "myEvents.html";
}
        });
    });
});