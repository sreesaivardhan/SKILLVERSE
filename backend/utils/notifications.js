const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');

// Setup SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Setup Twilio
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send email notification
exports.sendEmail = async (to, subject, text, html) => {
  try {
    const msg = {
      to,
      from: process.env.FROM_EMAIL,
      subject,
      text,
      html
    };
    
    await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
    return true;
  } catch (err) {
    console.error('Error sending email:', err);
    return false;
  }
};

// Send SMS notification
exports.sendSMS = async (to, body) => {
  try {
    await twilioClient.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });
    
    console.log(`SMS sent to ${to}`);
    return true;
  } catch (err) {
    console.error('Error sending SMS:', err);
    return false;
  }
};

// Notification for session booking
exports.notifySessionBooked = async (session, instructor, learner) => {
  // Instructor notification
  await exports.sendEmail(
    instructor.email,
    'New Session Booked',
    `You have a new session request for ${session.skill}`,
    `<h1>New Session Request</h1>
     <p>You have a new session request from ${learner.name} for ${session.skill}</p>
     <p>Date: ${new Date(session.startTime).toLocaleString()}</p>
     <p>Duration: ${session.duration} minutes</p>
     <a href="${process.env.FRONTEND_URL}/sessions/${session._id}">View Details</a>`
  );
  
  // Optional SMS if phone number available
  if (instructor.phone && instructor.notifications.sms) {
    await exports.sendSMS(
      instructor.phone,
      `New session request from ${learner.name} for ${session.skill} on ${new Date(session.startTime).toLocaleString()}`
    );
  }
};
