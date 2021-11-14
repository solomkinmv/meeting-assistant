package in.solomk.meeting.assistant.service;

import in.solomk.meeting.assistant.exception.PersistenceException;
import in.solomk.meeting.assistant.repository.MeetingRepository;
import in.solomk.meeting.assistant.repository.model.Interval;
import in.solomk.meeting.assistant.repository.model.Meeting;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
@AllArgsConstructor
public class MeetingService {

    private final MeetingIdGenerator idGenerator;
    private final MeetingRepository repository;

    public Mono<Meeting> create() {
        return repository.saveMeeting(Meeting.empty(idGenerator.generateId()));
    }

    public Mono<Meeting> setIntervalsForUser(String meetingId, String username, List<Interval> intervals) {
        return repository.getMeetingById(meetingId) // todo: make atomic
                         .map(meeting -> meeting.withUserIntervals(username, intervals))
                         .flatMap(repository::saveMeeting)
                .switchIfEmpty(Mono.error(new PersistenceException("Meeting %s is missing in the database", meetingId)));
    }
}
