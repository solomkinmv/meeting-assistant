import {Controller} from "./controller/controller"
import {MeetingClient, RestClient} from "./meeting-client"
import {AppNavigator} from "./app-navigator"

class MainPageController implements Controller {
    private readonly meetingClient: MeetingClient
    private readonly navigator: AppNavigator
    private readonly newMeetingButton: HTMLElement

    constructor(meetingClient: MeetingClient, navigator: AppNavigator) {
        console.debug("Loading main controller")
        this.meetingClient = meetingClient
        this.navigator = navigator

        this.newMeetingButton = document.getElementById("new-meeting-button") as HTMLButtonElement
        this.newMeetingButton.onclick = this.onNewMeetingButtonClick.bind(this)

        console.debug("Created main controller", meetingClient, navigator)
    }

    public onLoad() {
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
