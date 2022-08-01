package in.solomk.meeting.assistant.service.model;

import lombok.With;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static java.util.Collections.emptyList;
import static java.util.Collections.emptyMap;

public record Meeting(@With String id, Map<String, List<Interval>> userIntervals, List<Interval> intersections) {

    public Meeting(String id, Map<String, List<Interval>> userIntervals) {
        this(id, userIntervals, emptyList());
    }

    public static Meeting empty(String id) {
        return new Meeting(id, emptyMap(), emptyList());
    }

    public static Meeting empty() {
        return new Meeting(null, emptyMap(), emptyList());
    }

    public Meeting withUserIntervals(String username, List<Interval> intervals) {
        var copyUserIntervals = new HashMap<>(userIntervals);
        copyUserIntervals.put(username, intervals);
        return new Meeting(id, copyUserIntervals, emptyList());
    }

    public Meeting withUserIntervals(String username, Function<List<Interval>, List<Interval>> mappingFunction) {
        var copyUserIntervals = new HashMap<>(userIntervals);
        var intervals = copyUserIntervals.getOrDefault(username, emptyList());
        copyUserIntervals.put(username, mappingFunction.apply(intervals));
        return new Meeting(id, copyUserIntervals, emptyList());
    }

    public Meeting withIntersections(List<Interval> intersections) {
        return new Meeting(id, userIntervals, intersections);
    }
}
