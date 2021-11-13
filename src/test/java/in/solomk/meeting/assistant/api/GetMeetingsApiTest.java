package in.solomk.meeting.assistant.api;

import in.solomk.meeting.assistant.config.RouteConfiguration;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.reactive.server.WebTestClient;

@SpringBootTest
public class GetMeetingsApiTest {

    private static final int MEETING_ID = 123;
    private WebTestClient webTestClient;

    @BeforeEach
    void setUp() {
        webTestClient = WebTestClient.bindToRouterFunction(new RouteConfiguration().routerFunction()).build();
    }

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
