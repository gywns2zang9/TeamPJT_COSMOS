package S11P12A708.A708.domain.folder.repository.query;


import S11P12A708.A708.domain.folder.entity.Folder;

import java.util.Optional;

public interface FolderQueryRepository {

    Optional<Folder> findRootFolderByTeam(Long teamId);

}
