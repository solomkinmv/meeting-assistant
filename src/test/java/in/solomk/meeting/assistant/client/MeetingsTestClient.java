package in.solomk.meeting.assistant.client;

import in.solomk.meeting.assistant.api.dto.request.BatchIntervalsRequest;
import in.solomk.meeting.assistant.api.dto.request.IntervalRequest;
import in.solomk.meeting.assistant.api.dto.response.MeetingResponse;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import org.springframework.test.web.reactive.server.EntityExchangeResult;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.util.List;

@Component
public class MeetingsTestClient {

    private final WebTestClient webTestClient;

    public MeetingsTestClient(ApplicationContext context) {
        webTestClient = WebTestClient.bindToApplicationContext(context).build();
    }

    public WebTestClient.ResponseSpec createMeeting() {
        return webTestClient.post()
                            .uri("/meetings/")
                            .exchange();
    }

    public EntityExchangeResult<MeetingResponse> createMeetingAndGetEntity() {
        return createMeeting()
                .expectBody(MeetingResponse.class)
                .returnResult();
    }

    public WebTestClient.ResponseSpec getMeeting(String meetingId) {
        return webTestClient.get()
                            .uri("/meetings/{id}", meetingId)
                            .exchange();
    }

    public WebTestClient.ResponseSpec setIntervalsForUser(String meetingId, String username, List<IntervalRequest> intervals) {
        return webTestClient.put()
                            .uri("/meetings/{id}/intervals/{username}", meetingId, username)
                            .bodyValue(new BatchIntervalsRequest(intervals))
                            .exchange();
    }
}
