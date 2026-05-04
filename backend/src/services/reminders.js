import cron from 'node-cron';
import supabase from '../supabase.js';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

export function startReminderScheduler() {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const in10mins = new Date(now.getTime() + 10 * 60000);

      const { data: meetings, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('status', 'upcoming')
        .gte('start_time', now.toISOString())
        .lte('start_time', in10mins.toISOString());

      if (error) {
        console.error('Reminder fetch error:', error);
        return;
      }

      if (!meetings || meetings.length === 0) return;

      console.log(`Found ${meetings.length} meetings starting soon`);

      for (const meeting of meetings) {
        // Check if reminder already sent
        const { data: alreadySent } = await supabase
          .from('meeting_reminders')
          .select('id')
          .eq('meeting_id', meeting.id)
          .maybeSingle();

        if (alreadySent) continue;

        // Get user email
        const { data: userData } = await supabase
          .from('users')
          .select('email')
          .eq('id', meeting.user_id)
          .single();

        if (!userData?.email) {
          console.log('No email found for user:', meeting.user_id);
          continue;
        }

        // Format meeting time
        const meetingTime = new Date(meeting.start_time).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });

        // Send reminder email
        await resend.emails.send({
          from: 'MeetMind <onboarding@resend.dev>',
          to: [userData.email],
          subject: `⏰ ${meeting.title} starts in 10 minutes`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0f0d1a; color: #f0eeff;">
              <h2 style="color: #6C5CE7;">⏰ Meeting Reminder</h2>
              <p><strong>${meeting.title}</strong> starts at <strong>${meetingTime}</strong></p>
              ${meeting.meeting_url ? `
                <a href="${meeting.meeting_url}" style="background: #6C5CE7; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; margin-top: 12px;">
                  Join Meeting →
                </a>
              ` : ''}
              <p style="margin-top: 20px; color: #8b85a8; font-size: 13px;">
                MeetMind will automatically process this meeting after it ends.
              </p>
              <a href="${process.env.FRONTEND_URL}/dashboard" style="color: #6C5CE7; font-size: 13px;">
                Open Dashboard
              </a>
            </div>
          `
        });

        // Mark reminder as sent
        await supabase
          .from('meeting_reminders')
          .insert({ meeting_id: meeting.id });

        console.log(`✅ Reminder sent for: ${meeting.title} to ${userData.email}`);
      }
    } catch (err) {
      console.error('Reminder scheduler error:', err);
    }
  });

  console.log('✅ Reminder scheduler started');
}