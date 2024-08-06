package S11P12A708.A708.domain.code.repository;

import S11P12A708.A708.domain.code.entity.Code;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CodeRepository extends JpaRepository<Code, Long> {

}
