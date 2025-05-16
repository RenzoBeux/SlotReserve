import './common/utils/firebase-admin';
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { BookingModule } from './booking/booking.module';
import { AvailabilityModule } from './availability/availability.module';
import { AppService } from './app.service';

@Module({
  imports: [UserModule, BookingModule, AvailabilityModule],
  providers: [AppService],
})
export class AppModule {}
