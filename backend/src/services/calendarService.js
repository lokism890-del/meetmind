import { google } from 'googleapis';
import { supabase } from '../supabase.js';

const calendar = google.calendar('v3');

export async function getGoogleCalendarAuth(googleAccessToken) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: googleAccessToken
    });

    return oauth2Client;
  } catch (err) {
    console.error('Auth error:', err);
    throw err;
  }
}

export async function getUpcomingMeetings(userId, googleAccessToken) {
  try {
    const auth = await getGoogleCalendarAuth(googleAccessToken);

    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const response = await calendar.events.list({
      auth,
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: tomorrow.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      fields: 'items(id,summary,start,end,videoConferenceData,description,conferenceData)'
    });

    return response.data.items || [];
  } catch (err) {
    console.error('Calendar fetch error:', err);
    throw err;
  }
}

export async function createMeetingEvent(userId, googleAccessToken, meetingData) {
  try {
    const auth = await getGoogleCalendarAuth(googleAccessToken);

    const event = {
      summary: meetingData.title,
      description: `MeetMind Meeting ID: ${meetingData.meetingId}`,
      start: {
        dateTime: new Date(meetingData.startTime).toISOString(),
        timeZone: 'UTC'
      },
      end: {
        dateTime: new Date(meetingData.endTime).toISOString(),
        timeZone: 'UTC'
      },
      conferenceData: {
        createRequest: {
          requestId: `meetmind-${meetingData.meetingId}-${Date.now()}`
        }
      }
    };

    const response = await calendar.events.insert({
      auth,
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1
    });

    return response.data;
  } catch (err) {
    console.error('Event creation error:', err);
    throw err;
  }
}

export async function getEventDetails(userId, googleAccessToken, eventId) {
  try {
    const auth = await getGoogleCalendarAuth(googleAccessToken);

    const response = await calendar.events.get({
      auth,
      calendarId: 'primary',
      eventId: eventId
    });

    return response.data;
  } catch (err) {
    console.error('Get event error:', err);
    throw err;
  }
}

export async function updateEventDescription(userId, googleAccessToken, eventId, description) {
  try {
    const auth = await getGoogleCalendarAuth(googleAccessToken);

    const event = await calendar.events.get({
      auth,
      calendarId: 'primary',
      eventId: eventId
    });

    event.data.description = description;

    const response = await calendar.events.update({
      auth,
      calendarId: 'primary',
      eventId: eventId,
      resource: event.data
    });

    return response.data;
  } catch (err) {
    console.error('Update event error:', err);
    throw err;
  }
}

export async function extractVideoConferenceUrl(event) {
  try {
    // Check for Google Meet
    if (event.conferenceData?.entryPoints) {
      const meetEntry = event.conferenceData.entryPoints.find(ep => ep.entryPointType === 'video');
      if (meetEntry) {
        return meetEntry.uri;
      }
    }

    // Check for description (might contain Zoom or Teams link)
    if (event.description) {
      const urlMatch = event.description.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        return urlMatch[0];
      }
    }

    return null;
  } catch (err) {
    console.error('Extract video URL error:', err);
    return null;
  }
}