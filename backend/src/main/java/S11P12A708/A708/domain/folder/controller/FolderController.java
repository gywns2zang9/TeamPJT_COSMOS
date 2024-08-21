package S11P12A708.A708.domain.folder.controller;

import S11P12A708.A708.domain.folder.request.FolderCreateRequest;
import S11P12A708.A708.domain.folder.response.AllFolderInfoResponse;
import S11P12A708.A708.domain.folder.response.FolderInfoResponse;
import S11P12A708.A708.domain.folder.response.FolderResponse;
import S11P12A708.A708.domain.folder.service.FolderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
public class FolderController {

    private final FolderService folderService;

    @GetMapping("/teams/{teamId}/folder/{folderId}")
    public ResponseEntity<FolderInfoResponse> getFolderInfo(
            @PathVariable("teamId") Long teamId,
            @PathVariable("folderId") Long folderId) {
        final FolderInfoResponse response = folderService.getFolderInfo(teamId, folderId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/teams/{teamId}/allFolders")
    public ResponseEntity<AllFolderInfoResponse> getAllFolders(
            @PathVariable("teamId") Long teamId) {
        final AllFolderInfoResponse response = folderService.getAllFolderInfo(teamId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/teams/{teamId}/folders")
    public ResponseEntity<FolderResponse> createFolder(
            @PathVariable("teamId") Long teamId,
            @Valid @RequestBody FolderCreateRequest request) {
        final FolderResponse response = folderService.createFolder(teamId, request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/teams/{teamId}/folder/{folderId}")
    public ResponseEntity<Void> deleteFolder(
            @PathVariable("teamId") Long teamId,
            @PathVariable("folderId") Long folderId) {
        folderService.deleteFolder(teamId, folderId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}