package in.solomk.meeting.assistant.api;

import org.junit.jupiter.api.Test;

public class GetMeetingsApiTest extends BaseFuncTest {

    private static final int MEETING_ID = 123;

    @Test
    void returnsMeetingResponse() {
        webTestClient.get()
                     .uri("/meetings/{id}", MEETING_ID)
                     .exchange()
                     .expectStatus()
                     .isOk()
                     .expectBody()
                     .jsonPath("$.id").isEqualTo(MEETING_ID);
    }
}
