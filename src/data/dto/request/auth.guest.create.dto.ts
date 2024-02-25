import { IsString, MaxLength, MinLength } from "class-validator";

export class AuthCreateGuestDto {
    @IsString()
    @MinLength(4)
    @MaxLength(50) 
    guestId: string;

    @IsString()
    @MinLength(4)
    @MaxLength(50)
    nickname: string;
}