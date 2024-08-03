package S11P12A708.A708.common.error;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY;

@Getter
public enum ErrorCode {

    // Global
    REQUEST_INVALID(UNPROCESSABLE_ENTITY, "request", "invalid."),
    INTERNAL_SERVER(UNPROCESSABLE_ENTITY, "internal", "server error."),

    // User,
    USER_NOT_FOUND(UNPROCESSABLE_ENTITY, "user", "user not found."),
    USER_INVALID(UNPROCESSABLE_ENTITY, "user", "user request is incorrect."),
    USER_ALREADY_EXIST(UNPROCESSABLE_ENTITY, "user", "email is already exist."),
    INVALID_ACCESS(UNPROCESSABLE_ENTITY, "user", "Token userId does not match URL userId."),

    // Auth-Code
    FAIL_MAIL(UNPROCESSABLE_ENTITY, "auth-code", "failed to send email."),
    AUTH_CODE_NOT_FOUND(UNPROCESSABLE_ENTITY, "auth-code", "auth code not found."),
    AUTH_CODE_EXPIRED(UNPROCESSABLE_ENTITY, "auth-code", "auth code expired."),
    INVALID_AUTH_CODE(UNPROCESSABLE_ENTITY, "auth-code", "auth code is incorrect."),

    // Auth
    AUTH_NECESSARY(UNPROCESSABLE_ENTITY, "auth", "User did not verify the email."),
    NICKNAME_ALREADY_EXIST(UNPROCESSABLE_ENTITY, "auth", "Nickname is already exist."),
    INVALID_PASSWORD(UNPROCESSABLE_ENTITY, "auth", "password is incorrect."),
    INVALID_NICKNAME(UNPROCESSABLE_ENTITY, "auth", "nickname is incorrect."),
    FAIL_SING_UP(UNPROCESSABLE_ENTITY, "auth", "Sign up failed due to validation errors."),
    KAKAO_ALREADY_EXIST(UNPROCESSABLE_ENTITY, "auth", "Sign up failed due to validation errors."),

    // Team
    TEAM_NOT_FOUND(UNPROCESSABLE_ENTITY, "team", "This Team is not exist"),
    LEADER_LEAVE_EXCEPTION(UNPROCESSABLE_ENTITY, "team", "Team Leader cannot leave team"),
    LEADER_NOT(UNPROCESSABLE_ENTITY, "team", "user is not leader"),
    USER_NOT_TEAM(UNPROCESSABLE_ENTITY, "team", "this user does not have permission of this team"),
    TEAM_ALREADY_JOIN(UNPROCESSABLE_ENTITY, "team", "this user already joined"),

    // Calendar
    CALENDAR_NOT_FOUND(UNPROCESSABLE_ENTITY, "calendar", "This Calendar is not exist"),
    CALENDAR_TIME_FORMAT(UNPROCESSABLE_ENTITY, "calendar", "Calendar time format is invaild"),

    //Folder
    FOLDER_NOT_FOUND(UNPROCESSABLE_ENTITY, "folder", "This Folder is not exist"),
    FOLDER_NAME_DUPLICATE(UNPROCESSABLE_ENTITY, "folder", "This Folder name already exist"),
    FOLDER_NOT_BELONG_TO_TEAM(UNPROCESSABLE_ENTITY, "folder", "Folder does not belong to the specified team"),

    // file
    FILE_NOT_FOUND(UNPROCESSABLE_ENTITY, "file", "This file is not exist"),
    FILE_NAME_DUPLICATE(UNPROCESSABLE_ENTITY, "file", "This file name already exist"),
    FOLDER_NOT_PROBLEM_INFO(UNPROCESSABLE_ENTITY, "file", "this folder cannot have code file"),

    // Study
    STUDY_NOT_FOUND(UNPROCESSABLE_ENTITY, "study", "This study is not exist"),
    STUDY_NOT_BELONG_TO_TEAM(UNPROCESSABLE_ENTITY, "study", "study does not belong to the specified team");

    private final HttpStatus code;
    private final String body;
    private final String message;

    ErrorCode(HttpStatus code, String body, String message) {
        this.code = code;
        this.body = body;
        this.message = message;
    }

}