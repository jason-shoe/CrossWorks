package com.java.backend.CrossWorks.storage;


import com.java.backend.CrossWorks.collaborative.CompetitiveGame;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompetitiveGameStorage extends CrudRepository<CompetitiveGame, String> {

    Optional<CompetitiveGame> findById(String id);
}