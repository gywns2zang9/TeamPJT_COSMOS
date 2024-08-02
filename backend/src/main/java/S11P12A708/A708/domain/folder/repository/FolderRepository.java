package S11P12A708.A708.domain.folder.repository;

import S11P12A708.A708.domain.folder.entity.Folder;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Long> {

    @EntityGraph(attributePaths = {"subFolders", "files"})
    Optional<Folder> findById(Long id);

}

