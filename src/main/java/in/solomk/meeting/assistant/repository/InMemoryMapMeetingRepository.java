package in.solomk.meeting.assistant.repository;

import in.solomk.meeting.assistant.repository.model.Meeting;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryMapMeetingRepository implements MeetingRepository {

    private final ConcurrentHashMap<String, Meeting> mapStorage = new ConcurrentHashMap<>();

    @Override
    public Mono<Meeting> saveMeeting(Meeting meeting) {
        mapStorage.put(Objects.requireNonNull(meeting.id()), meeting);
        return Mono.just(meeting);
    }

    @Override
    public Mono<Meeting> getMeetingById(String id) {
        return Mono.justOrEmpty(mapStorage.get(id));
    }
}
