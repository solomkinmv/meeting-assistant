package in.solomk.meeting.assistant.service;

import in.solomk.meeting.assistant.exception.PersistenceException;
import in.solomk.meeting.assistant.repository.MeetingRepository;
import in.solomk.meeting.assistant.repository.model.IntervalEntity;
import in.solomk.meeting.assistant.repository.model.MeetingEntity;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
@AllArgsConstructor
public class MeetingService {

    private final MeetingIdGenerator idGenerator;
    private final MeetingRepository repository;

    public Mono<MeetingEntity> create() {
        return repository.saveMeeting(MeetingEntity.empty(idGenerator.generateId()));
    }

    public Mono<MeetingEntity> setIntervalsForUser(String meetingId, String username, List<IntervalEntity> intervals) {
        return repository.getMeetingById(meetingId) // todo: make atomic
                         .map(meeting -> meeting.withUserIntervals(username, intervals))
                         .flatMap(repository::saveMeeting)
                .switchIfEmpty(Mono.error(new PersistenceException("Meeting %s is missing in the database", meetingId)));
    }
}
