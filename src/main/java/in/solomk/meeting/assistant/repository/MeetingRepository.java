package in.solomk.meeting.assistant.repository;

import in.solomk.meeting.assistant.repository.model.Meeting;

import java.util.Optional;

public interface MeetingRepository {

    Meeting saveMeeting(Meeting meeting);
    Optional<Meeting> getMeetingById(String id);

}
