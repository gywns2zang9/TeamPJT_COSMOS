package S11P12A708.A708.domain.study.service;

import S11P12A708.A708.domain.file.entity.File;
import S11P12A708.A708.domain.file.repository.FileRepository;
import S11P12A708.A708.domain.folder.entity.Folder;
import S11P12A708.A708.domain.folder.exception.FolderNotFoundException;
import S11P12A708.A708.domain.folder.repository.FolderRepository;
import S11P12A708.A708.domain.folder.repository.query.FolderQueryRepository;
import S11P12A708.A708.domain.study.entity.Study;
import S11P12A708.A708.domain.study.repository.StudyRepository;
import S11P12A708.A708.domain.study.repository.query.StudyQueryRepository;
import S11P12A708.A708.domain.study.request.StudyCreateRequest;
import S11P12A708.A708.domain.team.entity.Team;
import S11P12A708.A708.domain.team.exception.TeamNotFoundException;
import S11P12A708.A708.domain.team.repository.TeamRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class StudyService {

    private final StudyQueryRepository studyQueryRepository;
    private final TeamRepository teamRepository;
    private final FolderQueryRepository folderQueryRepository;
    private final FolderRepository folderRepository;
    private final FileRepository fileRepository;
    private final StudyRepository studyRepository;

    public void createStudy(Long teamId, StudyCreateRequest request) {
        final Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);

        // 새로운 회차 계산.
        int time = studyQueryRepository.findMaxTimesByYearAndMonth(request.getYear(), request.getMonth()) + 1;

        // 스터디 생성
        Study study = Study.createStudy(request.getYear(), request.getMonth(), time, team);
        studyRepository.save(study);

        // 년 월에 해당하는 폴더 생성 및 찾기
        final Folder rootFolder = folderQueryRepository.findRootFolderByTeam(teamId).orElseThrow(FolderNotFoundException::new);
        final String yearMonthFolderName = formatYearMonth(request.getYear(), request.getMonth());
        if(time == 1) { // 기존에 년월 폴더 없었다면 생성
            Folder yearMonthFolder = new Folder(yearMonthFolderName, team, rootFolder);
            folderRepository.save(yearMonthFolder);
        }

        final Folder yearMonthFolder = rootFolder.getSubFolders().stream()
                .filter(subFolder -> yearMonthFolderName.equals(subFolder.getName()))
                .findFirst()
                .orElseThrow();

        // 회차 이름으로 폴더 생성
        final Folder timeFolder = new Folder(time + "회차", team, yearMonthFolder);
        folderRepository.save(timeFolder);

        // 1회차 스터디 개요 파일 추가.
        final File timeOverViewFile = File.createTimeOverViewFile(timeFolder);
        fileRepository.save(timeOverViewFile);
    }

    public void deleteStudy(Long teamId, Long meetingId) {

    }

    private String formatYearMonth(Integer year, Integer month) {
        String shortYear = String.format("%02d", year % 100);
        String formattedMonth = String.format("%d", month);
        return shortYear + "년 " + formattedMonth + "월";
    }
}
