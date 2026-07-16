const nodemailer = require('nodemailer');


const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'gmail';
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_USER || 'no-reply@example.com';

const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

const sendApprovalEmail = async (userEmail, userName, pdfBuffer, applicationId) => {
  try {
    const mailOptions = {
      from: EMAIL_FROM,
      to: userEmail,
      subject: 'Application Approved - Scheme Portal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">🎉 Congratulations ${userName}!</h2>
          <p>We are pleased to inform you that your application has been <strong>APPROVED</strong>.</p>
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Application ID:</strong> ${applicationId}</p>
            <p><strong>Status:</strong> Approved</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <p>Please find your approval certificate attached to this email.</p>
          <p style="color: #6b7280; font-size: 14px;">
            If you have any questions, please contact our support team.
          </p>
          <hr style="margin: 30px 0;">
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            This is an automated email from Scheme Portal. Please do not reply.
          </p>
        </div>
      `,
      attachments: [{
        filename: `approval-certificate-${applicationId}.pdf`,
        content: Buffer.from(pdfBuffer),
        contentType: 'application/pdf'
      }]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Approval email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

const sendRejectionEmail = async (userEmail, userName, applicationId, remarks) => {
  try {
    const mailOptions = {
      from: EMAIL_FROM,
      to: userEmail,
      subject: 'Application Status Update - Scheme Portal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Application Status Update</h2>
          <p>Dear ${userName},</p>
          <p>We regret to inform you that your application has been <strong>REJECTED</strong>.</p>
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <p><strong>Application ID:</strong> ${applicationId}</p>
            <p><strong>Status:</strong> Rejected</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            ${remarks ? `<p><strong>Remarks:</strong> ${remarks}</p>` : ''}
          </div>
          <p>You may reapply after addressing the issues mentioned in the remarks.</p>
          <p style="color: #6b7280; font-size: 14px;">
            If you have any questions, please contact our support team.
          </p>
          <hr style="margin: 30px 0;">
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            This is an automated email from Scheme Portal. Please do not reply.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Rejection email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

module.exports = { sendApprovalEmail, sendRejectionEmail };