FROM eclipse-temurin:17-jre-alpine
WORKDIR app
COPY maven/${project.build.finalName}.jar .
ENTRYPOINT ["java", "-jar", "${project.build.finalName}.jar"]
