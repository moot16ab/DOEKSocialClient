$(document).ready(() => {

    SDK.User.loadNav();

    const $myAttendingEventList = $("#myAttending-event-list");

    SDK.User.getMyAttendingEvents((cb, events) => {

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