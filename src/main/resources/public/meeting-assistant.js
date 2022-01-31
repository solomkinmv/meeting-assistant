const inputIntervalFrom = document.getElementById('intervalFrom');
const inputIntervalTo = document.getElementById('intervalTo');
const inputUsername = document.getElementById('name');
const button = document.getElementById('addInterval');
const intervalsBlock = document.getElementById('intervals')

let meetingId;
let userIntervals = {};

const meetingClient = new MeetingClient();

function parseInput(dateString) {
    return new Date(dateString).getTime();
}

async function addInterval(ev) {
    const from = parseInput(inputIntervalFrom.value);
    const to = parseInput(inputIntervalTo.value);
    return addParsedInterval(from, to);
}

async function addParsedInterval(from, to) {
    const newInterval = new Interval(from, to);
    const username = inputUsername.value;

    const intervals = userIntervals[username] || [];
    intervals.push(newInterval);
    userIntervals[username] = intervals;
    console.log("User intervals: ", userIntervals);

    const data = meetingClient.addInterval(meetingId, username, intervals);
    intervalsBlock.innerText = JSON.stringify(data);
    return data;
}

button.onclick = addInterval;

meetingClient.createMeeting().then(id => meetingId = id);

(function(window, Calendar) {
    var cal = new Calendar('#calendar', {
        defaultView: 'week',
        taskView: true,
        useCreationPopup: true,
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

    cal.on('beforeCreateSchedule', async function (e) {
        console.log('beforeCreateSchedule', e);
        e.title = "user-name-schedule"
        await saveNewSchedule(e);
    });

    cal.on('beforeUpdateSchedule', function(event) {
        var schedule = event.schedule;
        var changes = event.changes;

        cal.updateSchedule(schedule.id, schedule.calendarId, changes);
    });

    cal.on('clickSchedule', function(event) {
        console.log("clickSchedule");
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

    async function saveNewSchedule(scheduleData) {
        var calendar = scheduleData.calendar || findCalendar(scheduleData.calendarId);
        var schedule = {
            id: String(chance.guid()),
            title: scheduleData.title,
            isAllDay: scheduleData.isAllDay,
            start: scheduleData.start,
            end: scheduleData.end,
            category: scheduleData.isAllDay ? 'allday' : 'time',
            dueDateClass: '',
            color: calendar.color,
            bgColor: calendar.bgColor,
            dragBgColor: calendar.bgColor,
            borderColor: calendar.borderColor,
            location: scheduleData.location,
            isPrivate: scheduleData.isPrivate,
            state: scheduleData.state
        };
        if (calendar) {
            schedule.calendarId = calendar.id;
            schedule.color = calendar.color;
            schedule.bgColor = calendar.bgColor;
            schedule.borderColor = calendar.borderColor;
        }

        cal.createSchedules([schedule]);

        refreshScheduleVisibility();

        await addParsedInterval(new Date(scheduleData.start).getTime(), new Date(scheduleData.end).getTime());
    }

    function refreshScheduleVisibility() {
        var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));

        CalendarList.forEach(function(calendar) {
            cal.toggleSchedules(calendar.id, !calendar.checked, false);
        });

        cal.render(true);

        calendarElements.forEach(function(input) {
            var span = input.nextElementSibling;
            span.style.backgroundColor = input.checked ? span.style.borderColor : 'transparent';
        });
    }

    function onClickMenu(e) {
        var target = $(e.target).closest('a[role="menuitem"]')[0];
        var action = getDataAction(target);
        var options = cal.getOptions();
        var viewName = '';

        console.log(target);
        console.log(action);
        switch (action) {
            case 'toggle-weekly':
                viewName = 'week';
                break;
            case 'toggle-monthly':
                options.month.visibleWeeksCount = 0;
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
        var type = cal.getViewName();
        var iconClassName;

        if (type === 'week') {
            type = 'Weekly';
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
        if (viewName === 'month') {
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
