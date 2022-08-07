package in.solomk.meeting.assistant.api.validation;

import in.solomk.meeting.assistant.api.dto.request.IntervalRequest;
import in.solomk.meeting.assistant.exception.ValidationException;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class IntervalValidator {

    public Mono<IntervalRequest> validate(IntervalRequest interval) {
        if (interval == null) {
            var exception = new ValidationException("Intervals from request are invalid. Received null");
            return Mono.error(exception);
        }
        if (interval.from() < 0 || interval.to() < 0) {
            var exception = new ValidationException(
                    "Intervals from request are invalid. Received interval with negative value: %s", interval);
            return Mono.error(exception);
        }

        if (interval.from() >= interval.to()) {
            var exception = new ValidationException("Intervals from request are invalid. Received interval with from date greater than to: %s", interval);
            return Mono.error(exception);
        }
        return Mono.just(interval);
    }
}
