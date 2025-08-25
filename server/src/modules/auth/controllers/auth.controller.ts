import { Controller, Post, Request, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { UserLoginDto } from '../dto/userLogin.dto';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'User Login' })
  @ApiBody({ type: UserLoginDto, description: 'User login credentials' })
  @ApiResponse({
    status: 201,
    description: 'User successfully logged in and JWT token returned',
    schema: {
      example: {
        access_token: 'your_jwt_token_here',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async userLogin(@Request() req: any) {
    try {
      const res = await this.authService.login(req.user);
      return res;
    } catch (error) {
      throw error;
    }
  }
}
