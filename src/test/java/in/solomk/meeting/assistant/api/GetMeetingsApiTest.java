package in.solomk.meeting.assistant.api;

import in.solomk.meeting.assistant.api.dto.response.MeetingResponse;
import org.junit.jupiter.api.Test;

public class GetMeetingsApiTest extends BaseFuncTest {

    private static final String MEETING_ID = "123";

    @Test
    void returnsMeetingResponse() {
        testClient.getMeeting(MEETING_ID)
                  .expectStatus()
                  .isOk()
                  .expectBody(MeetingResponse.class)
                  .isEqualTo(new MeetingResponse(MEETING_ID, null, null));
    }
}
