package in.solomk.meeting.assistant.api.validation;

import in.solomk.meeting.assistant.api.dto.request.BatchIntervalsRequest;
import in.solomk.meeting.assistant.api.dto.request.IntervalRequest;
import in.solomk.meeting.assistant.exception.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class IntersectionValidatorTest {

    private IntersectionValidator intersectionValidator;

    @BeforeEach
    void setUp() {
        intersectionValidator = new IntersectionValidator();
    }

    @Test
    void returnsErrorIfTimestampStartNegative() {
        Mono<BatchIntervalsRequest> result = intersectionValidator.validateIntervals(new BatchIntervalsRequest(
                List.of(new IntervalRequest(10, 30),
                        new IntervalRequest(-10, 30))));

        StepVerifier.create(result)
                    .expectErrorSatisfies(throwable -> {
                        assertThat(throwable).isInstanceOf(ValidationException.class);
                        assertThat(throwable).hasMessageStartingWith("Intervals from request are invalid. Received intervals with negative values");
                    })
                    .verify();
    }

    @Test
    void returnsErrorIfTimestampEndNegative() {
        Mono<BatchIntervalsRequest> result = intersectionValidator.validateIntervals(new BatchIntervalsRequest(
                List.of(new IntervalRequest(10, 30),
                        new IntervalRequest(40, -30))));

        StepVerifier.create(result)
                    .expectErrorSatisfies(throwable -> {
                        assertThat(throwable).isInstanceOf(ValidationException.class);
                        assertThat(throwable).hasMessageStartingWith("Intervals from request are invalid. Received intervals with negative values");
                    })
                    .verify();
    }

    @Test
    void returnsErrorIfIntervalReversed() {
        Mono<BatchIntervalsRequest> result = intersectionValidator.validateIntervals(new BatchIntervalsRequest(
                List.of(new IntervalRequest(10, 30),
                        new IntervalRequest(70, 40))));

        StepVerifier.create(result)
                    .expectErrorSatisfies(throwable -> {
                        assertThat(throwable).isInstanceOf(ValidationException.class);
                        assertThat(throwable).hasMessageStartingWith("Intervals from request are invalid. Received intervals with from date greater than to");
                    })
                    .verify();
    }

    @Test
    void returnsErrorIfIntervalsIntersect() {
        Mono<BatchIntervalsRequest> result = intersectionValidator.validateIntervals(new BatchIntervalsRequest(
                List.of(new IntervalRequest(10, 30),
                        new IntervalRequest(20, 40))));

        StepVerifier.create(result)
                    .expectErrorSatisfies(throwable -> {
                        assertThat(throwable).isInstanceOf(ValidationException.class);
                        assertThat(throwable).hasMessageStartingWith("Intervals from request are invalid. Received intervals with intersection");
                    })
                    .verify();
    }

}
