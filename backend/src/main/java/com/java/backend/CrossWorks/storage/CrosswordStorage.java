package com.java.backend.CrossWorks.storage;

import com.java.backend.CrossWorks.models.Crossword;
import org.springframework.data.repository.CrudRepository;

public interface CrosswordStorage extends CrudRepository<Crossword, String> {

    Crossword findByCrosswordId(String crosswordId);
}