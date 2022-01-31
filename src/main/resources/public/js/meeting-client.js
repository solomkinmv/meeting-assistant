class Interval {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
}

class MeetingClient {
    async addInterval(meetingId, username, intervals) {
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
        return data;
    }

    async createMeeting() {
        const response = await fetch('/meetings/', {
            method: 'POST'
        });
        let data = await response.json();
        console.log('Received response after meeting creation', data);
        return data['id'];
    }

}
