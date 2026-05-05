import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

console.log('✉️ Email service ready (Resend)');

export async function sendMeetingReminder(user, meeting) {
  try {
    const meetingTime = new Date(meeting.start.dateTime);
    const formattedTime = meetingTime.toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    });

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@meetmind.app',
      to: user.email,
      subject: `⏰ Reminder: ${meeting.summary} starts in 10 minutes`,
      html: `<div style="font-family:Arial,sans-serif;padding:20px;"><h2>⏰ Meeting Reminder</h2><p>Your meeting <strong>${meeting.summary}</strong> starts in <strong>10 minutes</strong>!</p><p><strong>Time:</strong> ${formattedTime}</p><a href="https://meetmind-two.vercel.app/dashboard" style="background:#6C5CE7;color:white;padding:12px 30px;text-decoration:none;border-radius:6px;display:inline-block;">Go to Dashboard</a></div>`
    });

    if (error) throw error;
    console.log(`✅ Reminder sent to ${user.email}:`, data?.id);
    return data;
  } catch (err) {
    console.error('Send reminder error:', err);
    throw err;
  }
}

export async function sendMeetingStartedNotification(userEmail, meeting, videoUrl) {
  try {
    const meetingTime = new Date(meeting.start.dateTime);
    const formattedTime = meetingTime.toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    });

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@meetmind.app',
      to: userEmail,
      subject: `🎙️ MeetMind has joined: ${meeting.summary}`,
      html: `<div style="font-family:Arial,sans-serif;padding:20px;"><h2>🎙️ Meeting Started</h2><p>MeetMind has joined <strong>${meeting.summary}</strong> and started recording!</p><p><strong>Time:</strong> ${formattedTime}</p>${videoUrl ? `<a href="${videoUrl}" style="background:#00ce80;color:white;padding:12px 30px;text-decoration:none;border-radius:6px;display:inline-block;margin-right:10px;">Join Meeting</a>` : ''}<a href="https://meetmind-two.vercel.app/dashboard" style="background:#6C5CE7;color:white;padding:12px 30px;text-decoration:none;border-radius:6px;display:inline-block;">View Dashboard</a></div>`
    });

    if (error) throw error;
    console.log(`✅ Started notification sent to ${userEmail}:`, data?.id);
    return data;
  } catch (err) {
    console.error('Send started notification error:', err);
    throw err;
  }
}

export async function sendMeetingSummary({ to, meetingTitle, summary, decisions, actionItems, transcript }) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@meetmind.app',
      to: to,
      subject: `📊 Meeting Summary: ${meetingTitle}`,
      html: `<div style="font-family:Arial,sans-serif;padding:20px;"><h2>📊 Meeting Summary</h2><p><strong>${meetingTitle}</strong></p><div style="background:#f9f9f9;padding:15px;border-radius:4px;margin:20px 0;"><h3>Summary</h3><p>${summary}</p></div>${decisions?.length > 0 ? `<div style="background:#f0f8f0;padding:15px;border-radius:4px;margin:20px 0;"><h3>✅ Decisions</h3><ul>${decisions.map(d => `<li>${d}</li>`).join('')}</ul></div>` : ''}${actionItems?.length > 0 ? `<div style="background:#fff8f0;padding:15px;border-radius:4px;margin:20px 0;"><h3>📋 Action Items</h3><ul>${actionItems.map(a => `<li>${a}</li>`).join('')}</ul></div>` : ''}<a href="https://meetmind-two.vercel.app/dashboard" style="background:#6C5CE7;color:white;padding:12px 30px;text-decoration:none;border-radius:6px;display:inline-block;">View Full Transcript</a></div>`
    });

    if (error) throw error;
    console.log(`✅ Summary sent to ${to}:`, data?.id);
    return data;
  } catch (err) {
    console.error('Send summary error:', err);
    throw err;
  }
}
