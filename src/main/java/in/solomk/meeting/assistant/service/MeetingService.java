package in.solomk.meeting.assistant.service;

import in.solomk.meeting.assistant.repository.MeetingRepository;
import in.solomk.meeting.assistant.repository.model.Meeting;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
@AllArgsConstructor
public class MeetingService {

    private final MeetingIdGenerator idGenerator;
    private final MeetingRepository repository;

    public Mono<Meeting> create() {
        return repository.saveMeeting(new Meeting(idGenerator.generateId()));
    }
}
