import React from 'react';

const ProfileAvatar = ({ user, name, picture, size = 'md', className = '' }) => {
  // Extract name and picture from user object if provided
  const userName = user?.name || name || 'User';
  const userPicture = user?.picture || picture;
  
  // Debug: Log props
  console.log('ProfileAvatar - user:', user);
  console.log('ProfileAvatar - userName:', userName);
  console.log('ProfileAvatar - userPicture:', userPicture);
  console.log('ProfileAvatar - size:', size);

  // Get initials from name (max 2 letters)
  const getInitials = (name) => {
    if (!name || name === 'User') return 'U';
    
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
    } else {
      return name.substring(0, 2).toUpperCase();
    }
  };

  // Size configurations
  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-20 w-20 text-2xl'
  };

  const avatarSize = sizes[size] || sizes.md;

  // If there's a picture, show it, otherwise show initials
  if (userPicture) {
    return (
      <div className={`relative inline-flex items-center justify-center rounded-full overflow-hidden ${avatarSize} ${className}`}>
        <img 
          src={userPicture} 
          alt={userName} 
          className="h-full w-full object-cover"
          onError={(e) => {
            console.log('Image failed to load, showing initials');
            e.target.style.display = 'none';
            const parent = e.target.parentElement;
            parent.classList.add('bg-gradient-to-br', 'from-emerald-500', 'to-sky-500');
            parent.innerHTML = `<span class="text-white font-semibold">${getInitials(userName)}</span>`;
          }}
        />
      </div>
    );
  }

  // Generate consistent background color based on name
  const getColorClasses = (name) => {
    const colors = [
      'from-emerald-500 to-sky-500',
      'from-purple-500 to-pink-500',
      'from-blue-500 to-indigo-500',
      'from-orange-500 to-red-500',
      'from-teal-500 to-green-500',
      'from-yellow-500 to-orange-500',
      'from-rose-500 to-pink-500',
      'from-indigo-500 to-purple-500',
      'from-cyan-500 to-blue-500',
      'from-amber-500 to-yellow-500'
    ];
    
    let hash = 0;
    const safeName = name || 'User';
    for (let i = 0; i < safeName.length; i++) {
      hash = safeName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  return (
    <div className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-br ${getColorClasses(userName)} ${avatarSize} ${className}`}>
      <span className="text-white font-semibold">
        {getInitials(userName)}
      </span>
    </div>
  );
};

export default ProfileAvatar;
