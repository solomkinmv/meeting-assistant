package in.solomk.meeting.assistant.service;

import in.solomk.meeting.assistant.service.model.Meeting;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class IntersectionEnricher {

    private final IntersectionsService intersectionsService;

    public Meeting withIntersectionDetails(Meeting meeting) {
        var intervalGroups = meeting.userIntervals().values().stream().toList();

        return meeting.withIntersections(intersectionsService.findIntersections(intervalGroups));
    }
}
