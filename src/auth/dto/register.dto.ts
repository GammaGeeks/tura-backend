import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class registerDto{
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        description: 'user email',
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

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'name of the user',
        example: 'John Doe'
    })
    name: string
}