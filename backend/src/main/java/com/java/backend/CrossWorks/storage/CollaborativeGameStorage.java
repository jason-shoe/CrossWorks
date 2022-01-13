package com.java.backend.CrossWorks.storage;


import com.java.backend.CrossWorks.collaborative.CollaborativeGame;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.Optional;

public interface CollaborativeGameStorage extends CrudRepository<CollaborativeGame, String> {

    Optional<CollaborativeGame> findById(String id);

    @Transactional
    @Modifying
    @Query("delete from CollaborativeGame g where g.gameId=:gameId")
    void deleteGames(@Param("gameId") String gameId);
}