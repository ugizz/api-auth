
import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthLoginGuestDto {
    @IsString()
    guestId: string;
}