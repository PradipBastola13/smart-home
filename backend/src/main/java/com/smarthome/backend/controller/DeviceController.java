package com.smarthome.backend.controller;

import com.smarthome.backend.model.Device;
import com.smarthome.backend.service.DeviceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    // Get all devices (used by React Dashboard and Devices page)
    @GetMapping
    public List<Device> getAllDevices() {
        return deviceService.getAllDevices();
    }

    // Get a specific device by ID
    @GetMapping("/{id}")
    public ResponseEntity<Device> getDeviceById(@PathVariable Long id) {
        return deviceService.getDeviceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Toggle device state ON/OFF (used by React button)
    @PostMapping("/{id}/toggle")
    public ResponseEntity<Device> toggleDevice(@PathVariable Long id) {
        return deviceService.toggleDevice(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Set explicit state ON/OFF
    @PutMapping("/{id}/state")
    public ResponseEntity<Device> setDeviceState(@PathVariable Long id, @RequestParam boolean isOn) {
        return deviceService.setDeviceState(id, isOn)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Simple plain-text endpoint for ESP microcontrollers: returns "ON" or "OFF"
    @GetMapping("/{id}/state")
    public ResponseEntity<String> getDeviceStateRaw(@PathVariable Long id) {
        return deviceService.getDeviceById(id)
                .map(d -> ResponseEntity.ok(d.getIsOn() ? "ON" : "OFF"))
                .orElse(ResponseEntity.notFound().build());
    }

    // Heartbeat ping from ESP to report it is online
    @PostMapping("/{id}/heartbeat")
    public ResponseEntity<Map<String, Object>> heartbeat(@PathVariable Long id) {
        boolean updated = deviceService.recordHeartbeat(id);
        if (updated) {
            return ResponseEntity.ok(Map.of("status", "success", "message", "Heartbeat received for device " + id));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
