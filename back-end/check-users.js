const mongoose = require('mongoose');
const User = require('./models/user.js');

mongoose.connect('mongodb://localhost:27017/donation-system')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Check for deleted users
    const deletedUsers = await User.find({ isDeleted: true });
    console.log('Deleted users count:', deletedUsers.length);
    deletedUsers.forEach(user => {
      console.log('Deleted user:', user.email, 'deletedAt:', user.deletedAt);
    });
    
    // Check for active users
    const activeUsers = await User.find({ isDeleted: { $ne: true } });
    console.log('Active users count:', activeUsers.length);
    activeUsers.forEach(user => {
      console.log('Active user:', user.email, 'isDeleted:', user.isDeleted);
    });
    
    await mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
  });
