import {Controller} from "./controller/controller"
import {MeetingClient, RestClient} from "./meeting-client"
import {AppNavigator} from "./app-navigator"

class MainPageController implements Controller {
    meetingClient: MeetingClient
    navigator: AppNavigator
    newMeetingButton: HTMLElement

    constructor(meetingClient: MeetingClient, navigator: AppNavigator) {
        this.meetingClient = meetingClient
        this.navigator = navigator
        console.debug("Created main controller", meetingClient, navigator)
    }

    public onLoad() {
        console.debug("Loading main controller")
        this.newMeetingButton = document.getElementById("new-meeting-button")

        this.newMeetingButton.onclick = this.onNewMeetingButtonClick.bind(this)
    }

    private async onNewMeetingButtonClick() {
        console.debug("Clicked new meeting button")
        try {
            const meetingId = await this.meetingClient.createMeeting()
            this.navigator.openMeetingPage(meetingId)
        } catch (e) {
            console.error("Failed to create meeting", e)
        }
    }

}

new MainPageController(new MeetingClient(new RestClient()),
    new AppNavigator())
    .onLoad()
