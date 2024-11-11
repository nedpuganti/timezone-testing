import { inject, Injectable } from '@angular/core';
import moment from 'moment';
import 'moment-timezone';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class TimezoneService {
  settingsService: SettingsService = inject(SettingsService);

  private timezoneSubject = new BehaviorSubject<{
    offsetMinutes: number;
    timezoneId: string;
  }>({
    offsetMinutes: 0,
    timezoneId: 'UTC',
  });
  timezone$ = this.timezoneSubject.asObservable();
  timezoneData: {
    offsetMinutes: number;
    timezoneId: string;
  } = {
    offsetMinutes: 0,
    timezoneId: 'UTC',
  };

  private initialized = false;

  // Initialize the timezone data
  initialize(): Promise<{
    offsetMinutes: number;
    timezoneId: string;
  }> {
    if (this.initialized) return Promise.resolve(this.timezoneData);

    return new Promise((resolve) => {
      lastValueFrom(this.settingsService.getTimeZoneData()).then(
        (_locationData) => {
          if (_locationData) {
            setTimeout(() => {
              const locationData = _locationData?.practiceLocation?.timeZone;
              const timezone = {
                offsetMinutes: locationData.offsetMinutes,
                timezoneId: locationData.timezoneId,
              };

              this.setTimezone(timezone);
              this.timezoneData = timezone;
              this.initialized = true;
              console.log('TimezoneService: timezoneData', this.timezoneData);
              resolve(timezone);
            }, 1000);
          }
        }
      );
    });
  }

  getIanaTimezone(shortTimeZone: string): string {
    const timezoneMap: { [key: string]: string } = {
      // U.S. Timezones
      PST: 'America/Los_Angeles', // Pacific Standard Time
      PDT: 'America/Los_Angeles', // Pacific Daylight Time
      MST: 'America/Denver', // Mountain Standard Time
      MDT: 'America/Denver', // Mountain Daylight Time
      CST: 'America/Chicago', // Central Standard Time
      CDT: 'America/Chicago', // Central Daylight Time
      EST: 'America/New_York', // Eastern Standard Time
      EDT: 'America/New_York', // Eastern Daylight Time
      // Indian Timezones
      IST: 'Asia/Kolkata', // Indian Standard Time

      // Global Timezones
      // UTC Offsets
      UTC: 'Etc/UTC', // Coordinated Universal Time
    };

    return (
      timezoneMap[shortTimeZone as keyof typeof timezoneMap] || shortTimeZone
    ); // Fallback if not found
  }

  getOffsetMinutes(toTimeZone: string) {
    const date = new Date();
    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const localOffset = moment.tz(date, localTimeZone).utcOffset();
    const toOffset = moment.tz(date, toTimeZone).utcOffset();

    return toOffset - localOffset;
  }

  public getCurrentDateInTimezone(
    dateString: Date | number | string | null = null,
    timezone?: string
  ): Date {
    const date = dateString ? new Date(dateString) : new Date();
    console.log('this.timezoneData', this.timezoneData);
    const offsetMinutes = this.getOffsetMinutes(
      this.getIanaTimezone(timezone || this.timezoneData.timezoneId)
    );
    const localizedDateString = new Date(
      date.getTime() - offsetMinutes * 60 * 1000
    );
    return localizedDateString;
  }

  // Set the timezone after fetching it from the API
  setTimezone(timezone: { offsetMinutes: number; timezoneId: string }): void {
    this.timezoneSubject.next(timezone);
  }

  getCurrentTimezone(): {
    offsetMinutes: number;
    timezoneId: string;
  } {
    return this.timezoneSubject.getValue();
  }
}
