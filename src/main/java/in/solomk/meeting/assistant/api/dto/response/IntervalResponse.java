package in.solomk.meeting.assistant.api.dto.response;

import in.solomk.meeting.assistant.service.model.Interval;

public record IntervalResponse(long from, long to) {

    public static IntervalResponse valueOf(Interval interval) {
        return new IntervalResponse(interval.from(), interval.to());
    }
}
