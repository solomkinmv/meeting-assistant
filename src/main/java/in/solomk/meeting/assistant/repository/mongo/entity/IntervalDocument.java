package in.solomk.meeting.assistant.repository.mongo.entity;

import in.solomk.meeting.assistant.service.model.Interval;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public record IntervalDocument(long from, long to) {

    public static IntervalDocument valueOf(Interval interval) {
        return new IntervalDocument(interval.from(), interval.to());
    }

    public Interval toModel() {
        return new Interval(from, to);
    }
}
