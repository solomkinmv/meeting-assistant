package in.solomk.meeting.assistant.api.handler;

import in.solomk.meeting.assistant.api.dto.request.AddIntervalsRequest;
import in.solomk.meeting.assistant.api.dto.response.MeetingResponse;
import in.solomk.meeting.assistant.api.validation.AddIntervalRequestValidator;
import in.solomk.meeting.assistant.service.MeetingService;
import in.solomk.meeting.assistant.service.model.Meeting;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.HandlerFunction;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import static org.springframework.http.MediaType.APPLICATION_JSON;

@Component
@AllArgsConstructor
public class AddIntervalsHandler implements HandlerFunction<ServerResponse> {

    private final MeetingService meetingService;
    private final AddIntervalRequestValidator validator;

    @Override
    public Mono<ServerResponse> handle(ServerRequest request) {
        return ServerResponse.ok()
                             .contentType(APPLICATION_JSON)
                             .body(extractSortedRequestBody(request)
                                           .flatMap(validator::validateIntervals)
                                           .flatMap(addIntervalRequest -> addIntervalForMeeting(request, addIntervalRequest))
                                           .map(MeetingResponse::valueOf),
                                   MeetingResponse.class);
    }

    private Mono<Meeting> addIntervalForMeeting(ServerRequest request, AddIntervalsRequest addIntervalRequest) {
        return meetingService.addIntervalForUser(request.pathVariable("id"),
                                                 request.pathVariable("username"),
                                                 addIntervalRequest.interval().toModel());
    }

    private Mono<AddIntervalsRequest> extractSortedRequestBody(ServerRequest request) {
        return request.bodyToMono(AddIntervalsRequest.class);
    }
}
