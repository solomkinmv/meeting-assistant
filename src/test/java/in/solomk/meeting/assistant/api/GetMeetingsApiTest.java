package in.solomk.meeting.assistant.api;

import in.solomk.meeting.assistant.api.dto.request.IntervalRequest;
import in.solomk.meeting.assistant.api.dto.response.IntervalResponse;
import in.solomk.meeting.assistant.api.dto.response.MeetingResponse;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import static java.util.Collections.emptyList;
import static java.util.Collections.emptyMap;

public class GetMeetingsApiTest extends BaseFuncTest {

    @Test
    void returns404ForAbsentMeeting() {
        testClient.getMeeting("unknown-meeting-id")
                  .expectStatus()
                  .isNotFound();
    }

    @Test
    void returnsEmptyMeeting() {
        String meetingId = createMeeting();

        verifyMeetingResponse(new MeetingResponse(meetingId, emptyMap(), emptyList()));
    }

    @Test
    void returnsUpdatedMeetingInformationForSingleUser() {
        String meetingId = createMeeting();
        var username = "user-1";
        testClient.setIntervalsForUser(meetingId, username, List.of(intervalReq(100, 300), intervalReq(500, 1000)));

        var singleUserIntervalResponses = List.of(intervalRes(100, 300), intervalRes(500, 1000));
        verifyMeetingResponse(
                new MeetingResponse(meetingId,
                                    Map.of(username, singleUserIntervalResponses),
                                    singleUserIntervalResponses));
    }

    @Test
    void returnsUpdatedMeetingInformationForMultipleUsersWithIntersections() {
        String meetingId = createMeeting();
        String user1 = "user-1", user2 = "user-2", user3 = "user-3";
        testClient.setIntervalsForUser(meetingId, user1, List.of(intervalReq(100, 300), intervalReq(500, 1000)));
        testClient.setIntervalsForUser(meetingId, user2, List.of(intervalReq(0, 1200), intervalReq(1300, 1500)));
        testClient.setIntervalsForUser(meetingId, user3, List.of(intervalReq(200, 600), intervalReq(700, 1100)));

        verifyMeetingResponse(
                new MeetingResponse(meetingId,
                                    Map.of(user1, List.of(intervalRes(100, 300), intervalRes(500, 1000)),
                                           user2, List.of(intervalRes(0, 1200), intervalRes(1300, 1500)),
                                           user3, List.of(intervalRes(200, 600), intervalRes(700, 1100))),
                                    List.of(intervalRes(200, 300), intervalRes(500, 600), intervalRes(700, 1000))));
    }

    private void verifyMeetingResponse(MeetingResponse expectedValue) {
        testClient.getMeeting(expectedValue.id())
                  .expectStatus()
                  .isOk()
                  .expectBody(MeetingResponse.class)
                  .isEqualTo(expectedValue);
    }

    private String createMeeting() {
        return Objects.requireNonNull(testClient.createMeetingAndReturnEntity().getResponseBody()).id();
    }

    private IntervalRequest intervalReq(int from, int to) {
        return new IntervalRequest(from, to);
    }

    private IntervalResponse intervalRes(int from, int to) {
        return new IntervalResponse(from, to);
    }
}
