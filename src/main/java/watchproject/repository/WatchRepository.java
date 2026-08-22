package watchproject.repository;

import watchproject.model.Watch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WatchRepository extends JpaRepository<Watch, Long> {

    List<Watch> findAllByOrderByPublishedDateDesc();

}