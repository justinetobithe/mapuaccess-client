import { VehicleRegistration } from "./VehicleRegistration";

export interface Record {
    id?: number;
    vehicle_registration_id?: number;
    type?: string;
    recorded_at?: string;

    vehicle_registration?: VehicleRegistration;
};
