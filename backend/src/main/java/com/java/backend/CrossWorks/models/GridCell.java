package com.java.backend.CrossWorks.models;

import java.util.HashMap;
import java.util.Map;

public enum GridCell {
    BLOCK('#'),
    EMPTY(' '),
    CORRECT('1'),
    INCORRECT('0'),
    A('A'),
    B('B'),
    C('C'),
    D('D'),
    E('E'),
    F('F'),
    G('G'),
    H('H'),
    I('I'),
    J('J'),
    K('K'),
    L('L'),
    M('M'),
    N('N'),
    O('O'),
    P('P'),
    Q('Q'),
    R('R'),
    S('S'),
    T('T'),
    U('U'),
    V('V'),
    W('W'),
    X('X'),
    Y('Y'),
    Z('Z');

    private static final Map<Character, GridCell> BY_CHAR_VALUE = new HashMap<>();

    static {
        for (GridCell cell : values()) {
            BY_CHAR_VALUE.put(cell.charValue, cell);
        }
    }

    public final char charValue;

    GridCell(char charValue) {
        this.charValue = charValue;
    }

    public static GridCell charValueOf(char charValue) {
        // TODO: if char value is not in the map, catch the error
        return BY_CHAR_VALUE.get(charValue);
    }

    public boolean isEmpty() {
        return this == GridCell.EMPTY;
    }
}

