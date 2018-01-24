/* Denne klasse understøtter myAttendingEvents.html og sørger for, at en bruger kan se
 * de begivenheder den deltager i.
 * Den er udviklet med hjælp fra Jesper Bruun Hansen og Morten Dalgaard Laursen.
 */

$(document).ready(() => {

    SDK.Student.loadNav();

    const $myAttendingEventList = $("#myAttending-event-list");

    SDK.Student.getMyAttendingEvents((cb, events) => {

        events = JSON.parse(events);
        events.forEach(event => {

            let eventHtml = `

            <tr>
                <td>${event.eventName}</td>
                <td>${event.owner}</td>
                <td>${event.location}</td>
                <td>${event.eventDate}</td>
                <td>${event.description}</td>
            </tr>
            
            `;

            $myAttendingEventList.append(eventHtml);

        });
    });
});