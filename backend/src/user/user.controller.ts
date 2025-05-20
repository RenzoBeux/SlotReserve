import { Controller, UseGuards, Req, Body } from '@nestjs/common';
import { contract } from '@contract';
import { UserService } from './user.service';
import {
  AuthenticatedRequest,
  FirebaseAuthGuard,
} from '../common/guards/firebase-auth.guard';
import { Request } from 'express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { UpdateUserDto } from './dto/update-user.dto';
import * as admin from 'firebase-admin';

@Controller()
@ApiTags('User')
@ApiBearerAuth('firebase-auth')
@UseGuards(FirebaseAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get current user' })
  @ApiOkResponse({ description: 'Get current user', type: Object })
  @ApiNotFoundResponse({ description: 'User not found' })
  @TsRestHandler(contract.user.getMe)
  getMe(@Req() req: AuthenticatedRequest) {
    return tsRestHandler(contract.user.getMe, async () => {
      const uid = req.user.uid;
      const user = await this.userService.getMe(uid);
      if (!user) {
        // Fetch info from Firebase if needed
        const firebaseUser = await admin.auth().getUser(uid);
        const newUser = await this.userService.findOrCreateUser(
          firebaseUser.uid,
          firebaseUser.email || '',
          firebaseUser.displayName || '',
        );
        return {
          status: 200,
          body: {
            ...newUser,
            logo: newUser.logo === null ? undefined : newUser.logo,
            primaryColor:
              newUser.primaryColor === null ? undefined : newUser.primaryColor,
            secondaryColor:
              newUser.secondaryColor === null
                ? undefined
                : newUser.secondaryColor,
          },
        };
      }
      return {
        status: 200,
        body: {
          ...user,
          logo: user.logo === null ? undefined : user.logo,
          primaryColor:
            user.primaryColor === null ? undefined : user.primaryColor,
          secondaryColor:
            user.secondaryColor === null ? undefined : user.secondaryColor,
        },
      };
    });
  }

  @ApiOperation({ summary: 'Update current user' })
  @ApiOkResponse({ description: 'Update current user', type: Object })
  @TsRestHandler(contract.user.updateMe)
  updateMe(@Req() req: AuthenticatedRequest, @Body() body: UpdateUserDto) {
    return tsRestHandler(contract.user.updateMe, async () => {
      const uid = req.user.uid;
      const user = await this.userService.updateMe(uid, body);
      return {
        status: 200,
        body: {
          ...user,
          logo: user.logo === null ? undefined : user.logo,
          primaryColor:
            user.primaryColor === null ? undefined : user.primaryColor,
          secondaryColor:
            user.secondaryColor === null ? undefined : user.secondaryColor,
        },
      };
    });
  }
}
