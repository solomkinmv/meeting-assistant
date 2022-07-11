package in.solomk.meeting.assistant.repository.mongo.entity;

import in.solomk.meeting.assistant.service.model.Meeting;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import static in.solomk.meeting.assistant.util.ConversionUtils.mapToList;
import static in.solomk.meeting.assistant.util.ConversionUtils.mapValues;

@Document(collection = "meetings")
public record MeetingDocument(
        @Id
        String id,
        Map<String, List<IntervalDocument>> userIntervals,

        @Field
        @Indexed(name = "someDateFieldIndex", expireAfter = "${meetings.expiration}")
        @CreatedDate
        Instant createdAt) {

    public static MeetingDocument valueOf(Meeting meeting) {
        return new MeetingDocument(meeting.id(),
                                   mapValues(meeting.userIntervals(),
                                             intervals -> mapToList(intervals, IntervalDocument::valueOf)),
                                   null);
    }

    public Meeting toModel() {
        return new Meeting(id, mapValues(userIntervals,
                                         intervalEntities -> mapToList(intervalEntities, IntervalDocument::toModel)),
                           null);
    }
}
