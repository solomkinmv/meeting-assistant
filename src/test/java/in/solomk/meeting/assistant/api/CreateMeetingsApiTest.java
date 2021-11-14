package in.solomk.meeting.assistant.api;

import org.junit.jupiter.api.Test;

import static org.hamcrest.Matchers.blankOrNullString;
import static org.hamcrest.Matchers.not;

public class CreateMeetingsApiTest extends BaseFuncTest {

    @Test
    void createsMeeting() {
        testClient.createMeeting()
                  .expectStatus()
                  .isOk()
                  .expectBody()
                  .jsonPath("$.id").value(not(blankOrNullString()));

    }
}
