package in.solomk.meeting.assistant.config;

import in.solomk.meeting.assistant.api.dto.response.MeetingResponse;
import in.solomk.meeting.assistant.api.handler.CreateMeetingHandler;
import in.solomk.meeting.assistant.api.handler.UpdateIntervalsHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.http.MediaType.APPLICATION_JSON;

@Configuration
public class RouteConfiguration {

    @Bean
    public RouterFunction<ServerResponse> routerFunction(CreateMeetingHandler createMeetingHandler,
                                                         UpdateIntervalsHandler updateIntervalsHandler) {
        return RouterFunctions.route()
                              .GET("/meetings/{id}", serverRequest -> ServerResponse.ok()
                                                                                    .contentType(APPLICATION_JSON)
                                                                                    .bodyValue(new MeetingResponse(serverRequest.pathVariable("id"), null)))
                              .POST("/meetings/", createMeetingHandler)
                              .PUT("/meetings/{id}/intervals/{username}", updateIntervalsHandler)
                              .build();
    }
}
