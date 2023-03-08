import { calendar, auth, calendar_v3 } from '@googleapis/calendar';
import { Injectable, LoggerService } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { subMinutes } from 'date-fns';

type GoogleCalendarEvent = calendar_v3.Schema$Event;

@Injectable()
export class CalendarService {
  calendar: ReturnType<typeof calendar>;

  constructor(private loggerService: LoggerService) {
    this.connectToCalendar();
  }

  async connectToCalendar() {
    try {
      // Create a new GoogleAuth instance with service-account credentials from a json file.
      // Note: credential file location must be set in GOOGLE_APPLICATION_CREDENTIALS env variable
      const newAuth = new auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/calendar'],
        clientOptions: {
          // Overwrite JWT subject to 'impersonate' calendar user
          subject: 'wilco@headfwd.com',
        },
      });

      this.calendar = calendar({
        version: 'v3',
        auth: await newAuth.getClient(),
      });
    } catch (err) {
      this.loggerService.log(
        `[calendar] could not connect to calendar API: ${err}`,
      );
      return;
    }

    this.loggerService.log('[calendar] successfully connected to calendar API');

    if (!process.env.EVENT_CALENDAR_ID) {
      this.loggerService.log(
        '[calendar] no CALENDAR_ID found in env, poller not started',
      );
      return;
    }

    this.loggerService.log('[calendar] starting poller');
  }

  @Interval(1000 * 5)
  async pollCalendarEvents() {
    this.loggerService.debug('[calendar] polling messages...');

    const timeNow = new Date();
    const timeMin = subMinutes(new Date(), 10);

    try {
      const response = await this.calendar.events.list({
        calendarId: process.env.EVENT_CALENDAR_ID,
        singleEvents: true,
        timeMin: timeMin.toISOString(),
        timeMax: timeNow.toISOString(),
      });

      const events = response.data.items as GoogleCalendarEvent[];

      for (const event of events) {
        this.loggerService.debug(`[calendar] found event: ${event.summary}`);
        await this.processEvent(event);
      }
    } catch (err) {
      this.loggerService.log(`[calendar] poller failed: ${err}`);
    }

    return false;
  }

  async processEvent(event: GoogleCalendarEvent) {
    // Test event for a summary in the format of '[#channel] ...'
    const regex = /^\[(#[a-z0-9-_]+)\]/;
    const elements = regex.exec(event.summary);

    // This event does not match format (could have been processed before)
    if (elements === null) {
      return;
    }

    this.loggerService.log(`[calendar] processing event: ${event.summary}`);

    const channel = elements[1];
    const message = event.description;

    if (message) {
      //   await this.postSlackMessage(channel, message);
    }

    const newSymbol = message ? '!' : '?';
    const newSummary = '[' + newSymbol + event.summary.substring(2);

    await this.calendar.events.patch({
      calendarId: process.env.EVENT_CALENDAR_ID,
      eventId: event.id,
      requestBody: {
        summary: newSummary,
      },
    });
  }
}
