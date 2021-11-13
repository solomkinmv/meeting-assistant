package in.solomk.meeting.assistant.repository;

import in.solomk.meeting.assistant.repository.model.Meeting;
import reactor.core.publisher.Mono;

public interface MeetingRepository {

    Mono<Meeting> saveMeeting(Meeting meeting);

    Mono<Meeting> getMeetingById(String id);

}
