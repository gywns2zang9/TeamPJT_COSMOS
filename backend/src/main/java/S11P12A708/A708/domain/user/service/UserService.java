package S11P12A708.A708.domain.user.service;

import S11P12A708.A708.domain.auth.exception.InvalidPasswordException;
import S11P12A708.A708.domain.auth.service.AuthService;
import S11P12A708.A708.domain.folder.repository.FolderRepository;
import S11P12A708.A708.domain.problem.entity.ProblemUser;
import S11P12A708.A708.domain.problem.exception.ProblemNotFoundException;
import S11P12A708.A708.domain.problem.repository.ProblemRepository;
import S11P12A708.A708.domain.problem.repository.ProblemUserRepository;
import S11P12A708.A708.domain.user.entity.UserType;
import S11P12A708.A708.domain.user.exception.OnlyNormalPwException;
import S11P12A708.A708.domain.user.exception.UserNotFoundException;
import S11P12A708.A708.domain.folder.exception.FolderNotFoundException;
import S11P12A708.A708.domain.user.entity.User;
import S11P12A708.A708.domain.user.repository.UserRepository;
import S11P12A708.A708.domain.user.request.ChangePwRequest;
import S11P12A708.A708.domain.user.request.ChangeUserRequest;
import S11P12A708.A708.domain.user.response.UserInfo;
import S11P12A708.A708.domain.user.response.UserCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class UserService {
    private final PasswordEncoder bCryptPasswordEncoder;
    private final UserRepository userRepository;
    private final AuthService authService;
    private final ProblemUserRepository problemUserRepository;
    private final ProblemRepository problemRepository;
    private final FolderRepository folderRepository;

    public UserService(PasswordEncoder bCryptPasswordEncoder, UserRepository userRepository,
                       AuthService authService, ProblemUserRepository problemUserRepository, ProblemRepository problemRepository, FolderRepository folderRepository) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.userRepository = userRepository;
        this.authService = authService;
        this.problemUserRepository = problemUserRepository;
        this.problemRepository = problemRepository;
        this.folderRepository = folderRepository;
    }

    public UserInfo getUserInfoByUserId(Long userId) throws RuntimeException {
        final User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        return new UserInfo(user);
    }

    public List<UserCode> getUserCodeByUserID(Long userId) throws RuntimeException {
        final User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        List<ProblemUser> problemUsers = problemUserRepository.findByUser(user);

        return problemUsers.stream()
                .map(problemUser -> {
                    long problemId = problemUser.getProblem().getId();
                    String title = problemRepository.findById(problemId)
                            .orElseThrow(ProblemNotFoundException::new)
                            .getName();

                    long fileId = problemUser.getFile().getId();
                    long folderId = problemUser.getFile().getFolder().getId();
                    long teamId = folderRepository.findById(folderId)
                            .orElseThrow(FolderNotFoundException::new)
                            .getTeam().getId();

                    return new UserCode(fileId, teamId, title);
                })
                .collect(Collectors.toList());
    }

    public UserInfo updateUserInfo(Long userId, ChangeUserRequest req) {
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);

        if (!req.getNickName().equals(user.getNickname()) && authService.checkNickName(req.getNickName())) {
            user.setNickname(req.getNickName());
        }
        user.setGitId(req.getGitId());
        user.setRepo(req.getRepo());
        user.setDescription(req.getDescription());
        userRepository.save(user);
        return new UserInfo(user);
    }

    public boolean changePassword(Long userId, ChangePwRequest req) {
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        if (user.getType() != UserType.NORMAL) throw new OnlyNormalPwException();

        boolean userCheck = user.checkPassword(req.getOldPassword(), bCryptPasswordEncoder);
        if (userCheck) {
            user.setPassword(req.getNewPassword());
            user.hashPassword(bCryptPasswordEncoder);
            userRepository.save(user);
            return true;
        }
        throw new InvalidPasswordException();
    }

}
