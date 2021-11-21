package in.solomk.meeting.assistant.service.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.Collections.emptyList;
import static java.util.Collections.emptyMap;

public record Meeting(String id, Map<String, List<Interval>> userIntervals, List<Interval> intersections) {

    public Meeting(String id, Map<String, List<Interval>> userIntervals) {
        this(id, userIntervals, emptyList());
    }

    public static Meeting empty(String id) {
        return new Meeting(id, emptyMap(), emptyList());
    }

    public Meeting withUserIntervals(String username, List<Interval> intervals) {
        var copyUserIntervals = new HashMap<>(userIntervals);
        copyUserIntervals.put(username, intervals);
        return new Meeting(id, copyUserIntervals, emptyList());
    }

    public Meeting withIntersections(List<Interval> intersections) {
        return new Meeting(id, userIntervals, intersections);
    }
}
