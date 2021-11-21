package in.solomk.meeting.assistant.api;

import in.solomk.meeting.assistant.api.dto.request.IntervalRequest;
import in.solomk.meeting.assistant.api.dto.response.IntervalResponse;
import in.solomk.meeting.assistant.api.dto.response.MeetingResponse;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import static java.util.Collections.emptyList;

public class UpdateMeetingsApiTest extends BaseFuncTest {

    private static final String MEETING_ID = "123";
    private static final String USER_1 = "user-1";
    private static final String USER_2 = "user-2";

    @Test
    void receivesErrorIfNoMeetingOnUpdate() {
        // todo: implement global exception handler and verify error message
        testClient.setIntervalsForUser(MEETING_ID, USER_1,
                                       List.of(intervalReq(100, 200), intervalReq(201, 300)))
                  .expectStatus()
                  .is5xxServerError()
                  .expectBody();
//                  .jsonPath("$.message").isEqualTo("no meeting in database")
    }

    @Test
    void receivesErrorIfIntervalsIntersect() {
        // todo: implement global exception handler and verify error message
        String meetingId = createMeeting();

        testClient.setIntervalsForUser(meetingId, USER_1, List.of(intervalReq(100, 200),
                                                                  intervalReq(200, 201)))
                  .expectStatus()
                  .is5xxServerError();
    }

    @Test
    void updatesIntervalsForUsers() {
        String meetingId = createMeeting();
        var expectedMeetingResponse = new MeetingResponse(meetingId,
                                                          Map.of(USER_1, List.of(intervalRes(100, 200),
                                                                                 intervalRes(300, 400))),
                                                          emptyList());

        testClient.setIntervalsForUser(meetingId, USER_1,
                                       List.of(intervalReq(100, 200),
                                               intervalReq(300, 400)))
                  .expectStatus()
                  .isOk()
                  .expectBody(MeetingResponse.class)
                  .isEqualTo(expectedMeetingResponse);
    }

    @Test
    void replacesIntervalsForUser() {
        String meetingId = createMeeting();
        var expectedMeetingResponse = new MeetingResponse(meetingId,
                                                          Map.of(USER_1, List.of(intervalRes(150, 200))),
                                                          emptyList());


        testClient.setIntervalsForUser(meetingId, USER_1, List.of(intervalReq(100, 200)));
        testClient.setIntervalsForUser(meetingId, USER_1,
                                                             List.of(intervalReq(150, 200)))
                                        .expectStatus()
                                        .isOk()
                                        .expectBody(MeetingResponse.class)
                                        .isEqualTo(expectedMeetingResponse);
    }

    @Test
    void updatesMultipleUsers() {
        String meetingId = createMeeting();
        var expectedMeetingResponse = new MeetingResponse(meetingId,
                                                          Map.of(USER_1, List.of(intervalRes(100, 200),
                                                                                 intervalRes(300, 400)),
                                                                 USER_2, List.of(intervalRes(150, 250))),
                                                          List.of(intervalRes(150, 200)));

        testClient.setIntervalsForUser(meetingId, USER_1, List.of(intervalReq(100, 200), intervalReq(300, 400)));
        testClient.setIntervalsForUser(meetingId, USER_2, List.of(intervalReq(150, 250)))
                  .expectStatus()
                  .isOk()
                  .expectBody(MeetingResponse.class)
                  .isEqualTo(expectedMeetingResponse);

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
