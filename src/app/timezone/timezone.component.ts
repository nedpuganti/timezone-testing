import { DatePipe } from '@angular/common';
import {
  Component,
  inject,
  model,
  ModelSignal,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CustomDatePipe } from '../custom-date.pipe';
import { TimezoneService } from '../timezone.service';

@Component({
  selector: 'app-timezone',
  imports: [
    CustomDatePipe,
    DatePipe,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
  ],
  templateUrl: './timezone.component.html',
  styleUrl: './timezone.component.scss',
})
export class TimezoneComponent {
  timezoneService: TimezoneService = inject(TimezoneService);

  customDate: WritableSignal<Date> = signal(
    this.timezoneService.getCurrentDateInTimezone()
  );
  customTimezone: WritableSignal<string> = signal(
    this.timezoneService.getIanaTimezone(
      this.timezoneService.timezoneData.timezoneId
    )
  );

  localDate: WritableSignal<Date> = signal(new Date());
  localTimeZone: WritableSignal<string> = signal(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  localDateTime: ModelSignal<Date> = model(this.localDate());
  customDateTime: ModelSignal<Date> = model(this.customDate());
}
