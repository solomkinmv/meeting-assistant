package in.solomk.meeting.assistant.api.validation;

import in.solomk.meeting.assistant.api.dto.request.BatchIntervalsRequest;
import in.solomk.meeting.assistant.exception.ValidationException;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class IntersectionValidator {

    // todo: validate when from greater then to
    // todo: validate when two intervals can be joined
    public Mono<BatchIntervalsRequest> validateNoIntersections(BatchIntervalsRequest batchRequest) {
        var intervals = batchRequest.intervals();
        for (int i = 1; i < intervals.size(); i++) {
            if (intervals.get(i).from() <= intervals.get(i - 1).to()) {
                var exception = new ValidationException(
                        "Intervals from request are invalid. Received intervals with intersection: %s", intervals);
                return Mono.error(exception);
            }
        }
        return Mono.just(batchRequest);
    }
}
