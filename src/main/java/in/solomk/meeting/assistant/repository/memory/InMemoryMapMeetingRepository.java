package in.solomk.meeting.assistant.repository.memory;

import in.solomk.meeting.assistant.repository.memory.entity.MeetingEntity;
import in.solomk.meeting.assistant.service.MeetingIdGenerator;
import in.solomk.meeting.assistant.service.MeetingRepository;
import in.solomk.meeting.assistant.service.model.Meeting;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.concurrent.ConcurrentHashMap;

@Repository
@Profile("in-memory")
@RequiredArgsConstructor
public class InMemoryMapMeetingRepository implements MeetingRepository {

    private final MeetingIdGenerator idGenerator;
    private final ConcurrentHashMap<String, MeetingEntity> mapStorage = new ConcurrentHashMap<>();

    @Override
    public Mono<Meeting> saveMeeting(Meeting meeting) {
        if (meeting.id() == null) {
            meeting = meeting.withId(idGenerator.generateId());
        }
        mapStorage.put(meeting.id(),
                       MeetingEntity.valueOf(meeting));
        return Mono.just(meeting);
    }

    @Override
    public Mono<Meeting> getMeetingById(String id) {
        return Mono.justOrEmpty(mapStorage.get(id))
                   .map(MeetingEntity::toModel);
    }
}
