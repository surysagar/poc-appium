import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service'; // Assuming you have a UsersService
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserCredentialService } from 'src/modules/users/services/userCredential.service';
import { DeviceService } from 'src/modules/devices/services/device.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private userCredentialService: UserCredentialService,
    private jwtService: JwtService,
    private deviceService: DeviceService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    try {
      const validateUser =
        await this.userCredentialService.validateCredentials(username);
      if (validateUser) {
        const user = await this.usersService.findOne(validateUser);
        this.deviceService.syncDeviceList();
        return user;
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async login(user: any) {
    try {
      const payload: JwtPayload = { name: user.first_name, sub: user._id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
