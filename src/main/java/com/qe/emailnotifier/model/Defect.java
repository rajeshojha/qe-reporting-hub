package com.qe.emailnotifier.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Defect {
    
    private String bugId;           // e.g., "CEPG-360265"
    private String priority;        // e.g., "P1", "P2"
    private String currentOwner;
    private String manager;
    private String director;
    private String sdGd;           // SD/GD field
    private String plannedDoneDate; // e.g., "09/02"
    private String status;          // e.g., "Backlog", "Peer review", "WIP"
}
