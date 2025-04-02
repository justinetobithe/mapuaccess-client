import { Driver } from "./Driver";
import User from "./User";

export interface Vehicle {
    id?: number;
    user_id?: number;
    plate_number?: string;
    make?: string;
    model?: string;
    year?: string;
    type?: string;
    
    registration_number?: string;

    is_registered?: boolean | number;

    image?: string;

    user?: User;
}
