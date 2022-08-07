package in.solomk.meeting.assistant.api.validation;

import in.solomk.meeting.assistant.api.dto.request.AddIntervalsRequest;
import in.solomk.meeting.assistant.exception.ValidationException;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class AddIntervalRequestValidator {

    public Mono<AddIntervalsRequest> validateIntervals(AddIntervalsRequest addIntervalsRequest) {
        if (addIntervalsRequest == null) {
            return Mono.error(new ValidationException("Intervals from request are invalid. Received null"));
        }
        if (addIntervalsRequest.interval() == null) {
            return Mono.error(new ValidationException("Intervals from request are invalid. Received null"));
        }

        if (addIntervalsRequest.interval().from() < 0 || addIntervalsRequest.interval().to() < 0) {
            return Mono.error(new ValidationException("Intervals from request are invalid. Received intervals with negative values: %s", addIntervalsRequest));
        }

        if (addIntervalsRequest.interval().from() >= addIntervalsRequest.interval().to()) {
            return Mono.error(new ValidationException("Intervals from request are invalid. Received intervals with from date greater than to: %s", addIntervalsRequest));
        }

        return Mono.just(addIntervalsRequest);
    }
}
