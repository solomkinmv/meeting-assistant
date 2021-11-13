package in.solomk.meeting.assistant.repository;

import in.solomk.meeting.assistant.repository.model.Meeting;

import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

public class InMemoryMapMeetingRepository implements MeetingRepository {

    private final ConcurrentHashMap<String, Meeting> mapStorage = new ConcurrentHashMap<>();

    @Override
    public Meeting saveMeeting(Meeting meeting) {
        mapStorage.put(Objects.requireNonNull(meeting.id()), meeting);
        return meeting;
    }

    @Override
    public Optional<Meeting> getMeetingById(String id) {
        return Optional.ofNullable(mapStorage.get(id));
    }
}
