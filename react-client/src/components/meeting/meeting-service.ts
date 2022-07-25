import {Meeting} from "../../client/model/meeting";
import {Interval} from "../../client/model/interval";

export function useMeetingService(): MeetingService {
    return new MeetingService();
}

class MeetingService {

    private static getCurrentUserIntervals(meeting: Meeting, username: string): ReadonlyArray<Interval> {
        return meeting.userIntervals[username] || []
    }

    public addInterval(meeting: Meeting, username: string, newInterval: Interval): ReadonlyArray<Interval> {
        const intervals = MeetingService.getCurrentUserIntervals(meeting, username)
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

        return updatedIntervals
    }

    public filterUserIntervals(meeting: Meeting, username: string, index: number): ReadonlyArray<Interval> {
        return MeetingService.getCurrentUserIntervals(meeting, username)
            .filter((interval, i) => i !== index)
    }

}
