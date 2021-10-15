package com.java.backend.CrossWorks.models;

public enum GridCell {
    BLOCK('#'),
    EMPTY(' '),
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

    public final char charValue;

    GridCell(char charValue) {
        this.charValue = charValue;
    }
}

