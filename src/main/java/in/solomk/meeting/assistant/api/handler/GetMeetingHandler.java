package in.solomk.meeting.assistant.api.handler;

import in.solomk.meeting.assistant.api.dto.response.MeetingResponse;
import in.solomk.meeting.assistant.service.MeetingService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.HandlerFunction;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

@Component
@AllArgsConstructor
public class GetMeetingHandler implements HandlerFunction<ServerResponse> {

    private final MeetingService meetingService;

    @Override
    public Mono<ServerResponse> handle(ServerRequest request) {
        return meetingService.get(request.pathVariable("id"))
                             .map(MeetingResponse::valueOf)
                             .flatMap(meeting -> ServerResponse.ok()
                                                               .contentType(MediaType.APPLICATION_JSON)
                                                               .bodyValue(meeting))
                             .switchIfEmpty(ServerResponse.notFound().build());
    }
}
