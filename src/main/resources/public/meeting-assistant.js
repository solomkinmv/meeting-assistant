class Application {
    constructor() {
        this.pageState = new PageState();
        this.meetingClient = new MeetingClient(new RestClient());
        this.navigator = new Navigator();
        this.pageController = new MeetingPageController(this.pageState, this.meetingClient, this.navigator);
        this.mainPageController = new MainPageController(this.meetingClient, this.navigator);
        this.notFoundPageController = new NotFoundPageController();
        this.router = new Router(this.mainPageController, this.pageController, this.notFoundPageController);
    }

    run() {
        this.router.getController()
            .onLoad();
    }

}

class Navigator {

    openNotFound() {
        window.location.href = `/404`;
    }

    openMainPage() {
        window.location.href = `/`;
    }

    openMeetingPage(meetingId) {
        window.location.href = `/meeting/${meetingId}`;
    }

}

class Router {

    constructor(mainPageController, meetingPageController, notFoundPageController) {
        this.mainPageController = mainPageController;
        this.meetingPageController = meetingPageController;
        this.notFoundPageController = notFoundPageController;
    }

    getController() {
        const path = window.location.pathname;
        if (path === "/") {
            return this.mainPageController;
        } else if (path === "/404") {
            return this.notFoundPageController;
        } else if (path.startsWith("/meeting/")) {
            return this.meetingPageController;
        } else {
            return this.notFoundPageController;
        }
    }
}

class NotFoundPageController {
    onLoad() {
    }
}

class MainPageController {

    constructor(meetingClient, navigator) {
        this.meetingClient = meetingClient;
        this.navigator = navigator;
    }

    onLoad() {
        this.newMeetingButton = document.getElementById("new-meeting-button");

        this.newMeetingButton.onclick = () => {
            this.meetingClient.createMeeting()
                .then(meetingId => this.navigator.openMeetingPage(meetingId));
        }
    }

}

class PageState {
    setUsername(username) {
        sessionStorage.setItem("username", username);
    }

    getUsername() {
        return sessionStorage.getItem("username");
    }

    setMeetingId(meetingId) {
        this.meetingId = meetingId;
    }

    setMeeting(meeting) {
        console.log("Setting meeting: ", meeting);
        this.meetingId = meeting.id;
        this.userIntervals = meeting.userIntervals;
        this.intersections = meeting.intersections;
    }

    addInterval(newInterval) {
        const intervals = this.userIntervals[this.getUsername()] || [];
        intervals.push(newInterval);
        this.userIntervals[this.getUsername()] = intervals;

        console.log("Updated page state", this);
        return intervals;
    }

}

class MeetingPageController {

    constructor(pageState, meetingClient, navigator) {
        this.pageState = pageState;
        this.meetingClient = meetingClient;
        this.navigator = navigator;
    }

    onLoad() {
        this.inputIntervalFrom = document.getElementById('intervalFrom');
        this.inputIntervalTo = document.getElementById('intervalTo');
        this.inputUsername = document.getElementById('name');
        this.button = document.getElementById('addInterval');
        this.intervalsBlock = document.getElementById('intervals')

        this.button.onclick = this.addInterval.bind(this);
        this.inputUsername.onchange = this.updateUsername.bind(this);

        let path = window.location.pathname.split('/');
        let meetingId = path[path.length - 1];
        if (meetingId) {
            console.log("Page with meeting id: ", meetingId);
            this.meetingClient.getMeeting(meetingId)
                .then(meeting => this.pageState.setMeeting(meeting))
                .then(() => this.renderIntervals())
                .catch(error => {
                    console.log(`Failed to get meeting ${meetingId}: `, error);
                    this.navigator.openNotFound();
                });
        } else {
            throw new Error('No meeting id found');
        }

        this.setName(this.pageState.getUsername() || this.promptName());
    }

    updateUsername() {
        this.pageState.setUsername(this.inputUsername.value);
    }

    promptName() {
        return prompt("Enter your name");
    }

    setName(username) {
        this.pageState.setUsername(username);
        this.inputUsername.value = username;
        console.log("Username: ", username);
    }

    isMainPage() {
        return window.location.pathname === '/';
    }

    openMeetingPage(meetingId) {
        window.location.href = `/meeting/${meetingId}`;
        this.pageState.setMeetingId(meetingId);
    }

    addInterval() {
        const newInterval = new Interval(this.parseDate(this.inputIntervalFrom.value), this.parseDate(this.inputIntervalTo.value));
        const intervals = this.pageState.addInterval(newInterval);
        this.meetingClient.setIntervals(this.pageState.meetingId, this.pageState.getUsername(), intervals)
            .then(meeting => this.pageState.setMeeting(meeting))
            .then(() => this.renderIntervals())
            .catch(error => console.log("Failed to update intervals for user: ", error));
    }

    parseDate(dateString) {
        return new Date(dateString).getTime();
    }

    renderIntervals() {
        this.intervalsBlock.innerHTML = '';

        const intervalsHeaderElement = document.createElement('h2');
        intervalsHeaderElement.innerText = 'Intervals:';
        this.intervalsBlock.appendChild(intervalsHeaderElement);

        for (const [username, perUserIntervals] of Object.entries(this.pageState.userIntervals)) {
            const usernameElement = document.createElement('h3');
            usernameElement.innerText = username;
            this.intervalsBlock.appendChild(usernameElement);

            for (const interval of perUserIntervals) {
                const intervalElement = document.createElement('div');
                intervalElement.innerText = new Date(interval.from).toLocaleString() + ' - ' + new Date(interval.to).toLocaleString();
                this.intervalsBlock.appendChild(intervalElement);
            }
        }

        const intersectionsHeaderElement = document.createElement('h2');
        intersectionsHeaderElement.innerText = 'Intersections:';
        this.intervalsBlock.appendChild(intersectionsHeaderElement);
        for (const interval of this.pageState.intersections) {
            const intervalElement = document.createElement('div');
            intervalElement.innerText = new Date(interval.from).toLocaleString() + ' - ' + new Date(interval.to).toLocaleString();
            this.intervalsBlock.appendChild(intervalElement);
        }
    }
}

class Interval {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
}

class Meeting {
    id;
    userIntervals;
    intersections;
}

class MeetingClient {

    constructor(restClient) {
        this.restClient = restClient;
    }

    async createMeeting() {
        const meeting = await this.restClient.post('/api/meetings/');
        console.log('Received response after meeting creation', meeting);
        return meeting['id'];
    }

    async setIntervals(meetingId, username, intervals) {
        const meeting = await this.restClient.put(`/api/meetings/${meetingId}/intervals/${username}`,
            {intervals: intervals});
        console.log('Received response on update of intervals', meeting);
        return meeting;
    }

    async getMeeting(meetingId) {
        const meeting = await this.restClient.get(`/api/meetings/${meetingId}`);
        console.log('Received response on meeting retrieval', meeting);
        return meeting;
    }
}

class RestClient {

    async get(url) {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Received response on get', data);
        return data;
    }

    async post(url, body) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        console.log('Received response on post', data);
        return data;
    }

    async put(url, body) {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        console.log('Received response on put', data);
        return data;
    }

}

new Application().run();

/*
TODO:
* Merge intervals on client side
* Show intersections if only one user
* Don't ask username one more time if already set
* Add meting info if any
* Handle exception if failed to set intervals
* Eliminate promise chaining
* Add option to delete intervals
* Read response to Meeting object
* Display users in persistent order
* Make general 404 page and not found meeting page
* Support explicit time zones
 */

