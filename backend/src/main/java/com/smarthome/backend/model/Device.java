package com.smarthome.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "devices")
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @JsonProperty("isOn")
    @Column(name = "is_on", nullable = false)
    private boolean isOn;

    @Column(name = "last_heartbeat")
    private Instant lastHeartbeat;

    public Device() {
    }

    public Device(String name, String type, boolean isOn) {
        this.name = name;
        this.type = type;
        this.isOn = isOn;
        this.lastHeartbeat = null;
    }

    public Device(Long id, String name, String type, boolean isOn) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.isOn = isOn;
        this.lastHeartbeat = null;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @JsonProperty("isOn")
    public boolean getIsOn() {
        return isOn;
    }

    public void setIsOn(boolean isOn) {
        this.isOn = isOn;
    }

    public Instant getLastHeartbeat() {
        return lastHeartbeat;
    }

    public void setLastHeartbeat(Instant lastHeartbeat) {
        this.lastHeartbeat = lastHeartbeat;
    }

    @JsonProperty("online")
    public boolean isOnline() {
        if (lastHeartbeat == null) {
            return false;
        }
        // Online if a heartbeat was received within the last 15 seconds
        return Instant.now().minusSeconds(15).isBefore(lastHeartbeat);
    }
}
