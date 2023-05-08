import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('security/devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Req() req) {
    return this.devicesService.getUserSessions(req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteSession(@Param('id') id: string, @Req() req) {
    if (!req.cookies.refreshToken) throw new UnauthorizedException();

    return this.devicesService.deleteUserSession(req.cookies.refreshToken, id);
  }
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  deleteAllSessionsExceptCurrent(@Req() req) {
    if (!req.cookies.refreshToken) throw new UnauthorizedException();
    return this.devicesService.deleteAllUserSessionsExceptCurrent(
      req.cookies.refreshToken,
    );
  }
}
