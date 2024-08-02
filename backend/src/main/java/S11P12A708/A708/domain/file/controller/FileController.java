package S11P12A708.A708.domain.file.controller;

import S11P12A708.A708.domain.file.request.CodeFileCreateRequest;
import S11P12A708.A708.domain.file.request.FileCreateRequest;
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
    public ResponseEntity<Void> createFolder(
            @PathVariable("teamId") Long teamId,
            @Valid @RequestBody FileCreateRequest request) {
        fileService.createNormalFile(teamId, request);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
// 코드 페이지 추가
//    @PostMapping("/teams/{teamId}/file/code")
//    public ResponseEntity<Void> createCodeFolder(
//            @PathVariable("teamId") Long teamId,
//            @Valid @RequestBody CodeFileCreateRequest request) {
//        fileService.createCodeFile(teamId, request);
//        return new ResponseEntity<>(HttpStatus.OK);
//    }

}