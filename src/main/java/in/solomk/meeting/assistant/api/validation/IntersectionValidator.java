package in.solomk.meeting.assistant.api.validation;

import in.solomk.meeting.assistant.api.dto.request.BatchIntervalsRequest;
import in.solomk.meeting.assistant.exception.ValidationException;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class IntersectionValidator {

    public Mono<BatchIntervalsRequest> validateIntervals(BatchIntervalsRequest batchRequest) {
        var intervals = batchRequest.intervals();
        for (var interval : intervals) {
            if (interval.from() < 0 || interval.to() < 0) {
                var exception = new ValidationException(
                        "Intervals from request are invalid. Received intervals with negative values: %s", intervals);
                return Mono.error(exception);
            }

            if (interval.from() >= interval.to()) {
                var exception = new ValidationException("Intervals from request are invalid. Received intervals with from date greater than to: %s", intervals);
                return Mono.error(exception);
            }
        }

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
