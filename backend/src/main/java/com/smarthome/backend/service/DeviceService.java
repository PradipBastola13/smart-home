package com.smarthome.backend.service;

import com.smarthome.backend.model.Device;
import com.smarthome.backend.repository.DeviceRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class DeviceService {

    private final DeviceRepository deviceRepository;

    public DeviceService(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @PostConstruct
    public void seedInitialDevice() {
        // Seed Device 1 if table is empty
        if (deviceRepository.count() == 0) {
            Device defaultDevice = new Device("Living Room Light", "Switch", false);
            deviceRepository.save(defaultDevice);
        }
    }

    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    public Optional<Device> getDeviceById(Long id) {
        return deviceRepository.findById(id);
    }

    public Optional<Device> toggleDevice(Long id) {
        return deviceRepository.findById(id).map(device -> {
            device.setIsOn(!device.getIsOn());
            return deviceRepository.save(device);
        });
    }

    public Optional<Device> setDeviceState(Long id, boolean isOn) {
        return deviceRepository.findById(id).map(device -> {
            device.setIsOn(isOn);
            return deviceRepository.save(device);
        });
    }

    public boolean recordHeartbeat(Long id) {
        Optional<Device> opt = deviceRepository.findById(id);
        if (opt.isPresent()) {
            Device device = opt.get();
            device.setLastHeartbeat(Instant.now());
            deviceRepository.save(device);
            return true;
        }
        return false;
    }

    public Device createDevice(Device device) {
        return deviceRepository.save(device);
    }
}
