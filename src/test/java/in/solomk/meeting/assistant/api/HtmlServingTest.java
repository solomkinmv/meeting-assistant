package in.solomk.meeting.assistant.api;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

public class HtmlServingTest extends BaseFuncTest {

    @Test
    void servesStaticIndexHtml() {
        testClient.getIndexPage()
                  .expectStatus()
                  .isOk()
                .expectHeader()
                .contentType(MediaType.TEXT_HTML);
    }
}
