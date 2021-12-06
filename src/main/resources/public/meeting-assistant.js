const inputIntervalFrom = document.getElementById('intervalFrom');
const inputIntervalTo = document.getElementById('intervalTo');
const inputUsername = document.getElementById('name');
const button = document.getElementById('addInterval');
const intervalsBlock = document.getElementById('intervals')

let meetingId;
let userIntervals = {};

function parseInput(dateString) {
    return new Date(dateString).getTime();
}

async function addInterval(ev) {
    const username = inputUsername.value;
    const from = parseInput(inputIntervalFrom.value);
    const to = parseInput(inputIntervalTo.value);
    const newInterval = new Interval(from, to);

    const intervals = userIntervals[username] || [];
    intervals.push(newInterval);
    userIntervals[username] = intervals;
    console.log("User intervals: ", userIntervals);

    console.log(`Updating user intervals with following path "/meetings/${meetingId}/intervals/${username}"`, intervals);
    const jsonBody = JSON.stringify({intervals: intervals});
    console.log("Update intervals body: " + jsonBody);
    const response = await fetch(`/meetings/${meetingId}/intervals/${username}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonBody
    });
    const data = await response.json();
    console.log('Received response on update of intervals', data);
    intervalsBlock.innerText = JSON.stringify(data);
    return data;
}

button.onclick = addInterval;

async function createMeeting() {
    const response = await fetch('/meetings/', {
        method: 'POST'
    });
    let data = await response.json();
    console.log('Received response after meeting creation', data);
    intervalsBlock.innerText = JSON.stringify(data);
    return data['id'];
}

createMeeting().then(id => meetingId = id);

class Interval {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
}

(function(window, Calendar) {
    var cal = new Calendar('#calendar', {
        defaultView: 'week',
        taskView: true,
        useCreationPopup: false,
        useDetailPopup: true,
        template: {
            monthDayname: function(dayname) {
                return '<span class="calendar-week-dayname-name">' + dayname.label + '</span>';
            },
            locationPlaceholder: function (param) {
                console.log(param);
                return "location placeholder"
            },
            popupDetailLocation: function (param) {
                console.log(param);
                return "location detail popup";
            }
        }
    });

    cal.on('beforeCreateSchedule', function(e) {
        console.log('beforeCreateSchedule', e);
        /* step1. open custom edit popup */
        const title = prompt('Schedule', '@suvrity\'s birthday');
        var schedule = {
            id: +new Date(),
            title: title,
            isAllDay: true,
            start: e.start,
            end: e.end,
            category:  'allday'
        };
        /* step2. save schedule */
        cal.createSchedules([schedule]);
        /* step3. clear guide element */
        e.guide.clearGuideElement();
    });

    cal.on('beforeUpdateSchedule', function(event) {
        var schedule = event.schedule;
        var changes = event.changes;

        cal.updateSchedule(schedule.id, schedule.calendarId, changes);
    });

    cal.on('clickSchedule', function(event) {
        var schedule = event.schedule;

        // focus the schedule
        if (lastClickSchedule) {
            cal.updateSchedule(lastClickSchedule.id, lastClickSchedule.calendarId, {
                isFocused: false
            });
        }
        cal.updateSchedule(schedule.id, schedule.calendarId, {
            isFocused: true
        });

        lastClickSchedule = schedule;

        // open detail view
    });


    cal.createSchedules([
        {
            id: '1',
            calendarId: '1',
            title: 'my schedule',
            category: 'time',
            dueDateClass: '',
            start: '2021-12-04T22:30:00+09:00',
            end: '2021-12-05T02:30:00+09:00'
        },
        {
            id: '2',
            calendarId: '1',
            title: 'second schedule',
            category: 'time',
            dueDateClass: '',
            start: '2021-12-01T17:30:00+09:00',
            end: '2021-12-01T17:31:00+09:00',
            isReadOnly: true    // schedule is read-only
        }
    ]);

    function onClickMenu(e) {
        var target = $(e.target).closest('a[role="menuitem"]')[0];
        var action = getDataAction(target);
        var options = cal.getOptions();
        var viewName = '';

        console.log(target);
        console.log(action);
        switch (action) {
            case 'toggle-daily':
                viewName = 'day';
                break;
            case 'toggle-weekly':
                viewName = 'week';
                break;
            case 'toggle-monthly':
                options.month.visibleWeeksCount = 0;
                viewName = 'month';
                break;
            case 'toggle-weeks2':
                options.month.visibleWeeksCount = 2;
                viewName = 'month';
                break;
            case 'toggle-weeks3':
                options.month.visibleWeeksCount = 3;
                viewName = 'month';
                break;
            case 'toggle-narrow-weekend':
                options.month.narrowWeekend = !options.month.narrowWeekend;
                options.week.narrowWeekend = !options.week.narrowWeekend;
                viewName = cal.getViewName();

                target.querySelector('input').checked = options.month.narrowWeekend;
                break;
            case 'toggle-start-day-1':
                options.month.startDayOfWeek = options.month.startDayOfWeek ? 0 : 1;
                options.week.startDayOfWeek = options.week.startDayOfWeek ? 0 : 1;
                viewName = cal.getViewName();

                target.querySelector('input').checked = options.month.startDayOfWeek;
                break;
            case 'toggle-workweek':
                options.month.workweek = !options.month.workweek;
                options.week.workweek = !options.week.workweek;
                viewName = cal.getViewName();

                target.querySelector('input').checked = !options.month.workweek;
                break;
            default:
                break;
        }

        cal.setOptions(options, true);
        cal.changeView(viewName, true);

        setDropdownCalendarType();
        setRenderRangeText();
    }


    function onClickNavi(e) {
        var action = getDataAction(e.target);

        switch (action) {
            case 'move-prev':
                cal.prev();
                break;
            case 'move-next':
                cal.next();
                break;
            case 'move-today':
                cal.today();
                break;
            default:
                return;
        }

        setRenderRangeText();
    }

    function setDropdownCalendarType() {
        var calendarTypeName = document.getElementById('calendarTypeName');
        var calendarTypeIcon = document.getElementById('calendarTypeIcon');
        var options = cal.getOptions();
        var type = cal.getViewName();
        var iconClassName;

        if (type === 'day') {
            type = 'Daily';
            iconClassName = 'calendar-icon ic_view_day';
        } else if (type === 'week') {
            type = 'Weekly';
            iconClassName = 'calendar-icon ic_view_week';
        } else if (options.month.visibleWeeksCount === 2) {
            type = '2 weeks';
            iconClassName = 'calendar-icon ic_view_week';
        } else if (options.month.visibleWeeksCount === 3) {
            type = '3 weeks';
            iconClassName = 'calendar-icon ic_view_week';
        } else {
            type = 'Monthly';
            iconClassName = 'calendar-icon ic_view_month';
        }

        calendarTypeName.innerHTML = type;
        calendarTypeIcon.className = iconClassName;
    }

    function currentCalendarDate(format) {
        var currentDate = moment([cal.getDate().getFullYear(), cal.getDate().getMonth(), cal.getDate().getDate()]);

        return currentDate.format(format);
    }

    function setRenderRangeText() {
        var renderRange = document.getElementById('renderRange');
        var options = cal.getOptions();
        var viewName = cal.getViewName();

        var html = [];
        if (viewName === 'day') {
            html.push(currentCalendarDate('YYYY.MM.DD'));
        } else if (viewName === 'month' &&
            (!options.month.visibleWeeksCount || options.month.visibleWeeksCount > 4)) {
            html.push(currentCalendarDate('YYYY.MM'));
        } else {
            html.push(moment(cal.getDateRangeStart().getTime()).format('YYYY.MM.DD'));
            html.push(' ~ ');
            html.push(moment(cal.getDateRangeEnd().getTime()).format(' MM.DD'));
        }
        renderRange.innerHTML = html.join('');
    }

    function getDataAction(target) {
        return target.dataset ? target.dataset.action : target.getAttribute('data-action');
    }

    function setEventListener() {
        $('#menu-navi').on('click', onClickNavi);
        $('.dropdown-menu a[role="menuitem"]').on('click', onClickMenu);
    }

    setDropdownCalendarType();
    setEventListener();
    setRenderRangeText();
})(window, tui.Calendar);