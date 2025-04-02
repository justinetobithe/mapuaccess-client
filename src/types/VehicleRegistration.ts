import { Semester } from "./Semester";
import { Vehicle } from "./Vehicle";

export interface VehicleRegistration {
    id?: number;
    vehicle_id?: number;
    semester_id?: number;
    code?: string;
    valid_until?: string;

    vehicle?: Vehicle;
    semester?: Semester;
};
