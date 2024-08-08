# Use OpenJDK 17 as the base image for building the application
FROM openjdk:17-jdk-slim as builder

# Copy necessary files for building the project
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src

# Make the gradlew script executable
RUN chmod +x ./gradlew

# Build the Spring Boot application
RUN ./gradlew bootJar

# Use a slimmer OpenJDK 17 image for the final container
FROM openjdk:17-jdk-slim

# Install Docker CLI
RUN apt-get update && \
    apt-get install -y docker.io && \
    rm -rf /var/lib/apt/lists/*

# Copy the built JAR file from the builder stage
COPY --from=builder build/libs/*.jar app.jar

# Expose the port the application will run on
EXPOSE 8080

# ARG to accept build-time variable and set it as an environment variable
ARG SERVER_MODE
RUN echo "$SERVER_MODE"
ENV SERVER_MODE=$SERVER_MODE

# Entry point to run the Spring Boot application
ENTRYPOINT ["java", "-Dspring.profiles.active=${SERVER_MODE}","-Duser.timezone=Asia/Seoul", "-jar", "/app.jar"]
