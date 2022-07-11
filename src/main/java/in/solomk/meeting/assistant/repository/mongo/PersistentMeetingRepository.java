package in.solomk.meeting.assistant.repository.mongo;

import in.solomk.meeting.assistant.repository.mongo.entity.MeetingDocument;
import in.solomk.meeting.assistant.service.MeetingRepository;
import in.solomk.meeting.assistant.service.model.Meeting;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
@RequiredArgsConstructor
@Profile("mongo")
public class PersistentMeetingRepository implements MeetingRepository {

    private final ReactiveMongoMeetingRepository repository;

    @Override
    public Mono<Meeting> saveMeeting(Meeting meeting) {
        return repository.save(MeetingDocument.valueOf(meeting))
                         .map(MeetingDocument::toModel);
    }

    @Override
    public Mono<Meeting> getMeetingById(String id) {
        return repository.findById(id)
                         .map(MeetingDocument::toModel);
    }
}
