import { UpdateUserDto } from '../dto/update-user.dto';

export class UserValidator {
  static validateUser(createUserDto: UpdateUserDto & { username?: string }): {
    validated: boolean;
    message: string;
  } {
    const validateResult = {
      validated: false,
      message: '',
    };
    if (
      'username' in createUserDto &&
      !UserValidator.username(createUserDto.username)
    ) {
      validateResult.message =
        'Username should be grater than 4 characters and start with a letter!';
      return validateResult;
    }

    if (
      'password' in createUserDto &&
      !UserValidator.password(createUserDto.password)
    ) {
      validateResult.message =
        'Password should contain more than 7 character and contain lower and upper case characters';
    }

    if (
      'mobile' in createUserDto &&
      !UserValidator.mobile(createUserDto.mobile)
    ) {
      validateResult.message =
        'Mobile number should follow iranian phone number format';
    }

    if ('email' in createUserDto && !UserValidator.email(createUserDto.email)) {
      validateResult.message = 'Email should be valid';
    }

    validateResult.validated = true;
    return validateResult;
  }
  static password(password: string): boolean {
    return !!password.match(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/);
  }

  static username(username: string): boolean {
    return !!username.match(/^\w?[\w\d]{3,}$/);
  }

  static mobile(mobileNumber: string): boolean {
    return !!mobileNumber.match(/^09\d{9}$/);
  }

  static email(emailAddress: string): boolean {
    return !!emailAddress.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/);
  }
}
