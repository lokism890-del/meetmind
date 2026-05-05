import { supabase } from '../supabase.js';
import { sendMeetingReminder, sendMeetingStartedNotification } from './emailServices.js';
import { getUpcomingMeetings, extractVideoConferenceUrl } from './calendarService.js';

let reminderInterval = null;

export function startReminderScheduler() {
  console.log('⏰ Starting meeting reminder scheduler...');

  // Check every 30 seconds for upcoming meetings
  reminderInterval = setInterval(async () => {
    try {
      await checkAndNotifyMeetings();
    } catch (err) {
      console.error('Reminder scheduler error:', err);
    }
  }, 30000); // Check every 30 seconds

  console.log('✅ Reminder scheduler is running');
}

export function stopReminderScheduler() {
  if (reminderInterval) {
    clearInterval(reminderInterval);
    console.log('⛔ Reminder scheduler stopped');
  }
}

async function checkAndNotifyMeetings() {
  try {
    // Get all users with connected calendars
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, google_access_token, clerk_id')
      .eq('calendar_connected', true)
      .not('google_access_token', 'is', null);

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    if (!users || users.length === 0) {
      return;
    }

    console.log(`📅 Checking ${users.length} users for upcoming meetings...`);

    for (const user of users) {
      try {
        const upcomingMeetings = await getUpcomingMeetings(user.id, user.google_access_token);

        for (const meeting of upcomingMeetings) {
          const meetingStartTime = new Date(meeting.start.dateTime);
          const now = new Date();
          const minutesUntilMeeting = (meetingStartTime - now) / (1000 * 60);

          console.log(`Meeting: "${meeting.summary}" in ${minutesUntilMeeting.toFixed(1)} minutes`);

          // Send 10-minute reminder
          if (minutesUntilMeeting > 9.5 && minutesUntilMeeting <= 10.5) {
            console.log(`📧 Sending 10-minute reminder for "${meeting.summary}" to ${user.email}`);
            
            try {
              await sendMeetingReminder(user, meeting);
              await recordReminderSent(user.id, meeting.id);
            } catch (emailErr) {
              console.error('Error sending reminder email:', emailErr);
            }
          }

          // Auto-join at meeting start (within 1 minute after start)
          if (minutesUntilMeeting <= 1 && minutesUntilMeeting >= -1) {
            console.log(`🔗 Auto-joining "${meeting.summary}" for ${user.email}`);
            
            try {
              await autoJoinMeeting(user.id, user.email, meeting);
            } catch (joinErr) {
              console.error('Error auto-joining meeting:', joinErr);
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

async function recordReminderSent(userId, googleEventId) {
  try {
    // Check if reminder was already sent today
    const { data: existing } = await supabase
      .from('meeting_reminders')
      .select('id')
      .eq('user_id', userId)
      .eq('google_event_id', googleEventId)
      .gte('sent_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1);

    if (existing && existing.length > 0) {
      console.log('Reminder already sent for this meeting today');
      return;
    }

    // Record that reminder was sent
    const { error } = await supabase
      .from('meeting_reminders')
      .insert({
        user_id: userId,
        google_event_id: googleEventId,
        sent_at: new Date()
      });

    if (error) {
      console.error('Error recording reminder:', error);
    }
  } catch (err) {
    console.error('Record reminder error:', err);
  }
}

async function autoJoinMeeting(userId, userEmail, meeting) {
  try {
    // Extract video conference URL
    const videoUrl = extractVideoConferenceUrl(meeting);

    // Create meeting record in database
    const { data: meetingRecord, error } = await supabase
      .from('meetings')
      .insert({
        user_id: userId,
        google_event_id: meeting.id,
        title: meeting.summary,
        start_time: meeting.start.dateTime,
        end_time: meeting.end.dateTime,
        video_url: videoUrl,
        status: 'auto_joined',
        auto_joined_at: new Date()
      })
      .select();

    if (error) {
      console.error('Error creating meeting record:', error);
      return;
    }

    // Send auto-join notification
    try {
      await sendMeetingStartedNotification(userEmail, meeting, videoUrl);
    } catch (emailErr) {
      console.error('Error sending started notification:', emailErr);
    }

    console.log(`✅ Auto-joined meeting record created for ${meeting.summary}`);
  } catch (err) {
    console.error('Auto-join meeting error:', err);
  }
}

export async function getMeetingReminders(userId) {
  try {
    const { data, error } = await supabase
      .from('meeting_reminders')
      .select('*')
      .eq('user_id', userId)
      .order('sent_at', { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('Get reminders error:', err);
    throw err;
  }
}

export async function getAutoJoinedMeetings(userId) {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'auto_joined')
      .order('start_time', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('Get auto-joined meetings error:', err);
    throw err;
  }
}