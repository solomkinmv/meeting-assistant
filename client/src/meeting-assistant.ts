class Application {
    router: Router;

    constructor() {
        const pageState = new PageState();
        const meetingClient = new MeetingClient(new RestClient());
        const navigator = new AppNavigator();
        const pageController = new MeetingPageController(pageState, meetingClient, navigator);
        const mainPageController = new MainPageController(meetingClient, navigator);
        const notFoundPageController = new NotFoundPageController();
        this.router = new Router(mainPageController, pageController, notFoundPageController);
    }

    run() {
        this.router.getController()
            .onLoad();
    }

}

class AppNavigator {

    openNotFound() {
        window.location.href = `/404`;
    }

    openMainPage() {
        window.location.href = `/`;
    }

    openMeetingPage(meetingId: string) {
        window.location.href = `/meeting/${meetingId}`;
    }

}

class Router {
    mainPageController: MainPageController;
    meetingPageController: MeetingPageController;
    notFoundPageController: NotFoundPageController;

    constructor(mainPageController: MainPageController,
                meetingPageController: MeetingPageController,
                notFoundPageController: NotFoundPageController) {
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
    meetingClient: MeetingClient;
    navigator: AppNavigator;
    newMeetingButton: HTMLElement;

    constructor(meetingClient: MeetingClient, navigator: AppNavigator) {
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
    meetingId: string;
    userIntervals: Map<String, Interval[]>;
    intersections: Array<Interval>;

    setUsername(username: string) {
        sessionStorage.setItem("username", username);
    }

    getUsername(): string {
        return sessionStorage.getItem("username");
    }

    setMeetingId(meetingId: string) {
        this.meetingId = meetingId;
    }

    setMeeting(meeting: Meeting) {
        console.log("Setting meeting: ", meeting);
        this.meetingId = meeting.id;
        this.userIntervals = meeting.userIntervals;
        this.intersections = meeting.intersections;
    }

    addInterval(newInterval: Interval) {
        const intervals = this.userIntervals.get(this.getUsername()) || [];
        intervals.push(newInterval);
        intervals.sort((a, b) => a.from - b.from);

        const updatedIntervals = [];
        updatedIntervals.push(intervals[0]);

        for (let i = 1; i < intervals.length; i++) {
            if (intervals[i].from <= updatedIntervals[updatedIntervals.length - 1].to) {
                updatedIntervals[updatedIntervals.length - 1].to = Math.max(updatedIntervals[updatedIntervals.length - 1].to, intervals[i].to);
            } else {
                updatedIntervals.push(intervals[i]);
            }
        }

        this.userIntervals.set(this.getUsername(), updatedIntervals);

        console.log("Updated page state after inserting interval", newInterval, this);
        return updatedIntervals;
    }

}

class MeetingPageController {
    pageState: PageState;
    meetingClient: MeetingClient;
    navigator: AppNavigator;
    inputIntervalFrom: HTMLInputElement;
    inputIntervalTo: HTMLInputElement;
    inputUsername: HTMLInputElement;
    intervalsBlock: HTMLElement;
    button: HTMLElement;

    constructor(pageState: PageState, meetingClient: MeetingClient, navigator: AppNavigator) {
        this.pageState = pageState;
        this.meetingClient = meetingClient;
        this.navigator = navigator;
    }

    onLoad() {
        this.inputIntervalFrom = document.getElementById('intervalFrom') as HTMLInputElement;
        this.inputIntervalTo = document.getElementById('intervalTo') as HTMLInputElement;
        this.inputUsername = document.getElementById('name') as HTMLInputElement;
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

    setName(username: string) {
        this.pageState.setUsername(username);
        this.inputUsername.value = username;
        console.log("Username: ", username);
    }

    isMainPage() {
        return window.location.pathname === '/';
    }

    openMeetingPage(meetingId: string) {
        window.location.href = `/meeting/${meetingId}`;
        this.pageState.setMeetingId(meetingId);
    }

    addInterval() {
        const newInterval = new Interval(this.parseDate(this.inputIntervalFrom.value), this.parseDate(this.inputIntervalTo.value));
        if (newInterval.from >= newInterval.to) {
            alert("Invalid interval");
            return;
        }
        const intervals = this.pageState.addInterval(newInterval);
        this.meetingClient.setIntervals(this.pageState.meetingId, this.pageState.getUsername(), intervals)
            .then(meeting => this.pageState.setMeeting(meeting))
            .then(() => this.renderIntervals())
            .catch(error => console.log("Failed to update intervals for user: ", error));
    }

    parseDate(dateString: string): number {
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
    from: number;
    to: number;

    constructor(from: number, to: number) {
        this.from = from;
        this.to = to;
    }
}

class Meeting {
    id: string;
    userIntervals: Map<String, Interval[]>;
    intersections: [Interval];
}

class MeetingClient {
    restClient: RestClient;

    constructor(restClient: RestClient) {
        this.restClient = restClient;
    }

    async createMeeting() {
        const meeting = await this.restClient.post('/api/meetings/', null);
        console.log('Received response after meeting creation', meeting);
        return meeting['id'];
    }

    async setIntervals(meetingId: string, username: string, intervals: Interval[]) {
        const meeting = await this.restClient.put(`/api/meetings/${meetingId}/intervals/${username}`,
            {intervals: intervals});
        console.log('Received response on update of intervals', meeting);
        return meeting;
    }

    async getMeeting(meetingId: string) {
        const meeting = await this.restClient.get(`/api/meetings/${meetingId}`);
        console.log('Received response on meeting retrieval', meeting);
        return meeting;
    }
}

class RestClient {

    async get(url: string) {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Received response on get', data);
        return data;
    }

    async post(url: string, body: any) {
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

    async put(url: string, body: any) {
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
