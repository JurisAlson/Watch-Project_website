package com.watchproject.watch_project.repository;

import com.watchproject.watch_project.model.Watch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WatchRepository extends JpaRepository<Watch, Long> {
    // Spring Boot automatically gives us methods like save(), findAll(), findById(), and deleteById() out of the box!
}