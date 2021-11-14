package in.solomk.meeting.assistant.api.dto.request;

import java.util.List;

public record BatchIntervalsRequest(List<IntervalRequest> intervals) {
}
