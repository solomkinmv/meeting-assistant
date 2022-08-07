import {Interval} from "./model/interval"
import {Meeting} from "./model/meeting"

export function meetingClient() {
    return new MeetingClient(new RestClient())
}

class MeetingClient {
    private restClient: RestClient

    constructor(restClient: RestClient) {
        this.restClient = restClient
    }

    async createMeeting(): Promise<string> {
        const meeting = await this.restClient.post(`${process.env.REACT_APP_MEETING_SERVICE_API_HOST}/api/meetings/`, null)
        console.log('Received response after meeting creation', meeting)
        return meeting['id']
    }

    async setIntervals(meetingId: string, username: string, intervals: ReadonlyArray<Interval>): Promise<Meeting> {
        console.debug('Setting intervals', meetingId, username, intervals)
        const meeting = await this.restClient.put(`${process.env.REACT_APP_MEETING_SERVICE_API_HOST}/api/meetings/${meetingId}/intervals/${username}`,
            {intervals: intervals})
        console.log('Received response on update of intervals', meeting)
        return meeting
    }

    async addInterval(meetingId: string, username: string, interval: Interval): Promise<Meeting> {
        const meeting = await this.restClient.post(`${process.env.REACT_APP_MEETING_SERVICE_API_HOST}/api/meetings/${meetingId}/intervals/${username}`,
            {interval: interval})
        console.log('Received response on interval addition', meeting)
        return meeting
    }

    async removeIntervals(meetingId: string, username: string, interval: Interval): Promise<Meeting> {
        const url = new URL(`${process.env.REACT_APP_MEETING_SERVICE_API_HOST}/api/meetings/${meetingId}/intervals/${username}`);
        url.searchParams.append('from', interval.from.toString());
        url.searchParams.append('to', interval.to.toString());
        const meeting = await this.restClient.delete(url.toString());
        console.log('Received response on interval removal', meeting)
        return meeting
    }

    async getMeeting(meetingId: string): Promise<Meeting> {
        const url = `${process.env.REACT_APP_MEETING_SERVICE_API_HOST}/api/meetings/${meetingId}`;
        console.debug('Getting meeting', url)
        const meeting = await this.restClient.get(url)
        console.log('Received response on meeting retrieval', meeting)
        return meeting
    }
}

class RestClient {

    async get(url: string) {
        const response = await fetch(url, {
            method: 'GET'
        })
        console.log('Received response on get', response)
        if (response.status === 404) {
            throw new NotFoundError("Could not find resource at " + url)
        }
        try {
            return await response.json()
        } catch (e) {
            console.error(`Error on get ${url}`, e)
            throw e;
        }
    }

    async post(url: string, body: any) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
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

    async delete(url: string) {
        const response = await fetch(url, {
            method: 'DELETE',
            mode: 'cors',
        })
        if (response.status === 404) {
            throw new NotFoundError("Could not find resource at " + url)
        }
        console.log('Received response on delete', response)
        try {
            return await response.json()
        } catch (e) {
            console.error(`Error on delete ${url}`, e)
            throw e;
        }
    }
}

class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotFound";
    }
}
