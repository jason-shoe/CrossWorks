package com.java.backend.CrossWorks.service;

import com.fasterxml.jackson.annotation.JsonView;
import com.java.backend.CrossWorks.collaborative.CollaborativeGame;
import com.java.backend.CrossWorks.exceptions.InvalidParamException;
import com.java.backend.CrossWorks.models.Crossword;
import com.java.backend.CrossWorks.storage.CrosswordStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Consumer;

@Service
@Configurable
public class CrosswordService {
    @Autowired
    private CrosswordStorage repo;

    public Crossword getCrossword(String crosswordId) throws InvalidParamException {
        Optional<Crossword> val = repo.findById(crosswordId);
        if (val.isPresent()) {
            return val.get();
        }
        throw new InvalidParamException("Crossword ID doesn't exist in getCrossword");
    }

    public Crossword getFirst() {
        Iterable<Crossword> allOfThem = repo.findAll();
        return allOfThem.iterator().next();
    }

    public Vector<Crossword> getDates() {
        Vector<Crossword> dates = new Vector();
        Iterable<Crossword> allCrosswords = repo.findAll();
        allCrosswords.forEach(new Consumer<Crossword>() {
            @Override
            public void accept(Crossword crossword) {
                dates.add(crossword);
            }
        });

        return dates;
    }

}
