import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
  inject,
  provideAppInitializer,
} from '@angular/core';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  DefaultMatCalendarRangeStrategy,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  MatDatepickerModule,
  MatRangeDateSelectionModel,
} from '@angular/material/datepicker';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { DatePipe } from '@angular/common';
import { MAT_CARD_CONFIG } from '@angular/material/card';
import { routes } from './app.routes';
import { CustomMomentDateAdapter } from './custom-moment-date-adapter';
import { TIMEZONE_DATA } from './timezone.inject';
import { TimezoneService } from './timezone.service';

export function initializeTimezoneService(
  timezoneService: TimezoneService
): () => Promise<{ offsetMinutes: number; timezoneId: string }> {
  return async () => {
    const data = timezoneService.initialize();
    console.log('initializeTimezoneService', await data);
    return data;
  };
}

export const CalendarConfigServices = [
  {
    provide: MAT_CARD_CONFIG,
    useValue: { appearance: 'outlined' },
  },
  TimezoneService,
  provideAppInitializer(() => {
    const initializerFn = initializeTimezoneService(inject(TimezoneService));
    return initializerFn();
  }),
  {
    provide: TIMEZONE_DATA,
    useFactory: (timezoneService: TimezoneService) => {
      console.log('TIMEZONE_DATA', timezoneService.timezoneData);
      return timezoneService.getIanaTimezone(
        timezoneService.timezoneData.timezoneId
      );
    },
    deps: [TimezoneService],
  },
  // {
  //   provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  //   useValue: { useUtc: true }
  // },
  { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  {
    provide: DateAdapter,
    useClass: CustomMomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS, TIMEZONE_DATA],
  },
  {
    provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
    useClass: DefaultMatCalendarRangeStrategy,
  },
  CustomMomentDateAdapter,
  DefaultMatCalendarRangeStrategy,
  MatRangeDateSelectionModel,
  DatePipe,
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom([MatDatepickerModule]),
    ...CalendarConfigServices,
  ],
};
