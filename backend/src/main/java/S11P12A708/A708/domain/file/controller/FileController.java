package S11P12A708.A708.domain.file.controller;

import S11P12A708.A708.domain.auth.annotation.AuthUser;
import S11P12A708.A708.domain.auth.request.AuthUserDto;
import S11P12A708.A708.domain.file.request.FileCreateRequest;
import S11P12A708.A708.domain.file.request.FileUpdateRequest;
import S11P12A708.A708.domain.file.service.FileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping("/teams/{teamId}/file")
    public ResponseEntity<Void> createNormalFile(
            @PathVariable("teamId") Long teamId,
            @Valid @RequestBody FileCreateRequest request) {
        fileService.createNormalFile(teamId, request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("/teams/{teamId}/file/{fileId}")
    public ResponseEntity<Void> updateNormalFile(
            @PathVariable("teamId") Long teamId,
            @PathVariable("fileId") Long fileId,
            @Valid @RequestBody FileUpdateRequest request) {
        fileService.updateNormalFile(teamId, fileId, request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/teams/{teamId}/file/code")
    public ResponseEntity<Void> createCodeFile(
            @AuthUser AuthUserDto authUser,
            @PathVariable("teamId") Long teamId,
            @Valid @RequestBody FileCreateRequest request) {
        fileService.createCodeFile(teamId, authUser, request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}