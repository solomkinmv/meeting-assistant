package in.solomk.meeting.assistant.api;

import in.solomk.meeting.assistant.client.MeetingsTestClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
public class BaseFuncTest {

    @Autowired
    protected MeetingsTestClient testClient;

}
