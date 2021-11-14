package in.solomk.meeting.assistant.api;

import org.junit.jupiter.api.Test;

public class GetMeetingsApiTest extends BaseFuncTest {

    private static final String MEETING_ID = "123";

    @Test
    void returnsMeetingResponse() {
        testClient.getMeeting(MEETING_ID)
                     .expectStatus()
                     .isOk()
                     .expectBody()
                     .jsonPath("$.id").isEqualTo(MEETING_ID);
    }
}
