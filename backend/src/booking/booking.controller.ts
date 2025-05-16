import { Controller, UseGuards, Req, Body } from '@nestjs/common';
import { contract } from '@contract';
import { BookingService } from './booking.service';
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
  ApiCreatedResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { CreateBookingDto } from './dto/create-booking.dto';
import { DeleteBookingDto } from './dto/delete-booking.dto';

@Controller('booking')
@ApiTags('Booking')
@ApiBearerAuth('firebase-auth')
@UseGuards(FirebaseAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiOperation({ summary: 'Get my bookings' })
  @ApiOkResponse({ description: 'Get my bookings', type: [Object] })
  @TsRestHandler(contract.booking.getMine)
  getMine(@Req() req: AuthenticatedRequest) {
    return tsRestHandler(contract.booking.getMine, async () => {
      const userId = req.user.uid;
      const bookings = await this.bookingService.getMine(userId);
      return {
        status: 200,
        body: bookings.map((b) => ({
          ...b,
          note: b.note === null ? undefined : b.note,
        })),
      };
    });
  }

  @ApiOperation({ summary: 'Create booking' })
  @ApiCreatedResponse({ description: 'Create booking', type: Object })
  @TsRestHandler(contract.booking.create)
  create(@Req() req: AuthenticatedRequest, @Body() body: CreateBookingDto) {
    return tsRestHandler(contract.booking.create, async () => {
      const userId = req.user.uid;
      const fixedBody = { ...body, note: body.note ?? null };
      const booking = await this.bookingService.create(userId, fixedBody);
      return {
        status: 201,
        body: {
          ...booking,
          note: booking.note === null ? undefined : booking.note,
        },
      };
    });
  }

  @ApiOperation({ summary: 'Delete booking' })
  @ApiNoContentResponse({ description: 'Delete booking' })
  @TsRestHandler(contract.booking.delete)
  delete(@Req() req: AuthenticatedRequest, @Body() body: DeleteBookingDto) {
    return tsRestHandler(contract.booking.delete, async () => {
      const userId = req.user.uid;
      await this.bookingService.delete(userId, body.id);
      return { status: 204, body: undefined as never };
    });
  }
}
