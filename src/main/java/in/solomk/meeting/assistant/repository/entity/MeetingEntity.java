package in.solomk.meeting.assistant.repository.entity;

import in.solomk.meeting.assistant.service.model.Meeting;

import java.util.List;
import java.util.Map;

import static in.solomk.meeting.assistant.util.ConversionUtils.mapToList;
import static in.solomk.meeting.assistant.util.ConversionUtils.mapValues;

public record MeetingEntity(String id, Map<String, List<IntervalEntity>> userIntervals) {

    public static MeetingEntity valueOf(Meeting meeting) {
        return new MeetingEntity(meeting.id(),
                                 mapValues(meeting.userIntervals(),
                                           intervals -> mapToList(intervals, IntervalEntity::valueOf)));
    }

    public Meeting toModel() {
        return new Meeting(id, mapValues(userIntervals,
                                         intervalEntities -> mapToList(intervalEntities, IntervalEntity::toModel)),
                           null);
    }
}
