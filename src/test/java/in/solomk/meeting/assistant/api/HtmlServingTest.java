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
                .contentType(MediaType.TEXT_HTML)
                .expectBody()
                .xpath("//head/title").isEqualTo("Meeting Assistant")
                .xpath("//body/h1").isEqualTo("Meeting Assistant");
    }

    @Test
    void serves404HtmlPage() {
        testClient.get404Page()
                  .expectStatus()
                  .isOk()
                  .expectHeader()
                  .contentType(MediaType.TEXT_HTML)
                  .expectBody()
                  .xpath("//head/title").isEqualTo("Meeting Not Found")
                  .xpath("//body/h1").isEqualTo("Oops, there's no such meeting");
    }

}
