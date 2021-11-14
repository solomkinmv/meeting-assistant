package in.solomk.meeting.assistant.service;

import in.solomk.meeting.assistant.service.model.Meeting;
import reactor.core.publisher.Mono;

public interface MeetingRepository {

    Mono<Meeting> saveMeeting(Meeting meeting);

    Mono<Meeting> getMeetingById(String id);

}
