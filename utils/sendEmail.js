import nodemailer from "nodemailer";
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: `"IndiaPodcasts" <${SMTP_USER}>`,
      to,
      subject,
      html,
      text,
    });
    console.log(`✅ Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`❌ Email error: ${error.message}`);
    return false;
  }
};

export const sendContactConfirmation = async (name, email) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0D0D0D; padding: 30px; text-align: center;">
        <h1 style="color: #F5C518; margin: 0;">IndiaPodcasts</h1>
        <p style="color: #9CA3AF; margin: 5px 0 0;">"We Hear What You Want To Say"</p>
      </div>
      <div style="background: #1A1A1A; padding: 30px;">
        <h2 style="color: #FFFFFF;">Hi ${name},</h2>
        <p style="color: #9CA3AF; line-height: 1.6;">
          Thank you for reaching out to us! We have received your message and
          will get back to you within 24-48 hours.
        </p>
        <p style="color: #9CA3AF; line-height: 1.6;">
          In the meantime, feel free to explore our latest episodes and videos
          on our website.
        </p>
        <a href="https://indiapodcasts.in"
          style="display: inline-block; background: #F5C518; color: #0D0D0D;
          padding: 12px 24px; border-radius: 50px; text-decoration: none;
          font-weight: bold; margin-top: 20px;">
          Visit IndiaPodcasts
        </a>
      </div>
      <div style="background: #0D0D0D; padding: 20px; text-align: center;">
        <p style="color: #4B5563; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} IndiaPodcasts. All rights reserved.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "We received your message — IndiaPodcasts",
    html,
    text: `Hi ${name}, thank you for contacting IndiaPodcasts. We'll get back to you within 24-48 hours.`,
  });
};

export const sendNewsletterConfirmation = async (email) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0D0D0D; padding: 30px; text-align: center;">
        <h1 style="color: #F5C518; margin: 0;">IndiaPodcasts</h1>
        <p style="color: #9CA3AF; margin: 5px 0 0;">"We Hear What You Want To Say"</p>
      </div>
      <div style="background: #1A1A1A; padding: 30px; text-align: center;">
        <h2 style="color: #FFFFFF;">You're subscribed! 🎉</h2>
        <p style="color: #9CA3AF; line-height: 1.6;">
          Welcome to the IndiaPodcasts family! You'll now receive updates on
          our latest episodes, videos, and blog posts directly in your inbox.
        </p>
        <a href="https://indiapodcasts.in"
          style="display: inline-block; background: #F5C518; color: #0D0D0D;
          padding: 12px 24px; border-radius: 50px; text-decoration: none;
          font-weight: bold; margin-top: 20px;">
          Start Listening
        </a>
      </div>
      <div style="background: #0D0D0D; padding: 20px; text-align: center;">
        <p style="color: #4B5563; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} IndiaPodcasts. All rights reserved.<br/>
          <a href="https://indiapodcasts.in/unsubscribe"
            style="color: #F5C518;">Unsubscribe</a>
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Welcome to IndiaPodcasts Newsletter! 🎙️",
    html,
    text: `Welcome to IndiaPodcasts! You're now subscribed to our newsletter.`,
  });
};

export const sendGuestPitchConfirmation = async (name, email) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0D0D0D; padding: 30px; text-align: center;">
        <h1 style="color: #F5C518; margin: 0;">IndiaPodcasts</h1>
        <p style="color: #9CA3AF; margin: 5px 0 0;">"We Hear What You Want To Say"</p>
      </div>
      <div style="background: #1A1A1A; padding: 30px;">
        <h2 style="color: #FFFFFF;">Hi ${name},</h2>
        <p style="color: #9CA3AF; line-height: 1.6;">
          Thank you for pitching to be a guest on IndiaPodcasts! We have
          received your submission and our team will review it carefully.
        </p>
        <p style="color: #9CA3AF; line-height: 1.6;">
          We receive many pitches and aim to respond within 5-7 business days.
          If your profile is a good fit, we will reach out to schedule a
          recording session.
        </p>
        <div style="background: #0D0D0D; border-left: 3px solid #F5C518;
          padding: 15px; margin: 20px 0; border-radius: 5px;">
          <p style="color: #F5C518; margin: 0; font-weight: bold;">
            What happens next?
          </p>
          <p style="color: #9CA3AF; margin: 8px 0 0; font-size: 14px;">
            Our team will review your pitch → We'll contact you if it's a match
            → We'll schedule a recording → Your episode goes live!
          </p>
        </div>
        <a href="https://indiapodcasts.in"
          style="display: inline-block; background: #F5C518; color: #0D0D0D;
          padding: 12px 24px; border-radius: 50px; text-decoration: none;
          font-weight: bold; margin-top: 10px;">
          Explore IndiaPodcasts
        </a>
      </div>
      <div style="background: #0D0D0D; padding: 20px; text-align: center;">
        <p style="color: #4B5563; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} IndiaPodcasts. All rights reserved.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "We received your guest pitch — IndiaPodcasts 🎙️",
    html,
    text: `Hi ${name}, we received your guest pitch! We'll review and respond within 5-7 business days.`,
  });
};