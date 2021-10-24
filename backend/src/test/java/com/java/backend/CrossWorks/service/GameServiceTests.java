package com.java.backend.CrossWorks.service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class GameServiceTests {

    @Test
    void crosswordIsNotNull() {
        CollaborativeGameService gameservice = new CollaborativeGameService();

        assertThat(gameservice).isNotNull();
    }
}
