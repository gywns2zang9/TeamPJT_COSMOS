package S11P12A708.A708.domain.code.service;

import S11P12A708.A708.domain.code.entity.Code;
import S11P12A708.A708.domain.code.entity.Language;
import S11P12A708.A708.domain.code.exception.CodeNotFoundException;
import S11P12A708.A708.domain.code.repository.CodeRepository;
import S11P12A708.A708.domain.code.repository.query.CodeQueryRepository;
import S11P12A708.A708.domain.code.request.ExecuteCodeRequest;
import S11P12A708.A708.domain.code.request.PatchCodeRequest;
import S11P12A708.A708.domain.code.response.*;
import S11P12A708.A708.domain.study.entity.Study;
import S11P12A708.A708.domain.team.exception.TeamNotFoundException;
import S11P12A708.A708.domain.team.repository.TeamRepository;
import S11P12A708.A708.domain.user.exception.UserNotFoundException;
import S11P12A708.A708.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CodeService {

    private final CodeQueryRepository codeQueryRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final CodeRepository codeRepository;

    public List<CodeYearFilterResponse> getCodeFilter(Long teamId, Long userId) {
        teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        List<Study> studies = codeQueryRepository.findStudiesFilter(teamId);

        List<CodeYearFilterResponse> yearFilters = new ArrayList<>();
        List<Integer> yearArray = studies.stream().map(Study::getYear).distinct().toList();

        for (Integer yearValue : yearArray) {
            CodeYearFilterResponse yearFilter = new CodeYearFilterResponse(1, yearValue);
            List<CodeMonthFilterResponse> monthFilters = new ArrayList<>();
            List<Integer> monthArray = studies.stream().filter(study -> study.getYear().equals(yearValue)).map(Study::getMonth).distinct().toList();

            for (Integer monthValue : monthArray) {
                CodeMonthFilterResponse monthFilter = new CodeMonthFilterResponse(2, monthValue);
                List<CodeTimeFilterResponse> timesFilters = new ArrayList<>(studies.stream()
                        .filter(study -> study.getYear().equals(yearValue) && study.getMonth().equals(monthValue))
                        .map(study -> new CodeTimeFilterResponse(3, study.getId(), study.getTimes()))
                        .toList());

                for (CodeTimeFilterResponse timesFilter : timesFilters) {
                    List<CodeFilterResponse> res = codeQueryRepository.findCodesListByStudyId(timesFilter.getStudyId(), userId);
                    timesFilter.setCodes(res);
                }

                timesFilters.removeIf(timesFilter -> timesFilter.getCodes().isEmpty());

                if (!timesFilters.isEmpty()) {
                    monthFilter.setTimes(timesFilters);
                    monthFilters.add(monthFilter);
                }
            }

            if (!monthFilters.isEmpty()) {
                yearFilter.setMonths(monthFilters);
                yearFilters.add(yearFilter);
            }
        }

        return yearFilters;
    }

    public CodeResponse getCode(Long teamId, Long codeId) {
        teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        Code code = codeRepository.findById(codeId).orElseThrow(CodeNotFoundException::new);

        return new CodeResponse(code);
    }

    public void storeCode(Long teamId, Long codeId, PatchCodeRequest req) {
        teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        Code code = codeRepository.findById(codeId).orElseThrow(CodeNotFoundException::new);

        code.update(new Code(req.getContent(), req.getLanguage()));
        codeRepository.save(code);
    }

    public ExecuteCodeResponse getExecuteResult(ExecuteCodeRequest request) {
        final Language language = request.getLanguage(); // 언어
        final String code = request.getContent(); // 코드
        final String input = request.getInputs(); // input 값

        final String result = language.executeCode(code, input);

        return new ExecuteCodeResponse(result);
    }

}
