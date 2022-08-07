package in.solomk.meeting.assistant.service;

import in.solomk.meeting.assistant.exception.PersistenceException;
import in.solomk.meeting.assistant.service.model.Interval;
import in.solomk.meeting.assistant.service.model.Meeting;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Slf4j
@Component
@AllArgsConstructor
public class MeetingService {

    private final MeetingRepository repository;
    private final IntersectionEnricher intersectionEnricher;

    public Mono<Meeting> get(String id) {
        return repository.getMeetingById(id)
                         .map(intersectionEnricher::withIntersectionDetails);
    }

    public Mono<Meeting> create() {
        log.info("Creating a new meeting");
        return repository.saveMeeting(Meeting.empty())
                         .log("created");
    }

    public Mono<Meeting> setIntervalsForUser(String meetingId, String username, List<Interval> intervals) {
        return repository.getMeetingById(meetingId) // todo: make atomic
                         .map(meeting -> meeting.withUserIntervals(username, intervals))
                         .flatMap(repository::saveMeeting)
                         .map(intersectionEnricher::withIntersectionDetails)
                         .switchIfEmpty(Mono.error(new PersistenceException("Meeting %s is missing in the database", meetingId)));
    }

    public Mono<Meeting> addIntervalForUser(String meetingId, String username, Interval newInterval) {
        return repository.getMeetingById(meetingId)
                         .map(meeting -> meeting.withUserIntervals(username, (oldIntervals) -> mergeIntervals(oldIntervals, newInterval)))
                         .flatMap(repository::saveMeeting)
                         .map(intersectionEnricher::withIntersectionDetails)
                         .switchIfEmpty(Mono.error(new PersistenceException("Meeting %s is missing in the database", meetingId)));
    }

    public Mono<Meeting> deleteIntervalsForUser(String meetingId, String username, Interval interval) {
        return repository.getMeetingById(meetingId)
                         .map(meeting -> meeting.withUserIntervals(username, (oldIntervals) -> removeInterval(oldIntervals, interval)))
                         .flatMap(repository::saveMeeting)
                         .map(intersectionEnricher::withIntersectionDetails)
                         .switchIfEmpty(Mono.error(new PersistenceException("Meeting %s is missing in the database", meetingId)));
    }

    private List<Interval> removeInterval(List<Interval> oldIntervals, Interval intervalToRemove) {
        List<Interval> newIntervals = new ArrayList<>();
        for (Interval oldInterval : oldIntervals) {
            if (!oldInterval.intersect(intervalToRemove)) {
                newIntervals.add(oldInterval);
            }
        }
        return newIntervals;
    }

    private List<Interval> mergeIntervals(List<Interval> oldIntervals, Interval newInterval) {
        if (oldIntervals.isEmpty()) {
            return Collections.singletonList(newInterval);
        }
        List<Interval> intervalsCopy = new ArrayList<>(oldIntervals);
        intervalsCopy.add(newInterval);
        intervalsCopy.sort(Comparator.comparingLong(Interval::from));

        List<Interval> result = new ArrayList<>();
        result.add(intervalsCopy.get(0));
        for (int iCopy = 1, iResult = 0; iCopy < intervalsCopy.size(); iCopy++) {
            if (result.get(iResult).to() >= intervalsCopy.get(iCopy).from()) {
                result.set(iResult, new Interval(result.get(iResult).from(), Math.max(result.get(iResult).to(), intervalsCopy.get(iCopy).to())));
            } else {
                result.add(intervalsCopy.get(iCopy));
                iResult++;
            }
        }
        return result;
    }
}
