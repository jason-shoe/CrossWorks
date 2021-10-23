package com.java.backend.CrossWorks.service;

import com.java.backend.CrossWorks.models.Crossword;
import com.java.backend.CrossWorks.storage.CrosswordStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@Configurable
public class CrosswordService {
    @Autowired
    private CrosswordStorage repo;

    public Crossword getCrossword(String crosswordId) {
        return (Crossword) repo.findAllById(Collections.singleton(crosswordId));
    }

    public Crossword getFirst() {
        Iterable<Crossword> allOfThem = repo.findAll();
        return allOfThem.iterator().next();
    }


}
