package S11P12A708.A708.domain.user.controller;

import S11P12A708.A708.domain.user.response.UserInfo;
import S11P12A708.A708.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/users/{userId}")
    public ResponseEntity<UserInfo> getUserInfo(@PathVariable Long userId) {
        log.info("정보 불러오기");
        UserInfo userInfo = userService.getUserInfoByUserId(userId);
        return new ResponseEntity<>(userInfo, HttpStatus.OK);
    }
}
