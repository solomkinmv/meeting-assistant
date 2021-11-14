package in.solomk.meeting.assistant.repository.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.Collections.emptyMap;

public record Meeting(String id, Map<String, List<Interval>> userIntervals) {

    public static Meeting empty(String id) {
        return new Meeting(id, emptyMap());
    }

    public Meeting withUserIntervals(String username, List<Interval> intervals) {
        var copyUserIntervals = new HashMap<>(userIntervals);
        copyUserIntervals.put(username, intervals);
        return new Meeting(id, copyUserIntervals);
    }
}
