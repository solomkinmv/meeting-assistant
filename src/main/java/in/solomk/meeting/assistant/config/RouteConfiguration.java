package in.solomk.meeting.assistant.config;

import in.solomk.meeting.assistant.api.handler.CreateMeetingHandler;
import in.solomk.meeting.assistant.api.handler.GetMeetingHandler;
import in.solomk.meeting.assistant.api.handler.UpdateIntervalsHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.reactive.function.server.HandlerFunction;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

@Configuration
public class RouteConfiguration {

    @Bean
    RouterFunction<ServerResponse> routerFunction(GetMeetingHandler getMeetingHandler,
                                                  CreateMeetingHandler createMeetingHandler,
                                                  UpdateIntervalsHandler updateIntervalsHandler) {
        HandlerFunction<ServerResponse> indexPage = (req) -> ServerResponse.ok().bodyValue(new ClassPathResource("public/index.html"));
        return RouterFunctions.route()
                              .GET("/api/meetings/{id}", getMeetingHandler)
                              .POST("/api/meetings/", createMeetingHandler)
                              .PUT("/api/meetings/{id}/intervals/{username}", updateIntervalsHandler)
                              .resources("/**", new ClassPathResource("/public/"))
                              .GET("/**", indexPage)
                              .build();
    }

    @Bean
    @Profile("mongo")
    CorsWebFilter corsFilter() {
        return new CorsWebFilter(exchange -> new CorsConfiguration().applyPermitDefaultValues());
    }

    @Bean
    @Profile("!mongo")
    CorsWebFilter permissiveCorsFilter() {
        return new CorsWebFilter(exchange -> {
            CorsConfiguration config = new CorsConfiguration();
            config.addAllowedOrigin("*");
            config.addAllowedHeader("*");
            config.addAllowedMethod("*");
            return config;
        });
    }
}
