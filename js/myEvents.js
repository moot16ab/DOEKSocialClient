/* Denne klasse understøtter myEvents.html og sørger for, at en bruger kan
 * se sine oprettede begivenheder
 * Den er udviklet med udgangspunkt i Jesper Bruun Hansen og Morten Dalgaard Laursens repo fra øvelsestimerne:
 * https://github.com/Distribuerede-Systemer-2017/javascript-client/.
 */

$(document).ready(() => {

    const $myCreatedEvents = $("#myCreatedEvents");
    const $isEventsEmpty = $("#isEventsEmpty");
    $isEventsEmpty.hide();

    SDK.Event.myCreatedEvents((err, events) => {
        events = JSON.parse(events);

        if (events.length === 0) {
            $isEventsEmpty.show();
        }

        events.forEach((event) => {

            const myCreatedEventsHtml = `
<div class="container">
    <table class="table">
 
        <tbody>
            <tr>
            <td>${event.owner}</td>
            <td>${event.eventName}</td>
            <td>${event.description}</td>
            <td>${event.location}</td>
            <td>${event.eventDate}</td>
            <td>${event.price}</td>
            <td><button class="btn deleteButton btn-default" data-id-delete="${event.idEvent}">Slet Begivenhed?</button></td>
            <td><a href="updateEvent.html?eventId=${event.idEvent}"<button id="updateButton" class="btn btn-default">Opdater begivenhed</button></a></td>
            </tr>
        </tbody>
        
    </table>
</div> `;
            $myCreatedEvents.append(myCreatedEventsHtml);
        });

        $(".delete-my-event-Button").click(function () {
            const idEvent = $(this).data("delete-event-id");
            const event = events.find((event) => event.idEvent === idEvent);

            SDK.Event.deleteEvent(idEvent, event.eventName, event.location, event.price, event.eventDate, event.description, (err, data) => {
                if (err && err.xhr.status === 401) {
                    $(".form-group").addClass("Error - 401")
                }
                else if (err) {
                    window.alert("Event kunne ikke slettes - prøv venligst igen")
                } else {
                    window.location.href = "myEvents.html";
                }
            });
        });
    });
});