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