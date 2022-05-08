import {MeetingClient, RestClient} from "./meeting-client";
import {Interval} from "./model/interval";
import {Meeting} from "./model/meeting";
import {Controller} from "./controller/controller";
import {AppNavigator} from "./app-navigator";

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

class MeetingPageController implements Controller {
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
        console.debug("Loading meeting controller")
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

// new Application().run();
new MeetingPageController(new PageState(), new MeetingClient(new RestClient()), new AppNavigator())
    .onLoad();
