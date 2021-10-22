package com.java.backend.CrossWorks;

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

@SpringBootApplication
public class CrossWorksApplication {

	private static final Logger log = LoggerFactory.getLogger(CrossWorksApplication.class);
	public static void main(String[] args) {
		SpringApplication.run(CrossWorksApplication.class, args);
	}

	@Bean
	public CommandLineRunner crosswordInitialization(CrosswordStorage repository) {
		return (args) -> {
			repository.save(new Crossword("hello", 10));
			log.info("Crossword files found with findAll()");
			for (Crossword file: repository.findAll()) {
				log.info("Crossword");
				log.info(file.getCrosswordId());
			}
		};
	}
	@Bean
	public CommandLineRunner demo(CollaborativeGameStorage repository) {
		return (args) -> {
			repository.save(new CollaborativeGame("gameOne"));
			repository.save(new CollaborativeGame("gameTwo"));
			log.info("games found with findAll():");
			for (CollaborativeGame game: repository.findAll()) {
				log.info("Game");
				log.info(game.getGameId());
			}
		};
	}

}
