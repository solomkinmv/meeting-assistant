package in.solomk.meeting.assistant.api.handler;

import in.solomk.meeting.assistant.api.dto.request.BatchIntervalsRequest;
import in.solomk.meeting.assistant.api.dto.request.IntervalRequest;
import in.solomk.meeting.assistant.api.validation.IntersectionValidator;
import in.solomk.meeting.assistant.repository.model.MeetingEntity;
import in.solomk.meeting.assistant.service.MeetingService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.HandlerFunction;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.Comparator;

import static in.solomk.meeting.assistant.util.ConversionUtils.mapToList;
import static org.springframework.http.MediaType.APPLICATION_JSON;

@Component
@AllArgsConstructor
public class UpdateIntervalsHandler implements HandlerFunction<ServerResponse> {

    private final MeetingService meetingService;
    private final IntersectionValidator validator;

    @Override
    public Mono<ServerResponse> handle(ServerRequest request) {
        return ServerResponse.ok()
                             .contentType(APPLICATION_JSON)
                             .body(extractSortedRequestBody(request)
                                           .flatMap(validator::validateNoIntersections)
                                           .flatMap(batchRequest -> meetingService.setIntervalsForUser(
                                                   request.pathVariable("id"),
                                                   request.pathVariable("username"),
                                                   mapToList(batchRequest.intervals(), IntervalRequest::toModel))),
                                   MeetingEntity.class);
    }

    private Mono<BatchIntervalsRequest> extractSortedRequestBody(ServerRequest request) {
        return request.bodyToMono(BatchIntervalsRequest.class)
                      .map(batchRequest -> {
                          ArrayList<IntervalRequest> requestsCopy = new ArrayList<>(batchRequest.intervals());
                          requestsCopy.sort(Comparator.comparingLong(IntervalRequest::from));
                          return new BatchIntervalsRequest(requestsCopy);
                      });

    }
}
