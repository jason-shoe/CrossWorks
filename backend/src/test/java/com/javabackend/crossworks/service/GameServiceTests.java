package src.test.java.com.javabackend.crossworks.service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import static org.assertj.core.api.Assertions.assertThat;
import src.main.java.com.javabackend.crossworks.service.GameService;

@SpringBootTest(classes=GameService.class)
class GameServiceTests {

    @Test
    void crosswordIsNotNull() {
        GameService gameservice = new GameService();

        assertThat(gameservice).isNotNull();
    }
}
