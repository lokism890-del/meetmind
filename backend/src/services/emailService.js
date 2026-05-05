import nodemailer from 'nodemailer';

// Initialize email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Test connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Email service error:', error);
  } else {
    console.log('✉️ Email service ready');
  }
});

export async function sendMeetingReminder(user, meeting) {
  try {
    const meetingTime = new Date(meeting.start.dateTime);
    const formattedTime = meetingTime.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: `⏰ Reminder: ${meeting.summary} starts in 10 minutes`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            
            <h2 style="color: #333; margin-top: 0;">⏰ Meeting Reminder</h2>
            
            <p style="color: #666; font-size: 16px;">
              Your meeting <strong style="color: #6C5CE7;">${meeting.summary}</strong> starts in <strong>10 minutes</strong>!
            </p>
            
            <div style="background-color: #f9f9f9; border-left: 4px solid #6C5CE7; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 5px 0; color: #666;">
                <strong>Time:</strong> ${formattedTime}
              </p>
              ${meeting.description ? `<p style="margin: 5px 0; color: #666;"><strong>Description:</strong> ${meeting.description}</p>` : ''}
            </div>
            
            <p style="color: #666; margin: 20px 0;">
              ✨ <strong>MeetMind will automatically join and start recording your meeting!</strong>
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://meetmind-two.vercel.app/dashboard" 
                 style="background-color: #6C5CE7; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Go to Dashboard
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              This is an automated reminder from MeetMind. You'll also receive notifications when the meeting starts.
            </p>
          </div>
        </div>
      `,
      text: `Your meeting "${meeting.summary}" starts in 10 minutes at ${formattedTime}. MeetMind will automatically join and start recording.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Reminder sent to ${user.email}:`, info.messageId);
    return info;
  } catch (err) {
    console.error('Send reminder error:', err);
    throw err;
  }
}

export async function sendMeetingStartedNotification(userEmail, meeting, videoUrl) {
  try {
    const meetingTime = new Date(meeting.start.dateTime);
    const formattedTime = meetingTime.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: userEmail,
      subject: `🎙️ MeetMind has joined: ${meeting.summary}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            
            <h2 style="color: #333; margin-top: 0;">🎙️ Meeting Started</h2>
            
            <p style="color: #666; font-size: 16px;">
              MeetMind has automatically joined <strong style="color: #6C5CE7;">${meeting.summary}</strong> and started recording!
            </p>
            
            <div style="background-color: #f0f8f0; border-left: 4px solid #00ce80; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 5px 0; color: #666;">
                <strong>✅ Status:</strong> Recording in progress
              </p>
              <p style="margin: 5px 0; color: #666;">
                <strong>Time:</strong> ${formattedTime}
              </p>
              <p style="margin: 5px 0; color: #666;">
                <strong>Meeting:</strong> ${meeting.summary}
              </p>
            </div>
            
            <p style="color: #666; margin: 20px 0;">
              📝 <strong>What's happening:</strong>
            </p>
            <ul style="color: #666; margin: 10px 0 20px 20px;">
              <li>🎬 Recording your meeting</li>
              <li>🔊 Capturing audio and video</li>
              <li>✍️ Transcribing in real-time</li>
              <li>⚡ Generating summary after meeting</li>
            </ul>
            
            ${videoUrl ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${videoUrl}" 
                 style="background-color: #00ce80; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin-right: 10px;">
                Join Meeting
              </a>
              <a href="https://meetmind-two.vercel.app/dashboard" 
                 style="background-color: #6C5CE7; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                View Dashboard
              </a>
            </div>
            ` : `
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://meetmind-two.vercel.app/dashboard" 
                 style="background-color: #6C5CE7; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                View Dashboard
              </a>
            </div>
            `}
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              Your meeting summary will be available when the meeting ends. You'll receive a notification once processing is complete.
            </p>
          </div>
        </div>
      `,
      text: `MeetMind has joined your meeting "${meeting.summary}" and started recording. View your dashboard to see the status.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Started notification sent to ${userEmail}:`, info.messageId);
    return info;
  } catch (err) {
    console.error('Send started notification error:', err);
    throw err;
  }
}

export async function sendMeetingSummary(userEmail, meeting, summary, transcription) {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: userEmail,
      subject: `📊 Meeting Summary: ${meeting.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            
            <h2 style="color: #333; margin-top: 0;">📊 Meeting Summary</h2>
            
            <p style="color: #666; font-size: 16px; margin: 20px 0;">
              <strong>${meeting.title}</strong>
            </p>
            
            <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <h3 style="color: #333; margin-top: 0;">Summary</h3>
              <p style="color: #666; line-height: 1.6;">${summary}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://meetmind-two.vercel.app/dashboard" 
                 style="background-color: #6C5CE7; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                View Full Transcript
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              Your complete meeting transcript and analysis are available in your MeetMind dashboard.
            </p>
          </div>
        </div>
      `,
      text: `Meeting Summary: ${meeting.title}\n\n${summary}`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Summary sent to ${userEmail}:`, info.messageId);
    return info;
  } catch (err) {
    console.error('Send summary error:', err);
    throw err;
  }
}