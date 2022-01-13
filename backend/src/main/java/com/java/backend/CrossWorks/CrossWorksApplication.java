package com.java.backend.CrossWorks;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.java.backend.CrossWorks.models.Crossword;
import com.java.backend.CrossWorks.storage.CrosswordStorage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.io.IOException;
import java.io.InputStream;

@SpringBootApplication
public class CrossWorksApplication {

    private static final Logger log = LoggerFactory.getLogger(CrossWorksApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(CrossWorksApplication.class, args);
    }

    @Bean
    public CommandLineRunner crosswordInitialization(CrosswordStorage repository) {
        return (args) -> {
            ObjectMapper mapper = new ObjectMapper();
            TypeReference<Crossword> typeReference = new TypeReference<Crossword>() {
            };
            String[] crosswordFilenames =
                    {"/sampleCrossword.json", "/sampleCrossword2.json", "/sampleCrossword3.json"};
            for (String filename : crosswordFilenames) {
                InputStream inputStream = TypeReference.class.getResourceAsStream(filename);
                try {
                    Crossword data = mapper.readValue(inputStream, typeReference);
                    data.fillAnswers();
                    data.getBoard().printBoard();
                    repository.save(data);
                    log.info("crossword data saved");
                } catch (IOException e) {
                    log.info("didn't work");
                    log.info(e.toString());
                }
            }

            log.info("Crossword files found with findAll()");
            for (Crossword file : repository.findAll()) {
                log.info(file.getCrosswordId());
            }
        };
    }

}
