package S11P12A708.A708.domain.user.controller;

import S11P12A708.A708.domain.user.request.ChangePwRequest;
import S11P12A708.A708.domain.user.response.UserInfo;
import S11P12A708.A708.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserInfo> getUserInfo(@PathVariable Long userId) {
        final UserInfo userInfo = userService.getUserInfoByUserId(userId);
        return new ResponseEntity<>(userInfo, HttpStatus.OK);
    }

    @PatchMapping("/{userId}/password")
    public ResponseEntity<Boolean> changePassword(@PathVariable Long userId, @RequestBody ChangePwRequest changePwRequest) {
        final boolean response = userService.changePassword(userId, changePwRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
