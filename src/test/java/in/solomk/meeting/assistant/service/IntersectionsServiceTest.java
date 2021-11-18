package in.solomk.meeting.assistant.service;

import in.solomk.meeting.assistant.service.model.Interval;
import in.solomk.meeting.assistant.service.model.IntervalsGroup;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static java.util.Collections.emptyList;
import static org.assertj.core.api.Assertions.assertThat;

class IntersectionsServiceTest {

    private final IntersectionsService intersectionsService = new IntersectionsService();

    @Test
    void returnsEmptyListIfSingleGroup() {
        assertIntervals(List.of(group(interval(100, 200), interval(300, 500))), emptyList());
    }

    @Test
    void returnsEmptyListIfNoGroups() {
        assertIntervals(emptyList(), emptyList());
    }

    @Test
    void returnsIntersectionForTwoGroupsWithOneInterval() {
        assertIntervals(List.of(group(interval(200, 400)),
                                group(interval(300, 500))),
                        List.of(interval(300, 400)));
    }

    @Test
    void returnsEmptyListIfNoIntersectionsForTwoGroupsWithOneInterval() {
        assertIntervals(List.of(group(interval(200, 400)),
                                group(interval(400, 500))),
                        emptyList());
    }

    @Test
    void returnsIntersectionForTwoGroupsWithOneBigIntervalThatAffectsMultipleFromOtherGroup() {
        assertIntervals(List.of(group(interval(200, 1000)),
                                group(interval(300, 500), interval(600, 700), interval(900, 1200))),
                        List.of(interval(300, 500), interval(600, 700), interval(900, 1000)));
    }

    @Test
    void returnsIntersectionForTwoGroupsOfMultipleIntervals() {
        assertIntervals(List.of(group(interval(0, 200), interval(250, 500), interval(600, 800), interval(810, 1000)),
                                group(interval(0, 205), interval(220, 300), interval(305, 605), interval(650, 1200))),
                        List.of(interval(0, 200), interval(250, 300), interval(305, 500), interval(600, 605), interval(650, 800), interval(810, 1000)));
    }

    @Test
    void returnsIntersectionForThreeGroupsWithOneInterval() {
        assertIntervals(List.of(group(interval(200, 400)),
                                group(interval(300, 500)),
                                group(interval(100, 350))),
                        List.of(interval(300, 350)));
    }

    @Test
    void returnsIntersectionForThreeGroupsOfMultipleIntervals() {
        assertIntervals(List.of(group(interval(0, 200), interval(300, 800)),
                                group(interval(0, 500), interval(600, 1200))),
                        List.of(interval(0, 200), interval(300, 500), interval(600, 800)));

        assertIntervals(List.of(group(interval(0, 200), interval(300, 800)),
                                group(interval(0, 500), interval(600, 1200)),
                                group(interval(0, 50), interval(100, 150), interval(160, 650), interval(700, 1000))),
                        List.of(interval(0, 50), interval(100, 150), interval(160, 200), interval(300, 500),
                                interval(600, 650), interval(700, 800)));
    }

    void assertIntervals(List<IntervalsGroup> intervalsGroups, List<Interval> expectedResult) {
        var actualResult = intersectionsService.findIntersections(intervalsGroups);

        assertThat(actualResult)
                .isEqualTo(expectedResult);
    }

    public IntervalsGroup group(Interval... intervals) {
        return new IntervalsGroup(Arrays.asList(intervals));
    }

    public Interval interval(long from, long to) {
        return new Interval(from, to);
    }
}