import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class loginDto{
    
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ 
        description: 'email of the user', 
        example: 'test@gmail.com' 
    })
    email: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ 
        description: 'user password', 
        example: 'test123'
    })
    password: string
}