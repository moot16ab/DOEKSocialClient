/* Denne klasse understøtter updateEvent.html og sørger for, at en bruger kan
 * opdatere sin egen begivenhed.
 * Den er udviklet med udgangspunkt i Jesper Bruun Hansen og Morten Dalgaard Laursens repo fra øvelsestimerne:
 * https://github.com/Distribuerede-Systemer-2017/javascript-client/
 */

$(document).ready(() => {

    SDK.Student.loadNav();

    $("#update-myevent-button").click(() => {

        const regEventName = $("#updateEventName").val();
        const regLocation = $("#updateLocation").val();
        const regEventDate = $("#updateEventDate").val();
        const regDescription = $("#updateDescription").val();
        const regPrice = $("#pdatePrice").val();
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