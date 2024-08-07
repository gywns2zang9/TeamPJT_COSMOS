package S11P12A708.A708.domain.problem.repository.query;

import S11P12A708.A708.domain.file.response.SolveStatusResponse;

import java.util.List;

public interface ProblemQueryRepository {
    List<SolveStatusResponse> findSolveUsersByProblemId(Long problemId);
}
