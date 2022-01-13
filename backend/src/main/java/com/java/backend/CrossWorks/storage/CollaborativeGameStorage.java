package com.java.backend.CrossWorks.storage;


import com.java.backend.CrossWorks.collaborative.CollaborativeGame;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CollaborativeGameStorage extends CrudRepository<CollaborativeGame, String> {

    Optional<CollaborativeGame> findById(String id);

    //    @Transactional
//    @Modifying
//    @Query("delete from CollaborativeGame g where g.gameId=:gameId")
//    @Override
//    void deleteById(@Param("gameId") String gameId);
//    @Transactional
//    @Modifying(clearAutomatically = true, flushAutomatically = true)
//    @Query(value = "DELETE FROM CollaborativeGame WHERE gameId = ?1", nativeQuery = true)
//    void deleteByGameId(String gameId);
}