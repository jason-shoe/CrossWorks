package com.java.backend.CrossWorks.controller.dto;

import com.java.backend.CrossWorks.collaborative.Player;
import lombok.Data;

@Data
public class ConnectRequest {
   private Player player;
   private String gameId;
}
