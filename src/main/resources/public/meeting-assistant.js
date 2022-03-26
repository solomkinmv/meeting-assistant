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

function parseUsername() {
    return inputUsername.value;
}

async function addParsedInterval(from, to) {
    const newInterval = new Interval(from, to);
    const username = parseUsername();

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
    const cal = new Calendar('#calendar', {
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
        e.title = parseUsername();
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

    cal.setCalendars(calendarList);
    refreshScheduleVisibility(cal);


    async function saveNewSchedule(scheduleData) {
        const calendar = scheduleData.calendar || findCalendar(scheduleData.calendarId);
        const schedule = {
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

        refreshScheduleVisibility(cal);

        await addParsedInterval(new Date(scheduleData.start).getTime(), new Date(scheduleData.end).getTime());
    }

    function onChangeCalendars(e) {
        var calendarId = e.target.value;
        var checked = e.target.checked;
        var viewAll = document.querySelector('.lnb-calendars-item input');
        var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));
        var allCheckedCalendars = true;

        if (calendarId === 'all') {
            allCheckedCalendars = checked;

            calendarElements.forEach(function (input) {
                var span = input.parentNode;
                input.checked = checked;
                span.style.backgroundColor = checked ? span.style.borderColor : 'transparent';
            });

            CalendarList.forEach(function (calendar) {
                calendar.checked = checked;
            });
        } else {
            findCalendar(calendarId).checked = checked;

            allCheckedCalendars = calendarElements.every(function (input) {
                return input.checked;
            });

            if (allCheckedCalendars) {
                viewAll.checked = true;
            } else {
                viewAll.checked = false;
            }
        }
    }

    function onChangeCalendars(e) {
        console.log("On change calendars")
        var calendarId = e.target.value;
        var checked = e.target.checked;
        var viewAll = document.querySelector('.lnb-calendars-item input');
        var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));
        var allCheckedCalendars = true;

        if (calendarId === 'all') {
            allCheckedCalendars = checked;

            calendarElements.forEach(function(input) {
                var span = input.parentNode;
                input.checked = checked;
                span.style.backgroundColor = checked ? span.style.borderColor : 'transparent';
            });

            calendarList.forEach(function(calendar) {
                calendar.checked = checked;
            });
        } else {
            findCalendar(calendarId).checked = checked;

            allCheckedCalendars = calendarElements.every(function(input) {
                return input.checked;
            });

            if (allCheckedCalendars) {
                viewAll.checked = true;
            } else {
                viewAll.checked = false;
            }
        }

        refreshScheduleVisibility(cal);
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
        renderRangeText(cal);
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

        renderRangeText(cal);
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

    function createNewSchedule(event) {
        console.log("create new schedule");
        var start = event.start ? new Date(event.start.getTime()) : new Date();
        var end = event.end ? new Date(event.end.getTime()) : moment().add(1, 'hours').toDate();

        cal.openCreationPopup({
            start: start,
            end: end
        });
    }

    function getDataAction(target) {
        return target.dataset ? target.dataset.action : target.getAttribute('data-action');
    }

    function setEventListener() {
        $('#menu-navi').on('click', onClickNavi);
        $('.dropdown-menu a[role="menuitem"]').on('click', onClickMenu);
        $('#lnb-calendars').on('change', onChangeCalendars);

        $('#btn-new-schedule').on('click', createNewSchedule);
    }

    setDropdownCalendarType();
    setEventListener();
    renderCalendars(calendarList);
})(window, tui.Calendar);
