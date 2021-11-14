package in.solomk.meeting.assistant.api.handler;

import in.solomk.meeting.assistant.repository.model.MeetingEntity;
import in.solomk.meeting.assistant.service.MeetingService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.HandlerFunction;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import static org.springframework.http.MediaType.APPLICATION_JSON;

@AllArgsConstructor
@Component
public class CreateMeetingHandler implements HandlerFunction<ServerResponse> {

    private final MeetingService meetingService;

    @Override
    public Mono<ServerResponse> handle(ServerRequest request) {
        return ServerResponse.ok() // todo: migrate to created
                             .contentType(APPLICATION_JSON)
                             .body(meetingService.create(), MeetingEntity.class);
    }
}
