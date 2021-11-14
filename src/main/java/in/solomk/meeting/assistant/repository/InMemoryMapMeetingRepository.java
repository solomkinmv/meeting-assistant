package in.solomk.meeting.assistant.repository;

import in.solomk.meeting.assistant.repository.model.MeetingEntity;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryMapMeetingRepository implements MeetingRepository {

    private final ConcurrentHashMap<String, MeetingEntity> mapStorage = new ConcurrentHashMap<>();

    @Override
    public Mono<MeetingEntity> saveMeeting(MeetingEntity meeting) {
        mapStorage.put(Objects.requireNonNull(meeting.id()), meeting);
        return Mono.just(meeting);
    }

    @Override
    public Mono<MeetingEntity> getMeetingById(String id) {
        return Mono.justOrEmpty(mapStorage.get(id));
    }
}
