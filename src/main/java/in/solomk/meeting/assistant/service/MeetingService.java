package in.solomk.meeting.assistant.service;

import in.solomk.meeting.assistant.exception.PersistenceException;
import in.solomk.meeting.assistant.service.model.Interval;
import in.solomk.meeting.assistant.service.model.Meeting;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

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
}
