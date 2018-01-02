$(document).ready(() => {

    SDK.Student.loadNav();

const $eventOverview = $("#event-overview");
const $attendingStudentsButton = $("#attending-students");

SDK.Event.getEvents((cb, events) => {
    events = JSON.parse(events);
    events.forEach((event) => {

    let eventHtml = `
                <tr>
                    <td>${event.eventName}</td>
                    <td>${event.owner}</td>
                    <td>${event.location}</td>
                    <td>${event.price}</td>
                    <td>${event.eventDate}</td>
                    <td>${event.description}</td>
                    <td><button type="button" id="attendButton" class="btn btn-success attendButton" data-event-id="${event.idEvent}">Deltag i event</button></td>
                    <td><button type="button" class="btn btn-success attendingStudentsButton" data-event-id="${event.idEvent}"
                    data-toggle="modal" data-target="#participantsModal">Se deltagere</button></td>
                </tr>
                `;

$eventOverview.append(eventHtml);
});

$(".attendButton").click(function() {
    const idEvent = $(this).data("event-id");
    const event = events.find((event) => event.idEvent === idEvent);
    console.log(event);
    SDK.Event.attendEvent(idEvent, event.eventName, event.location, event.price, event.eventDate, event.description, (err, data) => {
        if (err && err.xhr.status === 401) {
        $(".form-group").addClass("has-error")

    } else if (err) {
        console.log("Der er gået noget galt");
        window.alert("Prøv at deltag i event igen")
    } else {
        window.location.href ="myAttendingEvents.html";
    }
})
});

$(".attendingStudentsButton").click(function() {
    var idEvent = $(this).data("event-id");

    console.log(idEvent);

    SDK.Event.getAttendingStudents(idEvent, (cb, students) => {
        if (students) {
            students = JSON.parse(students);
            students.forEach((student) => {

                const studentsHtml = `
                        <tr>
                            <td>${student.firstName}</td> 
                            <td>${student.lastName}</td>
                        </tr>
                            
                    `;

            $attendingStudentsButton.append(studentsHtml)
        });
        } else {
            $("#attendingStudentsButton").html("Der gik noget galt, prøv venligst igen");
}
});
});
});
$("#clearModalText").click(function () {
    $("#attendingStudentsButton").html("");
});
});