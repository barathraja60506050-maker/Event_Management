const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const { ROLES } = require('../config/constants');

dotenv.config();

const adminName = process.env.ADMIN_NAME || 'Admin User';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin1234';

async function seedAdmin() {
  await connectDB();

  const existing = await User.findOne({ email: adminEmail }).select('+password');

  if (existing) {
    existing.name = adminName;
    existing.role = ROLES.ADMIN;
    existing.password = adminPassword;
    existing.isActive = true;
    await existing.save();
    console.log(`Updated existing admin account: ${adminEmail}`);
  } else {
    await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: ROLES.ADMIN,
      isActive: true,
    });
    console.log(`Created new admin account: ${adminEmail}`);
  }

  console.log('Admin seed complete.');
  process.exit(0);
}

seedAdmin().catch((error) => {
  console.error('Admin seed failed:', error);
  process.exit(1);
});
