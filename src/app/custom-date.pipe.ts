// custom-date.pipe.ts
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform, inject } from '@angular/core';
import { TimezoneService } from './timezone.service';

@Pipe({
  name: 'customDate',
  standalone: true,
})
export class CustomDatePipe implements PipeTransform {
  private timezoneService = inject(TimezoneService);
  private datePipe = inject(DatePipe);

  transform(
    value: Date | string | number | null | undefined,
    format?: string,
    timezone?: string,
    locale?: string
  ): string | null {
    if (!value) {
      return '';
    }

    // Set "mediumDate" as the default format if none is provided
    const effectiveFormat = format || 'mediumDate';

    // Create a date object
    const date = this.timezoneService.getCurrentDateInTimezone(value, timezone);

    // Call the base class's transform method with the effective values
    return this.datePipe.transform(date, effectiveFormat, locale || 'en-US');
  }
}
