package in.solomk.meeting.assistant.api.handler;

import in.solomk.meeting.assistant.api.dto.request.IntervalRequest;
import in.solomk.meeting.assistant.api.dto.response.MeetingResponse;
import in.solomk.meeting.assistant.api.validation.IntervalValidator;
import in.solomk.meeting.assistant.service.MeetingService;
import in.solomk.meeting.assistant.service.model.Interval;
import in.solomk.meeting.assistant.service.model.Meeting;
import lombok.AllArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.HandlerFunction;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import static org.springframework.http.MediaType.APPLICATION_JSON;

@Component
@AllArgsConstructor
public class DeleteIntervalsHandler implements HandlerFunction<ServerResponse> {

    private final MeetingService meetingService;
    private final IntervalValidator validator;

    private static Mono<Long> extractLongQueryParam(ServerRequest request, String from) {
        return Mono.justOrEmpty(request.queryParam(from))
                   .map(Long::parseLong);
    }

    @NonNull
    @Override
    public Mono<ServerResponse> handle(@NonNull ServerRequest request) {
        return ServerResponse.ok()
                             .contentType(APPLICATION_JSON)
                             .body(extractRequestBody(request)
                                           .flatMap(validator::validate)
                                           .flatMap(intervalRequest -> deleteIntervalsFromMeeting(request, intervalRequest.toModel()))
                                           .map(MeetingResponse::valueOf),
                                   MeetingResponse.class);
    }

    private Mono<Meeting> deleteIntervalsFromMeeting(ServerRequest request, Interval interval) {
        return meetingService.deleteIntervalsForUser(request.pathVariable("id"),
                                                     request.pathVariable("username"),
                                                     interval);
    }

    private Mono<IntervalRequest> extractRequestBody(ServerRequest request) {
        return extractLongQueryParam(request, "from")
                .flatMap(from -> extractLongQueryParam(request, "to")
                        .map(to -> new IntervalRequest(from, to)));
    }
}
