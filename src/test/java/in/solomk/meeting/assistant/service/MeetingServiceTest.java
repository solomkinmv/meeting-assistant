package in.solomk.meeting.assistant.service;

import in.solomk.meeting.assistant.exception.PersistenceException;
import in.solomk.meeting.assistant.service.model.Interval;
import in.solomk.meeting.assistant.service.model.Meeting;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;
import static pl.rzrz.assertj.reactor.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class MeetingServiceTest {

    private static final String MEETING_ID = "meeting-id";
    private static final String USER_ID = "user-id";
    @Mock
    private MeetingRepository repository;
    @Mock
    private IntersectionEnricher intersectionEnricher;
    private MeetingService meetingService;

    @BeforeEach
    void setUp() {
        meetingService = new MeetingService(repository, intersectionEnricher);
    }

    private void mockEnricher() {
        doAnswer(invocation -> invocation.getArgument(0))
                .when(intersectionEnricher).withIntersectionDetails(any(Meeting.class));
    }

    private void mockSaveOperation() {
        doAnswer(invocation -> Mono.just(invocation.getArgument(0)))
                .when(repository).saveMeeting(any(Meeting.class));
    }

    @Test
    void addsIntervalToNonExistingUser() {
        mockSaveOperation();
        mockEnricher();
        when(repository.getMeetingById(MEETING_ID))
                .thenReturn(Mono.just(Meeting.empty(MEETING_ID)));

        Interval newInterval = new Interval(1, 2);
        Mono<Meeting> meetingMono = meetingService.addIntervalForUser(MEETING_ID, USER_ID, newInterval);

        assertThat(meetingMono)
                .emits(new Meeting(MEETING_ID, Map.of(USER_ID, List.of(newInterval))));
    }

    @Test
    void addsIntervalToEndOfUserIntervals() {
        mockSaveOperation();
        mockEnricher();
        Interval oldInterval = new Interval(1, 2);
        when(repository.getMeetingById(MEETING_ID))
                .thenReturn(Mono.just(Meeting.empty(MEETING_ID).withUserIntervals(USER_ID, List.of(oldInterval))));

        Interval newInterval = new Interval(3, 4);
        Mono<Meeting> meetingMono = meetingService.addIntervalForUser(MEETING_ID, USER_ID, newInterval);

        assertThat(meetingMono)
                .emits(new Meeting(MEETING_ID, Map.of(USER_ID, List.of(oldInterval, newInterval))));
    }

    @Test
    void addsIntervalToTheBeginningOfUserIntervals() {
        mockSaveOperation();
        mockEnricher();
        Interval oldInterval = new Interval(3, 4);
        when(repository.getMeetingById(MEETING_ID))
                .thenReturn(Mono.just(Meeting.empty(MEETING_ID).withUserIntervals(USER_ID, List.of(oldInterval))));

        Interval newInterval = new Interval(1, 2);
        Mono<Meeting> meetingMono = meetingService.addIntervalForUser(MEETING_ID, USER_ID, newInterval);

        assertThat(meetingMono)
                .emits(new Meeting(MEETING_ID, Map.of(USER_ID, List.of(newInterval, oldInterval))));
    }

    @Test
    void insertsIntervalInCorrectPosition() {
        mockSaveOperation();
        mockEnricher();
        Interval oldInterval1 = new Interval(1, 2);
        Interval oldInterval2 = new Interval(5, 6);
        when(repository.getMeetingById(MEETING_ID))
                .thenReturn(Mono.just(Meeting.empty(MEETING_ID).withUserIntervals(USER_ID, List.of(oldInterval1, oldInterval2))));

        Interval newInterval = new Interval(3, 4);
        Mono<Meeting> meetingMono = meetingService.addIntervalForUser(MEETING_ID, USER_ID, newInterval);

        assertThat(meetingMono)
                .emits(new Meeting(MEETING_ID, Map.of(USER_ID, List.of(oldInterval1, newInterval, oldInterval2))));
    }

    @Test
    void mergesIntervalsAtTheBeginning() {
        mockSaveOperation();
        mockEnricher();
        Interval oldInterval1 = new Interval(1, 2);
        Interval oldInterval2 = new Interval(3, 4);
        Interval oldInterval3 = new Interval(5, 6);
        when(repository.getMeetingById(MEETING_ID))
                .thenReturn(Mono.just(Meeting.empty(MEETING_ID).withUserIntervals(USER_ID, List.of(oldInterval1, oldInterval2, oldInterval3))));

        Interval newInterval = new Interval(0, 3);
        Mono<Meeting> meetingMono = meetingService.addIntervalForUser(MEETING_ID, USER_ID, newInterval);

        assertThat(meetingMono)
                .emits(new Meeting(MEETING_ID, Map.of(USER_ID, List.of(new Interval(0, 4), oldInterval3))));
    }

    @Test
    void mergesIntervalsAtTheEnd() {
        mockSaveOperation();
        mockEnricher();
        Interval oldInterval1 = new Interval(1, 2);
        Interval oldInterval2 = new Interval(3, 4);
        Interval oldInterval3 = new Interval(5, 6);
        when(repository.getMeetingById(MEETING_ID))
                .thenReturn(Mono.just(Meeting.empty(MEETING_ID).withUserIntervals(USER_ID, List.of(oldInterval1, oldInterval2, oldInterval3))));

        Interval newInterval = new Interval(3, 7);
        Mono<Meeting> meetingMono = meetingService.addIntervalForUser(MEETING_ID, USER_ID, newInterval);

        assertThat(meetingMono)
                .emits(new Meeting(MEETING_ID, Map.of(USER_ID, List.of(oldInterval1, new Interval(3, 7)))));
    }

    @Test
    void mergesEverythingInOneInterval() {
        mockSaveOperation();
        mockEnricher();
        Interval oldInterval1 = new Interval(1, 2);
        Interval oldInterval2 = new Interval(3, 4);
        Interval oldInterval3 = new Interval(5, 6);
        when(repository.getMeetingById(MEETING_ID))
                .thenReturn(Mono.just(Meeting.empty(MEETING_ID).withUserIntervals(USER_ID, List.of(oldInterval1, oldInterval2, oldInterval3))));

        Interval newInterval = new Interval(0, 7);
        Mono<Meeting> meetingMono = meetingService.addIntervalForUser(MEETING_ID, USER_ID, newInterval);

        assertThat(meetingMono)
                .emits(new Meeting(MEETING_ID, Map.of(USER_ID, List.of(newInterval))));
    }

    @Test
    void returnsErrorIfNoMeetingInDatabase() {
        when(repository.getMeetingById(MEETING_ID))
                .thenReturn(Mono.empty());

        Interval newInterval = new Interval(1, 2);
        Mono<Meeting> meetingMono = meetingService.addIntervalForUser(MEETING_ID, USER_ID, newInterval);

        assertThat(meetingMono)
                .sendsError(error -> {
                    assertThat(error).isInstanceOf(PersistenceException.class);
                    assertThat(error.getMessage()).isEqualTo("Meeting %s is missing in the database".formatted(MEETING_ID));
                });
    }
}
