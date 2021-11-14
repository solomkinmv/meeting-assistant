package in.solomk.meeting.assistant.api.dto.response;

import in.solomk.meeting.assistant.service.model.Meeting;

import java.util.List;
import java.util.Map;

import static in.solomk.meeting.assistant.util.ConversionUtils.mapToList;
import static in.solomk.meeting.assistant.util.ConversionUtils.mapValues;

public record MeetingResponse(String id,
                              Map<String, List<IntervalResponse>> userIntervals,
                              List<IntervalResponse> intersections) {

    public static MeetingResponse valueOf(Meeting meeting) {
        return new MeetingResponse(meeting.id(),
                                   mapValues(meeting.userIntervals(),
                                             intervals -> mapToList(intervals, IntervalResponse::valueOf)),
                                   mapToList(meeting.intersections(), IntervalResponse::valueOf));
    }
}
