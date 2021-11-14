package in.solomk.meeting.assistant.api.dto.response;

import java.util.List;
import java.util.Map;

public record MeetingResponse(String id, Map<String, List<IntervalResponse>> userIntervals) {
}
