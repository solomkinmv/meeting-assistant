package in.solomk.meeting.assistant.api;

import in.solomk.meeting.assistant.client.MeetingsTestClient;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.web.reactive.server.WebTestClient;

@SpringBootTest
public class BaseFuncTest {

    @Autowired
    protected MeetingsTestClient testClient;

}
