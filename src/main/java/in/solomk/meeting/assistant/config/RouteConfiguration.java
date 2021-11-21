package in.solomk.meeting.assistant.config;

import in.solomk.meeting.assistant.api.handler.CreateMeetingHandler;
import in.solomk.meeting.assistant.api.handler.GetMeetingHandler;
import in.solomk.meeting.assistant.api.handler.UpdateIntervalsHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

@Configuration
public class RouteConfiguration {

    @Bean
    public RouterFunction<ServerResponse> routerFunction(GetMeetingHandler getMeetingHandler,
                                                         CreateMeetingHandler createMeetingHandler,
                                                         UpdateIntervalsHandler updateIntervalsHandler) {
        return RouterFunctions.route()
                              .GET("/meetings/{id}", getMeetingHandler)
                              .POST("/meetings/", createMeetingHandler)
                              .PUT("/meetings/{id}/intervals/{username}", updateIntervalsHandler)
                              .build();
    }
}
