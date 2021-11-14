package in.solomk.meeting.assistant.api.dto.request;

import in.solomk.meeting.assistant.repository.model.IntervalEntity;

public record IntervalRequest(long from, long to) {

    public IntervalEntity toModel() {
        return new IntervalEntity(from, to);
    }
}
