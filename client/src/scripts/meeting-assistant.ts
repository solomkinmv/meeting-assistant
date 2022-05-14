import {MeetingClient, RestClient} from "./meeting-client"
import {Interval} from "./model/interval"
import {Meeting} from "./model/meeting"
import {Controller} from "./controller/controller"
import {AppNavigator} from "./app-navigator"

class MeetingService {
    public meetingId?: string
    public userIntervals: Record<string, ReadonlyArray<Interval>>
    public intersections: ReadonlyArray<Interval>
    private readonly meetingClient: MeetingClient


    constructor(meetingClient: MeetingClient) {
        this.userIntervals = {};
        this.intersections = [];
        this.meetingClient = meetingClient;
    }

    public getUsername(): string {
        return sessionStorage.getItem("username") || ""
    }

    public setUsername(username: string) {
        sessionStorage.setItem("username", username)
    }

    public setMeeting(meeting: Meeting) {
        console.log("Setting meeting: ", meeting)
        this.meetingId = meeting.id
        this.userIntervals = meeting.userIntervals
        this.intersections = meeting.intersections
    }

    public addInterval(newInterval: Interval): ReadonlyArray<Interval> {
        const intervals = this.getCurrentUserIntervals()
            .concat(newInterval)
            .sort((a, b) => a.from - b.from)

        const updatedIntervals: Interval[] = []
        updatedIntervals.push(intervals[0])

        for (let i = 1; i < intervals.length; i++) {
            if (intervals[i].from <= updatedIntervals[updatedIntervals.length - 1].to) {
                const previousFrom = updatedIntervals[updatedIntervals.length - 1].from;
                const maxTo = Math.max(updatedIntervals[updatedIntervals.length - 1].to, intervals[i].to);
                updatedIntervals[updatedIntervals.length - 1] = new Interval(previousFrom, maxTo)
            } else {
                updatedIntervals.push(intervals[i])
            }
        }

        this.userIntervals[this.getUsername()] = updatedIntervals

        console.log("Updated page state after inserting interval", newInterval, this)
        return updatedIntervals
    }

    public async removeIntervalAt(index: number) {
        const intervals = this.getCurrentUserIntervals()
            .filter((interval, i) => i !== index)

        this.setMeeting(await this.meetingClient.setIntervals(this.meetingId!, this.getUsername(), intervals))
    }

    private getCurrentUserIntervals(): ReadonlyArray<Interval> {
        return this.userIntervals[this.getUsername()] || []
    }

}

class MeetingPageController implements Controller {
    private readonly meetingService: MeetingService
    private readonly meetingClient: MeetingClient
    private readonly navigator: AppNavigator
    private readonly inputIntervalFrom: HTMLInputElement
    private readonly inputIntervalTo: HTMLInputElement
    private readonly inputUsername: HTMLInputElement
    private readonly intervalsBlock: HTMLElement
    private readonly button: HTMLElement

    constructor(meetingService: MeetingService, meetingClient: MeetingClient, navigator: AppNavigator) {
        console.debug("Loading meeting controller")
        this.meetingService = meetingService
        this.meetingClient = meetingClient
        this.navigator = navigator

        this.inputIntervalFrom = document.getElementById('intervalFrom') as HTMLInputElement
        this.inputIntervalTo = document.getElementById('intervalTo') as HTMLInputElement
        this.inputUsername = document.getElementById('name') as HTMLInputElement
        this.button = document.getElementById('addInterval')!
        this.intervalsBlock = document.getElementById('intervals')!

        this.button.onclick = this.addInterval.bind(this)
        this.inputUsername.onchange = this.updateUsername.bind(this)
    }

    private static parseDate(dateString: string): number {
        return new Date(dateString).getTime()
    }

    async onLoad(): Promise<void> {
        let path = window.location.pathname.split('/')
        let meetingId = path[path.length - 1]
        if (meetingId) {
            console.log("Page with meeting id: ", meetingId)
            let meeting: Meeting
            try {
                meeting = await this.meetingClient.getMeeting(meetingId)
            } catch (error: unknown) {
                console.log(`Failed to get meeting ${meetingId}: `, error)
                this.navigator.openNotFound()
                return
            }
            this.meetingService.setMeeting(meeting)
            this.renderIntervals()
        } else {
            throw new Error('No meeting id found')
        }

        this.setName(this.meetingService.getUsername() || this.promptName() || "unknown")
    }

    promptName() {
        return prompt("Enter your name")
    }

    updateUsername() {
        this.meetingService.setUsername(this.inputUsername.value)
    }

    setName(username: string) {
        this.meetingService.setUsername(username)
        this.inputUsername.value = username
        console.log("Setting username ", username)
    }

    async addInterval() {
        const newInterval = new Interval(MeetingPageController.parseDate(this.inputIntervalFrom.value),
            MeetingPageController.parseDate(this.inputIntervalTo.value))
        if (newInterval.from >= newInterval.to) {
            alert("Invalid interval")
            return
        }

        // todo: move this logic to MeetingService
        const intervals = this.meetingService.addInterval(newInterval)

        let meeting = await this.meetingClient.setIntervals(this.meetingService.meetingId!, this.meetingService.getUsername(), intervals)
        this.meetingService.setMeeting(meeting)
        this.renderIntervals()
    }

    private async onDeleteInterval(index: number) {
        await this.meetingService.removeIntervalAt(index)
        this.renderIntervals()
    }

    private renderIntervals() {
        this.intervalsBlock.innerHTML = ''

        const intervalsHeaderElement = document.createElement('h2')
        intervalsHeaderElement.innerText = 'Intervals:'
        this.intervalsBlock.appendChild(intervalsHeaderElement)

        for (const [username, perUserIntervals] of Object.entries(this.meetingService.userIntervals)) {
            const usernameElement = document.createElement('h3')
            usernameElement.innerText = username
            this.intervalsBlock.appendChild(usernameElement)

            for (let i = 0; i < perUserIntervals.length; i++) {
                const interval = perUserIntervals[i]
                const intervalRowElement = document.createElement('div')

                const intervalElement = document.createElement('div')
                intervalElement.innerText = new Date(interval.from).toLocaleString() + ' - ' + new Date(interval.to).toLocaleString()
                intervalRowElement.appendChild(intervalElement)

                if (username === this.meetingService.getUsername()) {
                    const deleteButton = document.createElement('button')
                    deleteButton.innerText = 'Delete'
                    deleteButton.onclick = this.onDeleteInterval.bind(this, i)
                    intervalRowElement.appendChild(deleteButton)
                }


                this.intervalsBlock.appendChild(intervalRowElement)
            }
        }

        const intersectionsHeaderElement = document.createElement('h2')
        intersectionsHeaderElement.innerText = 'Intersections:'
        this.intervalsBlock.appendChild(intersectionsHeaderElement)
        for (const interval of this.meetingService.intersections) {
            const intervalElement = document.createElement('div')
            intervalElement.innerText = new Date(interval.from).toLocaleString() + ' - ' + new Date(interval.to).toLocaleString()
            this.intervalsBlock.appendChild(intervalElement)
        }
    }
}

const meetingClient = new MeetingClient(new RestClient());
new MeetingPageController(new MeetingService(meetingClient), meetingClient, new AppNavigator())
    .onLoad().then(() => console.log("Loaded meeting page"))
