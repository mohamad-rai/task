import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { File } from 'src/file/entities/file.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Matches(/^09\d{9}$/, {
    message: 'Mobile must follow iranian phone number format!',
  })
  @IsNotEmpty()
  mobile: string;

  @IsString()
  @Matches(/^\w?[\w\d]{3,}$/, {
    message:
      'Username should be grater than 4 characters and start with a letter!',
  })
  @IsNotEmpty()
  username: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
    message:
      'Password should contain more than 8 character and contain lower and upper case characters',
  })
  @IsNotEmpty()
  password: string;

  profileImage?: File;
}
