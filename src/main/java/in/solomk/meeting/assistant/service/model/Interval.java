package in.solomk.meeting.assistant.service.model;

public record Interval(long from, long to) {

    public boolean intersect(Interval other) {
        return from <= other.to && to > other.from;
    }
}
