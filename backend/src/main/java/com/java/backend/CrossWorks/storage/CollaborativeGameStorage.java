package com.java.backend.CrossWorks.storage;


import com.java.backend.CrossWorks.collaborative.CollaborativeGame;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface CollaborativeGameStorage extends CrudRepository<CollaborativeGame, String> {

    Optional<CollaborativeGame> findById(String id);
}