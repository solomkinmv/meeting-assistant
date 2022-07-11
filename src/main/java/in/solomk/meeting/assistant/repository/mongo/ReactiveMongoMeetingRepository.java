package in.solomk.meeting.assistant.repository.mongo;

import in.solomk.meeting.assistant.repository.mongo.entity.MeetingDocument;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

@Profile("mongo")
public interface ReactiveMongoMeetingRepository extends ReactiveMongoRepository<MeetingDocument, String> {

}
