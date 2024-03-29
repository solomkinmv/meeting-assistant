package in.solomk.meeting.assistant.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import in.solomk.meeting.assistant.api.dto.request.AddIntervalsRequest;
import in.solomk.meeting.assistant.api.dto.request.BatchIntervalsRequest;
import in.solomk.meeting.assistant.api.dto.request.IntervalRequest;
import in.solomk.meeting.assistant.api.dto.response.MeetingResponse;
import org.springframework.context.ApplicationContext;
import org.springframework.http.codec.json.Jackson2JsonDecoder;
import org.springframework.stereotype.Component;
import org.springframework.test.web.reactive.server.EntityExchangeResult;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.client.ExchangeStrategies;

import java.util.List;

@Component
public class MeetingsTestClient {

    private final WebTestClient webTestClient;

    public MeetingsTestClient(ApplicationContext context, ObjectMapper mapper) {
        var exchangeStrategiesWithCustomObjectMapper =
                ExchangeStrategies.builder()
                                  .codecs(configurer -> configurer.defaultCodecs()
                                                                  .jackson2JsonDecoder(new Jackson2JsonDecoder(mapper)))
                                  .build();
        webTestClient = WebTestClient.bindToApplicationContext(context)
                                     .configureClient()
                                     .exchangeStrategies(exchangeStrategiesWithCustomObjectMapper)
                                     .build();
    }

    public WebTestClient.ResponseSpec getIndexPage() {
        return webTestClient.get()
                            .uri("/")
                            .exchange();
    }

    public WebTestClient.ResponseSpec get404Page() {
        return webTestClient.get()
                            .uri("/404")
                            .exchange();
    }

    public WebTestClient.ResponseSpec getCustomPage() {
        return webTestClient.get()
                            .uri("/custom-page")
                            .exchange();
    }

    public WebTestClient.ResponseSpec createMeeting() {
        return webTestClient.post()
                            .uri("/api/meetings/")
                            .exchange();
    }

    public EntityExchangeResult<MeetingResponse> createMeetingAndReturnEntity() {
        return createMeeting()
                .expectBody(MeetingResponse.class)
                .returnResult();
    }

    public WebTestClient.ResponseSpec getMeeting(String meetingId) {
        return webTestClient.get()
                            .uri("/api/meetings/{id}", meetingId)
                            .exchange();
    }

    public EntityExchangeResult<MeetingResponse> getMeetingAndReturnEntity(String meetingId) {
        return getMeeting(meetingId)
                .expectBody(MeetingResponse.class)
                .returnResult();
    }

    public WebTestClient.ResponseSpec setIntervalsForUser(String meetingId, String username, List<IntervalRequest> intervals) {
        return webTestClient.put()
                            .uri("/api/meetings/{id}/intervals/{username}", meetingId, username)
                            .bodyValue(new BatchIntervalsRequest(intervals))
                            .exchange();
    }

    public WebTestClient.ResponseSpec addIntervalForUser(String meetingId, String username, IntervalRequest interval) {
        return webTestClient.post()
                            .uri("/api/meetings/{id}/intervals/{username}", meetingId, username)
                            .bodyValue(new AddIntervalsRequest(interval))
                            .exchange();
    }


    public WebTestClient.ResponseSpec removeIntervalsForUser(String meetingId, String username, IntervalRequest intervalRequest) {
        return webTestClient.delete()
                            .uri(uriBuilder -> uriBuilder
                                    .path("/api/meetings/{id}/intervals/{username}")
                                    .queryParam("from", intervalRequest.from())
                                    .queryParam("to", intervalRequest.to())
                                    .build(meetingId, username))
                            .exchange();
    }
}
