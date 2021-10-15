package com.java.backend.CrossWorks.models;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class GridTests {

    @Test
    void createRandom() {
        Grid gridOne = new Grid(10);
        gridOne.randomFill();
        gridOne.printBoard();
    }
}
