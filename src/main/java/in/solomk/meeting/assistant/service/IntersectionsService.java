package in.solomk.meeting.assistant.service;

import in.solomk.meeting.assistant.service.model.Interval;
import in.solomk.meeting.assistant.service.model.IntervalsGroup;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static java.util.Collections.emptyList;

@Component
public class IntersectionsService {

    public List<Interval> findIntersections(List<IntervalsGroup> intervalGroups) {
        if (intervalGroups.size() < 2) return emptyList();

        List<Interval> intervals = intervalGroups.get(0).intervals();
        for (int i = 1; i < intervalGroups.size(); i++) {
            var otherIntervals = intervalGroups.get(i).intervals();
            List<Interval> resultIntervals = new ArrayList<>();
            int idx1 = 0, idx2 = 0;
            while (idx1 < intervals.size() && idx2 < otherIntervals.size()) {
                // ensure intervals[idx1] starts before otherIntervals[idx2]
                if (otherIntervals.get(idx2).from() < intervals.get(idx1).from()) {
                    var tmpIntervals = intervals;
                    intervals = otherIntervals;
                    otherIntervals = tmpIntervals;

                    var tmpIdx = idx1;
                    idx1 = idx2;
                    idx2 = tmpIdx;
                }

                Interval initial = intervals.get(idx1);
                Interval secondary = otherIntervals.get(idx2);

                if (secondary.from() >= initial.to()) {
                    idx1++;
                    continue;
                }
                resultIntervals.add(new Interval(Math.max(initial.from(), secondary.from()),
                                                 Math.min(initial.to(), secondary.to())));

                if (initial.to() <= secondary.to()) idx1++;
                else idx2++;
            }

            intervals = resultIntervals;
        }
        return Collections.unmodifiableList(intervals);
    }
}
