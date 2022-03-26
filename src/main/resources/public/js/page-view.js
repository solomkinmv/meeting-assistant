function renderCalendars(calendars) {
    let calendarListElement = document.getElementById('calendarList');
    let html = [];
    calendars.forEach(function(calendar) {
        html.push('<div class="lnb-calendars-item"><label>' +
            '<input type="checkbox" class="tui-full-calendar-checkbox-round" value="' + calendar.id + '" checked>' +
            '<span style="border-color: ' + calendar.borderColor + '; background-color: ' + calendar.borderColor + ';"></span>' +
            '<span>' + calendar.name + '</span>' +
            '</label></div>'
        );
    });
    calendarListElement.innerHTML = html.join('\n');
}

function renderRangeText(cal) {
    let renderRange = document.getElementById('renderRange');
    let viewName = cal.getViewName();

    let html = [];
    if (viewName === 'month') {
        html.push(currentCalendarDate(cal, 'YYYY.MM'));
    } else {
        html.push(moment(cal.getDateRangeStart().getTime()).format('YYYY.MM.DD'));
        html.push(' ~ ');
        html.push(moment(cal.getDateRangeEnd().getTime()).format(' MM.DD'));
    }
    renderRange.innerHTML = html.join('');
}

function currentCalendarDate(cal, format) {
    let currentDate = moment([cal.getDate().getFullYear(), cal.getDate().getMonth(), cal.getDate().getDate()]);

    return currentDate.format(format);
}

function refreshScheduleVisibility(cal) {
    console.log("Refresh with calendar", cal);
    var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));

    calendarList.forEach(function(calendar) {
        cal.toggleSchedules(calendar.id, !calendar.checked, false);
    });

    cal.render(true);

    calendarElements.forEach(function(input) {
        var span = input.nextElementSibling;
        span.style.backgroundColor = input.checked ? span.style.borderColor : 'transparent';
    });
}
