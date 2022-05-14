import {Interval} from "./model/interval"
import {Meeting} from "./model/meeting"

export class MeetingClient {
    private restClient: RestClient

    constructor(restClient: RestClient) {
        this.restClient = restClient
    }

    async createMeeting(): Promise<string> {
        const meeting = await this.restClient.post(`/api/meetings/`, null)
        console.log('Received response after meeting creation', meeting)
        return meeting['id']
    }

    async setIntervals(meetingId: string, username: string, intervals: ReadonlyArray<Interval>): Promise<Meeting> {
        console.debug('Setting intervals', meetingId, username, intervals)
        const meeting = await this.restClient.put(`/api/meetings/${meetingId}/intervals/${username}`,
            {intervals: intervals})
        console.log('Received response on update of intervals', meeting)
        return meeting
    }

    async getMeeting(meetingId: string): Promise<Meeting> {
        console.debug('Getting meeting', meetingId)
        const meeting = await this.restClient.get(`/api/meetings/${meetingId}`)
        console.log('Received response on meeting retrieval', meeting)
        return meeting
    }
}

export class RestClient {

    async get(url: string) {
        const response = await fetch(url, {
            method: 'GET',
        })
        const data = await response.json()
        console.log('Received response on get', data)
        return data
    }

    async post(url: string, body: any) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        const data = await response.json()
        console.log('Received response on post', data)
        return data
    }

    async put(url: string, body: any) {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        const data = await response.json()
        console.log('Received response on put', data)
        return data
    }

}
