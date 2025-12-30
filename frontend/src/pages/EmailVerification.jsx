import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ThemeLayout from '../layout/ThemeLayout.jsx';
import { sendVerificationEmail } from '../services/emailService.js';

export default function EmailVerification() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    // Auto-verify the email when page loads
    handleVerifyEmail();
  }, [token]);

  const handleVerifyEmail = async () => {
    try {
      const response = await fetch(`https://donateus-production.up.railway.app/api/users/verify/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage('Email verified successfully! You can now login to your account.');
        if (data.userEmail) {
          setUserEmail(data.userEmail);
          
          // Send confirmation email that verification was successful
          await sendConfirmationEmail(data.userEmail);
        }
      } else {
        setStatus('error');
        setMessage(data.message || 'Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('Verification failed. Please try again.');
    }
  };

  const sendConfirmationEmail = async (email) => {
    try {
      const formData = {
        name: 'DonationZakat System',
        email: email,
        subject: 'Email Verified Successfully - DonationZakat System',
        message: `
          <h2>Email Verification Successful!</h2>
          <p>Congratulations! Your email address has been successfully verified.</p>
          <p>You can now log in to your DonationZakat System account and start making donations.</p>
          <p><a href="${window.location.origin}/login" style="background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login to Your Account</a></p>
          <p>Thank you for joining our community of compassionate donors!</p>
          <br>
          <p>Best regards,<br>DonationZakat System Team</p>
        `
      };
      
      const response = await fetch('https://formsubmit.co/ajax/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        console.log('Confirmation email sent successfully to:', email);
      } else {
        console.error('Failed to send confirmation email');
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  };

  return (
    <ThemeLayout className="px-4 py-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center min-h-[60vh]">
          <Card className="w-full p-8 border border-white/10 bg-slate-900/50 backdrop-blur-sm shadow-xl">
            <div className="text-center">
              {/* Status Icons */}
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
                {status === 'loading' && (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                )}
                {status === 'success' && (
                  <div className="w-full h-full rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                {status === 'error' && (
                  <div className="w-full h-full rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Status Messages */}
              <h1 className="text-2xl font-bold text-white mb-2">
                {status === 'loading' && 'Loading Verification...'}
                {status === 'success' && message.includes('verified') ? 'Email Verified!' : 'Email Verification'}
                {status === 'error' && 'Verification Failed'}
              </h1>

              <p className="text-slate-300 mb-6">
                {message}
              </p>

              {/* Show verification token for manual verification */}
              {status === 'success' && !message.includes('verified') && (
                <div className="mb-6 p-4 rounded-lg bg-slate-800 border border-white/10">
                  <p className="text-xs text-slate-400 mb-2">Verification Token:</p>
                  <code className="text-emerald-400 text-sm break-all">{token}</code>
                  <p className="text-xs text-slate-400 mt-2">
                    Copy this token and click "Verify Email" below
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {status === 'success' && message.includes('verified') && (
                  <Button 
                    onClick={() => navigate('/login')}
                    className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold"
                  >
                    Go to Login
                  </Button>
                )}

                {status === 'success' && !message.includes('verified') && (
                  <Button 
                    onClick={handleManualVerify}
                    className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold"
                  >
                    Verify Email
                  </Button>
                )}

                {status === 'error' && (
                  <Button 
                    onClick={() => navigate('/login')}
                    variant="outline"
                    className="w-full border border-white/20 text-white hover:bg-white/10"
                  >
                    Back to Login
                  </Button>
                )}
              </div>

              {/* Help Text */}
              {status === 'success' && !message.includes('verified') && (
                <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs text-amber-300">
                    <strong>Manual Verification:</strong> Since email verification is complex, click "Verify Email" to manually verify your account.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </ThemeLayout>
  );
}

