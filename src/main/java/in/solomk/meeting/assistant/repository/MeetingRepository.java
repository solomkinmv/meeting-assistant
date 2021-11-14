package in.solomk.meeting.assistant.repository;

import in.solomk.meeting.assistant.repository.model.MeetingEntity;
import reactor.core.publisher.Mono;

public interface MeetingRepository {

    Mono<MeetingEntity> saveMeeting(MeetingEntity meeting);

    Mono<MeetingEntity> getMeetingById(String id);

}
