package com.java.backend.CrossWorks;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.java.backend.CrossWorks.collaborative.CollaborativeGame;
import com.java.backend.CrossWorks.models.Crossword;
import com.java.backend.CrossWorks.storage.CollaborativeGameStorage;
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
			TypeReference<Crossword> typeReference = new TypeReference<Crossword>(){};
			InputStream inputStream = TypeReference.class.getResourceAsStream("/sampleCrossword.json");
			try {
				Crossword data = mapper.readValue(inputStream,typeReference);
				data.fillAnswers();
				data.getBoard().printBoard();
				repository.save(data);
				log.info("crossword data saved");
			} catch (IOException e){
				log.info("didn't work");
				log.info(e.toString());
			}

			log.info("Crossword files found with findAll()");
			for (Crossword file: repository.findAll()) {
				log.info(file.getCrosswordId());
			}
		};
	}
	@Bean
	public CommandLineRunner demo(CollaborativeGameStorage repository) {
		return (args) -> {
			repository.save(new CollaborativeGame());
			repository.save(new CollaborativeGame());
			log.info("games found with findAll():");
			for (CollaborativeGame game: repository.findAll()) {
				log.info(game.getGameId());
			}
		};
	}

}
