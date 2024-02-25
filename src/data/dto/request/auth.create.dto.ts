import { IsString, Matches, MaxLength, MinLength } from "class-validator";


export class AuthCreateDto {

    @IsString()
    @MinLength(4)
    @MaxLength(50)
    @Matches(/^[a-zA-Z0-9]*$/, {
        message: '영어와 숫자만 입력 가능합니다.'
    })
    id: string;


    @IsString()
    @MinLength(4)
    @MaxLength(50)
    //영어랑 숫자만 가능한 유효성 체크
    @Matches(/^[a-zA-Z0-9]*$/, {
        message: '영어와 숫자만 입력 가능합니다.'
    })
    passwd: string;

    @IsString()
    @MinLength(4)
    @MaxLength(50)
    //영어랑 숫자만 가능한 유효성 체크
    @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
        message: '이메일 형식에 맞지 않습니다.'
    })
    email: string;
    
    @IsString()
    @MinLength(4)
    @MaxLength(50)
    nickname: string;
}