/**
 * api.ts
 * ---------------------------------------------------------------------------
 * RakshaNet 360 — Member 4 — Integration Layer
 *
 * Thin, typed wrapper around the FastAPI backend for everything that isn't
 * map-specific (map calls live in maps/MapService.ts). Used by the caregiver
 * Dashboard and by the hardware ingestion flow's frontend acknowledgement.
 * ---------------------------------------------------------------------------
 */

const API_BASE = import.meta.env?.VITE_API_BASE_URL ?? "http://localhost:8000/api";

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
      ...init,
    });
  } catch {
    throw new ApiError("Network request failed — check your connection.");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body?.detail ?? `Request failed (${res.status})`, res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ---- Caregiver / patient endpoints ----------------------------------------

export interface PatientDTO {
  id: string;
  name: string;
  age: number;
  condition: string;
  healthScore: number;
  batteryLevel: number;
  lastSeen: string;
  sosActive: boolean;
  latitude: number;
  longitude: number;
}

export const Api = {
  getPatients: () => http<PatientDTO[]>("/caregiver/patients"),

  getPatient: (id: string) => http<PatientDTO>(`/patient/${id}`),

  getPatientLocation: (id: string) =>
    http<{ latitude: number; longitude: number; timestamp: string }>(`/patient/${id}/location`),

  getPatientHealth: (id: string) =>
    http<{
      heartRate: number;
      heartRateTrend: number[];
      bloodPressure: string;
      medicationAdherence: number;
      fallDetected: boolean;
      healthScore: number;
    }>(`/patient/${id}/health`),

  getPatientHistory: (id: string) =>
    http<
      {
        id: string;
        type: "sos" | "health" | "location" | "system";
        title: string;
        description?: string;
        timestamp: string;
      }[]
    >(`/patient/${id}/history`),

  // ---- SOS / hardware ingestion (mirrors hardware/hardware_api.py) --------
  acknowledgeSos: (sosId: string) =>
    http<{ status: string }>(`/sos/${sosId}/acknowledge`, { method: "POST" }),

  resolveSos: (sosId: string, note?: string) =>
    http<{ status: string }>(`/sos/${sosId}/resolve`, {
      method: "POST",
      body: JSON.stringify({ note }),
    }),
};
