export class AppNavigator {

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
