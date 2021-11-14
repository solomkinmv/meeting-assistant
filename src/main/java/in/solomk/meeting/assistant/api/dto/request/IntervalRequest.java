package in.solomk.meeting.assistant.api.dto.request;

import in.solomk.meeting.assistant.service.model.Interval;

public record IntervalRequest(long from, long to) {

    public Interval toModel() {
        return new Interval(from, to);
    }
}
