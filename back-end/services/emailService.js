// Email service - handled in frontend for security
export const sendVerificationEmail = async (userEmail, verificationToken) => {
  // Backend just logs the token - actual email sent from frontend
  console.log('Verification token generated for:', userEmail);
  console.log('Token:', verificationToken);
  return true;
};

export const sendPasswordResetEmail = async (userEmail, resetToken) => {
  // Backend just logs the token - actual email sent from frontend
  console.log('Password reset token generated for:', userEmail);
  console.log('Token:', resetToken);
  return true;
};
