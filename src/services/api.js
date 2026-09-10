const API_BASE_URL = "http://localhost:8080/api";

/**
 * Fetch all devices from the Spring Boot / PostgreSQL backend
 */
export async function fetchDevices() {
  const response = await fetch(`${API_BASE_URL}/devices`);
  if (!response.ok) {
    throw new Error(`Failed to fetch devices (${response.status})`);
  }
  return response.json();
}

/**
 * Toggle a device power state (ON / OFF)
 */
export async function toggleDeviceApi(id) {
  const response = await fetch(`${API_BASE_URL}/devices/${id}/toggle`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Failed to toggle device ${id} (${response.status})`);
  }
  return response.json();
}
