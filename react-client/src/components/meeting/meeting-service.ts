import {Meeting} from "../../client/model/meeting";
import {Interval} from "../../client/model/interval";

export function useMeetingService(): MeetingService {
    return new MeetingService();
}

class MeetingService {

    private static getCurrentUserIntervals(meeting: Meeting, username: string): ReadonlyArray<Interval> {
        return meeting.userIntervals[username] || []
    }

    public filterUserIntervals(meeting: Meeting, username: string, index: number): ReadonlyArray<Interval> {
        return MeetingService.getCurrentUserIntervals(meeting, username)
            .filter((interval, i) => i !== index)
    }

}
