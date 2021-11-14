package in.solomk.meeting.assistant.repository.entity;

import in.solomk.meeting.assistant.service.model.Interval;

public record IntervalEntity(long from, long to) {

    public static IntervalEntity valueOf(Interval interval) {
        return new IntervalEntity(interval.from(), interval.to());
    }

    public Interval toModel() {
        return new Interval(from, to);
    }
}
