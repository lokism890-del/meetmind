import { supabase } from '../supabase.js';
import { sendMeetingReminder, sendMeetingStartedNotification } from './emailService.js';
import { getUpcomingMeetings, extractVideoConferenceUrl } from './calendarService.js';

// Pakistan Standard Time
const TIMEZONE = 'Asia/Karachi';

let reminderInterval = null;

export function startReminderScheduler() {
  console.log('⏰ Starting meeting reminder scheduler (PKT - Asia/Karachi)...');

  reminderInterval = setInterval(async () => {
    try {
      await checkAndNotifyMeetings();
    } catch (err) {
      console.error('Reminder scheduler error:', err);
    }
  }, 30000);

  console.log('✅ Reminder scheduler is running');
}

export function stopReminderScheduler() {
  if (reminderInterval) {
    clearInterval(reminderInterval);
    console.log('Reminder scheduler stopped');
  }
}

function getPakistanTime(date = new Date()) {
  return new Date(date.toLocaleString('en-US', { timeZone: TIMEZONE }));
}

function formatPakistanTime(date) {
  return new Date(date).toLocaleString('en-US', {
    timeZone: TIMEZONE,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  });
}

async function checkAndNotifyMeetings() {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, google_access_token, clerk_id')
      .eq('calendar_connected', true)
      .not('google_access_token', 'is', null);

    if (error || !users || users.length === 0) return;

    const nowPKT = getPakistanTime();
    console.log(`📅 Checking meetings at PKT: ${formatPakistanTime(new Date())}`);

    for (const user of users) {
      try {
        const upcomingMeetings = await getUpcomingMeetings(user.id, user.google_access_token);

        for (const meeting of upcomingMeetings) {
          const meetingStartTime = new Date(meeting.start.dateTime);
          const now = new Date();
          const minutesUntilMeeting = (meetingStartTime - now) / (1000 * 60);

          const meetingTimePKT = formatPakistanTime(meetingStartTime);
          console.log(`Meeting: "${meeting.summary}" at ${meetingTimePKT} (in ${minutesUntilMeeting.toFixed(1)} min)`);

          // Send 10-minute reminder
          if (minutesUntilMeeting > 9.5 && minutesUntilMeeting <= 10.5) {
            const alreadySent = await wasReminderSent(user.id, meeting.id);
            if (!alreadySent) {
              console.log(`📧 Sending 10-min reminder for "${meeting.summary}" to ${user.email}`);
              await sendMeetingReminder(user, meeting, meetingTimePKT);
              await recordReminderSent(user.id, meeting.id);
            }
          }

          // Auto-join at meeting start
          if (minutesUntilMeeting <= 1 && minutesUntilMeeting >= -1) {
            const alreadyJoined = await wasAutoJoined(user.id, meeting.id);
            if (!alreadyJoined) {
              console.log(`🔗 Auto-joining "${meeting.summary}" for ${user.email}`);
              await autoJoinMeeting(user.id, user.email, meeting, meetingTimePKT);
            }
          }
        }
      } catch (userErr) {
        console.error(`Error processing user ${user.id}:`, userErr.message);
      }
    }
  } catch (err) {
    console.error('Check and notify error:', err);
  }
}

async function wasReminderSent(userId, googleEventId) {
  const { data } = await supabase
    .from('meeting_reminders')
    .select('id')
    .eq('user_id', userId)
    .eq('google_event_id', googleEventId)
    .gte('sent_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .limit(1);
  return data && data.length > 0;
}

async function wasAutoJoined(userId, googleEventId) {
  const { data } = await supabase
    .from('meetings')
    .select('id')
    .eq('user_id', userId)
    .eq('google_event_id', googleEventId)
    .eq('status', 'auto_joined')
    .limit(1);
  return data && data.length > 0;
}

async function recordReminderSent(userId, googleEventId) {
  await supabase.from('meeting_reminders').insert({
    user_id: userId,
    google_event_id: googleEventId,
    sent_at: new Date()
  });
}

async function autoJoinMeeting(userId, userEmail, meeting, meetingTimePKT) {
  try {
    const videoUrl = extractVideoConferenceUrl(meeting);

    await supabase.from('meetings').insert({
      user_id: userId,
      google_event_id: meeting.id,
      title: meeting.summary,
      start_time: meeting.start.dateTime,
      end_time: meeting.end.dateTime,
      video_url: videoUrl,
      status: 'auto_joined',
      auto_joined_at: new Date()
    });

    await sendMeetingStartedNotification(userEmail, meeting, videoUrl, meetingTimePKT);
    console.log(`✅ Auto-joined: ${meeting.summary}`);
  } catch (err) {
    console.error('Auto-join error:', err);
  }
}