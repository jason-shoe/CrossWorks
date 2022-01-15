package com.java.backend.CrossWorks.storage;

import com.java.backend.CrossWorks.collaborative.Game;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GameStorage extends CrudRepository<Game, String> {

    Optional<Game> findById(String id);
}
