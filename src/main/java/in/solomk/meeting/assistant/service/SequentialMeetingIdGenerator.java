package in.solomk.meeting.assistant.service;

import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicLong;

@Component
public class SequentialMeetingIdGenerator implements MeetingIdGenerator {

    private final AtomicLong atomicLong = new AtomicLong(1);

    @Override
    public String generateId() {
        return String.valueOf(atomicLong.getAndIncrement());
    }
}
