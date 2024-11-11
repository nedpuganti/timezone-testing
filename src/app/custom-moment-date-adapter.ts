// custom-moment-date-adapter.ts
import { Inject, Injectable, Optional } from '@angular/core';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
import 'moment-timezone';
import { TIMEZONE_DATA } from './timezone.inject';

@Injectable()
export class CustomMomentDateAdapter extends MomentDateAdapter {
  constructor(
    @Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string,
    @Optional()
    @Inject(MAT_MOMENT_DATE_ADAPTER_OPTIONS)
    matMomentDateAdapterOptions: any,
    @Inject(TIMEZONE_DATA) private timezone: string
  ) {
    console.log('CustomMomentDateAdapter timezone', timezone);
    super(dateLocale, matMomentDateAdapterOptions);
  }

  override parse(
    value: any,
    parseFormat: string | string[]
  ): moment.Moment | null {
    if (typeof value === 'string' && value.length > 0) {
      return moment.tz(value, parseFormat, this.timezone);
    }
    return value ? moment(value).tz(this.timezone) : null;
  }

  override format(date: moment.Moment, displayFormat: string): string {
    if (!date.isValid()) {
      return '';
    }

    return date.tz(this.timezone).format(displayFormat);
  }

  override createDate(
    year: number,
    month: number,
    date: number
  ): moment.Moment {
    if (this.timezone) console.log('create date timezone', this.timezone);
    const currentDate = new Date();
    currentDate.setFullYear(year, month, date);
    return moment.tz(currentDate, this.timezone);
  }

  override toIso8601(date: moment.Moment): string {
    return date.clone().tz(this.timezone).toISOString();
  }
}
