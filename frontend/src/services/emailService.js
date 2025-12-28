// Secure email service using FormSubmit
const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/submit';

// Vite environment variables
const getFormSubmitEmail = () => {
  // Use import.meta.env for Vite
  const email = import.meta.env.VITE_FORMSUBMIT_EMAIL || 'ra920453@gmail.com';
  console.log('FormSubmit email configured:', email);
  return email;
};

export const sendVerificationEmail = async (userEmail, verificationToken) => {
  try {
    const verificationUrl = `${window.location.origin}/verify/${verificationToken}`;
    
    // FormSubmit sends TO the email specified in the URL
    const response = await fetch(`https://formsubmit.co/ajax/${userEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: 'DonateUS',
        email: 'ra920453@gmail.com', // Your email as sender
        subject: 'Verify Your Email - DonateUS',
        message: `
          <h2>Email Verification</h2>
          <p>Thank you for signing up for DonateUS!</p>
          <p>Please click the link below to verify your email address:</p>
          <p><a href="${verificationUrl}" style="background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
          <p>Or copy and paste this link in your browser:</p>
          <p>${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, please ignore this email.</p>
          <br>
          <p>Best regards,<br>DonateUS Team</p>
        `
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('Verification email sent successfully to:', userEmail);
      return true;
    } else {
      console.error('Failed to send verification email:', result);
      return false;
    }
    
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

export const sendPasswordResetEmail = async (userEmail, resetToken) => {
  try {
    const resetUrl = `${window.location.origin}/reset-password/${resetToken}`;
    
    // FormSubmit sends TO the email specified in the URL
    const response = await fetch(`https://formsubmit.co/ajax/${userEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: 'DonateUS',
        email: 'ra920453@gmail.com', // Your email as sender
        subject: 'Reset Your Password - DonateUS',
        message: `Password Reset

You requested to reset your password for your DonateUS account.

Please click the link below to reset your password:
${resetUrl}

Or copy and paste this link in your browser:
${resetUrl}

This link will expire in 1 hour.

If you didn't request a password reset, please ignore this email.

Best regards,
DonateUS Team`
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('Password reset email sent successfully to:', userEmail);
      return true;
    } else {
      console.error('Failed to send password reset email:', result);
      return false;
    }
    
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};
