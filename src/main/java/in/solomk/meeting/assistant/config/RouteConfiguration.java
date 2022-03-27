package in.solomk.meeting.assistant.config;

import in.solomk.meeting.assistant.api.handler.CreateMeetingHandler;
import in.solomk.meeting.assistant.api.handler.GetMeetingHandler;
import in.solomk.meeting.assistant.api.handler.UpdateIntervalsHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.reactive.function.server.HandlerFunction;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

@Configuration
public class RouteConfiguration {

    @Bean
    public RouterFunction<ServerResponse> routerFunction(GetMeetingHandler getMeetingHandler,
                                                         CreateMeetingHandler createMeetingHandler,
                                                         UpdateIntervalsHandler updateIntervalsHandler) {
        HandlerFunction<ServerResponse> indexPage = (req) -> ServerResponse.ok().bodyValue(new ClassPathResource("app/index.html"));
        HandlerFunction<ServerResponse> meetingPage = (req) -> ServerResponse.ok().bodyValue(new ClassPathResource("app/meeting.html"));
        return RouterFunctions.route()
                              .GET("/api/meetings/{id}", getMeetingHandler)
                              .POST("/api/meetings/", createMeetingHandler)
                              .PUT("/api/meetings/{id}/intervals/{username}", updateIntervalsHandler)
                              .GET("/", indexPage)
                              .GET("/meeting/{meetingId}", meetingPage)
                              .build();
    }
}
