package S11P12A708.A708.domain.code.repository.query;

import S11P12A708.A708.domain.code.response.CodeFilterResponse;
import S11P12A708.A708.domain.study.entity.Study;

import java.util.List;


public interface CodeQueryRepository {

    List<Study> findStudiesFilter(Long teamId);

    List<CodeFilterResponse> findCodesListByStudyId(Long studyId, Long userId);

}
