package com.java.backend.CrossWorks.storage;

import com.java.backend.CrossWorks.collaborative.Player;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlayerStorage extends CrudRepository<Player, String> {
    Optional<Player> findById(String id);
}
