package com.java.backend.CrossWorks.storage;

import java.util.List;

import com.java.backend.CrossWorks.collaborative.CollaborativeGame;
import org.springframework.data.repository.CrudRepository;

public interface CollaborativeGameStorage extends CrudRepository<CollaborativeGame, Long> {

    CollaborativeGame findById(long id);
}