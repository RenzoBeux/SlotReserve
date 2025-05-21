import { Controller, Req, Body, Param } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { contract } from '@contract';
import { AvailabilityService } from './availability.service';
import { UserService } from '../user/user.service';
import { AuthenticatedRequest } from '../common/guards/firebase-auth.guard';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { DeleteAvailabilityDto } from './dto/delete-availability.dto';

@Controller()
@ApiTags('Availability')
export class AvailabilityController {
  @ApiOperation({ summary: 'Bulk create availability slots' })
  @ApiCreatedResponse({
    description: 'Bulk create availability slots',
    type: [Object],
  })
  // Auth guard is now global
  @TsRestHandler(contract.availability.createBulk)
  createBulk(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateAvailabilityDto[],
  ) {
    return tsRestHandler(contract.availability.createBulk, async () => {
      const userId = req.user.uid;
      const slots = await this.availabilityService.createBulk(userId, body);
      return { status: 201, body: slots };
    });
  }
  constructor(
    private readonly availabilityService: AvailabilityService,
    private readonly userService: UserService,
  ) {}
  @ApiOperation({ summary: 'Get public availability slots by slug' })
  @ApiOkResponse({
    description: 'Get public availability slots by slug',
    type: [Object],
  })
  @TsRestHandler(contract.availability.getBySlug)
  @Public()
  getBySlug(@Param('slug') slug: string) {
    return tsRestHandler(
      contract.availability.getBySlug,
      async (args: { headers: any; params: { slug: string } }) => {
        const userSlug: string = args.params.slug ?? slug;
        const user = await this.userService.getUserBySlug(userSlug);
        if (!user) {
          return { status: 404, body: null };
        }
        const slots = await this.availabilityService.getMine(user.id);
        // Compose owner info for public calendar
        const owner = {
          id: user.id,
          name: user.name,
          logo: user.logo ?? undefined,
          primaryColor: user.primaryColor ?? undefined,
          secondaryColor: user.secondaryColor ?? undefined,
        };
        return { status: 200, body: { owner, slots } };
      },
    );
  }

  @ApiOperation({ summary: 'Get my availability slots' })
  @ApiOkResponse({ description: 'Get my availability slots', type: [Object] })
  @TsRestHandler(contract.availability.getMine)
  getMine(@Req() req: AuthenticatedRequest) {
    return tsRestHandler(contract.availability.getMine, async () => {
      console.log(req.user);
      const userId = req.user.uid;
      const slots = await this.availabilityService.getMine(userId);
      return { status: 200, body: slots };
    });
  }

  @ApiOperation({ summary: 'Create availability slot' })
  @ApiCreatedResponse({ description: 'Create availability slot', type: Object })
  @TsRestHandler(contract.availability.create)
  create(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateAvailabilityDto,
  ) {
    return tsRestHandler(contract.availability.create, async () => {
      const userId = req.user.uid;
      const slot = await this.availabilityService.create(userId, body);
      return { status: 201, body: slot };
    });
  }

  @ApiOperation({ summary: 'Update availability slot' })
  @ApiOkResponse({ description: 'Update availability slot', type: Object })
  @TsRestHandler(contract.availability.update)
  update(
    @Req() req: AuthenticatedRequest,
    @Body() body: UpdateAvailabilityDto,
  ) {
    return tsRestHandler(contract.availability.update, async () => {
      const userId = req.user.uid;
      const slot = await this.availabilityService.update(userId, body);
      return { status: 200, body: slot };
    });
  }

  @ApiOperation({ summary: 'Delete availability slot' })
  @ApiNoContentResponse({ description: 'Delete availability slot' })
  @TsRestHandler(contract.availability.delete)
  delete(
    @Req() req: AuthenticatedRequest,
    @Body() body: DeleteAvailabilityDto,
  ) {
    return tsRestHandler(contract.availability.delete, async () => {
      const userId = req.user.uid;
      await this.availabilityService.delete(userId, body.id);
      return { status: 204, body: undefined as never };
    });
  }
}
