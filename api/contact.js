/**
 * Vercel Serverless Function for Secure Contact Form Submission
 * Endpoint: /api/contact
 *
 * Designed for static sites hosted on Vercel:
 * - Sanitizes and validates input on the backend
 * - Prevents spam via honeypot filtering
 * - Supports Resend API (via RESEND_API_KEY env var)
 * - Seamlessly falls back to secure server-to-server FormSubmit delivery
 * - NEVER exposes API keys or secrets to the client browser
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed. Only POST requests are accepted.'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { name, email, message, _honey } = body;

    // Honeypot spam trap: if filled by a bot, silently succeed without sending
    if (_honey) {
      return res.status(200).json({
        success: true,
        message: "Thanks for reaching out! Your message has been sent successfully. I'll get back to you soon."
      });
    }

    // Required fields validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your name.' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your email address.' });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter a message.' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const cleanName = name.trim().slice(0, 100);
    const cleanEmail = email.trim().slice(0, 120);
    const cleanMessage = message.trim().slice(0, 5000);
    const receivingEmail = process.env.RECEIVING_EMAIL || 'vidyutha09@gmail.com';

    // Option A: If RESEND_API_KEY environment variable is configured in Vercel
    if (process.env.RESEND_API_KEY) {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: receivingEmail,
          reply_to: cleanEmail,
          subject: `Portfolio Inquiry from ${cleanName}`,
          text: `Name: ${cleanName}\nEmail: ${cleanEmail}\n\nMessage:\n${cleanMessage}`
        })
      });

      if (resendRes.ok) {
        return res.status(200).json({
          success: true,
          message: "Thanks for reaching out! Your message has been sent successfully. I'll get back to you soon."
        });
      }
    }

    // Option B: Server-to-server forwarder via FormSubmit
    const forwardResponse = await fetch(`https://formsubmit.co/ajax/${receivingEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Referer': req.headers.referer || 'https://vercel.app'
      },
      body: JSON.stringify({
        name: cleanName,
        email: cleanEmail,
        message: cleanMessage,
        _subject: `New Portfolio Message from ${cleanName}`
      })
    });

    const forwardData = await forwardResponse.json().catch(() => ({}));

    return res.status(200).json({
      success: true,
      message: "Thanks for reaching out! Your message has been sent successfully. I'll get back to you soon.",
      data: forwardData
    });

  } catch (error) {
    console.error('Contact handler error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process message submission. Please try again later.'
    });
  }
}
