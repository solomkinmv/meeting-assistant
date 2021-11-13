package in.solomk.meeting.assistant.config;

import in.solomk.meeting.assistant.dto.response.MeetingResponse;
import in.solomk.meeting.assistant.handler.CreateMeetingHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.http.MediaType.APPLICATION_JSON;

@Configuration
public class RouteConfiguration {

    @Bean
    public RouterFunction<ServerResponse> routerFunction(CreateMeetingHandler createMeetingHandler) {
        return RouterFunctions.route()
                .GET("/meetings/{id}", serverRequest -> ServerResponse.ok()
                        .contentType(APPLICATION_JSON)
                        .bodyValue(new MeetingResponse(serverRequest.pathVariable("id"))))
                .POST("/meetings/", createMeetingHandler)
                .build();
    }
}
