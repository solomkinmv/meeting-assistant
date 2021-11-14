package in.solomk.meeting.assistant.repository.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.Collections.emptyMap;

public record MeetingEntity(String id, Map<String, List<IntervalEntity>> userIntervals) {

    public static MeetingEntity empty(String id) {
        return new MeetingEntity(id, emptyMap());
    }

    public MeetingEntity withUserIntervals(String username, List<IntervalEntity> intervals) {
        var copyUserIntervals = new HashMap<>(userIntervals);
        copyUserIntervals.put(username, intervals);
        return new MeetingEntity(id, copyUserIntervals);
    }
}
