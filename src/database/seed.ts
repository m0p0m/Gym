import mongoose from 'mongoose';
import config from '../config';
import Permission, { IPermission } from '../models/permission.model';
import Role from '../models/role.model';
import User from '../models/user.model';

const permissions = [
  // User Management
  { name: 'users:create', description: 'Create a new user' },
  { name: 'users:read', description: 'Read user information' },
  { name: 'users:update', description: 'Update user information' },
  { name: 'users:delete', description: 'Delete a user' },

  // Role & Permission Management
  { name: 'roles:create', description: 'Create a new role' },
  { name: 'roles:read', description: 'Read role information' },
  { name: 'roles:update', description: 'Update role information' },
  { name: 'roles:delete', description: 'Delete a role' },
  { name: 'permissions:read', description: 'Read available permissions' },

  // Member-specific
  { name: 'profile:read_own', description: 'Read own user profile' },
  { name: 'profile:update_own', description: 'Update own user profile' },
  { name: 'subscription:read_own', description: 'Read own subscription status' },
  { name: 'workouts:read_own', description: 'Read own workout plans' },
  { name: 'workouts:update_own', description: 'Update own workout tasks (e.g., mark as done)' },
  { name: 'diets:read_own', description: 'Read own diet plans' },
  { name: 'diets:update_own', description: 'Update own diet tasks (e.g., mark as done)' },

  // Trainer/Admin specific
  { name: 'workouts:create', description: 'Create workout plans' },
  { name: 'workouts:assign', description: 'Assign workouts to users' },
  { name: 'diets:create', description: 'Create diet plans' },
  { name: 'diets:assign', description: 'Assign diets to users' },
  { name: 'subscriptions:update', description: 'Update user subscriptions' },
];

const seedDatabase = async () => {
  console.log('Connecting to database...');
  await mongoose.connect(config.databaseUrl);
  console.log('Database connected. Starting to seed...');

  // Clear existing data
  await Permission.deleteMany({});
  await Role.deleteMany({});
  console.log('Cleared existing permissions and roles.');

  // Insert permissions
  const insertedPermissions = await Permission.insertMany(permissions);
  const permissionMap = new Map(insertedPermissions.map((p: IPermission) => [p.name, p._id]));
  console.log('Inserted permissions.');

  // Create Roles
  const userPermissions = [
    'profile:read_own', 'profile:update_own', 'subscription:read_own',
    'workouts:read_own', 'workouts:update_own', 'diets:read_own', 'diets:update_own'
  ].map(name => permissionMap.get(name));

  const adminPermissions = [
    ...userPermissions,
    ...[
      'users:create', 'users:read', 'users:update',
      'workouts:create', 'workouts:assign',
      'diets:create', 'diets:assign',
      'subscriptions:update'
    ].map(name => permissionMap.get(name))
  ];

  await Role.create([
    {
      name: 'User',
      description: 'Standard gym member with access to their own data.',
      permissions: userPermissions,
    },
    {
      name: 'Admin',
      description: 'Gym staff with permissions to manage members and their plans.',
      permissions: adminPermissions,
    },
    {
      name: 'Super Admin',
      description: 'System administrator with access to all features.',
      permissions: insertedPermissions.map((p: IPermission) => p._id), // All permissions
    },
  ]);
  console.log('Inserted roles.');

  // Optional: Create a default Super Admin user
  const superAdminPhoneNumber = '09123456789';
  const existingUser = await User.findOne({ phoneNumber: superAdminPhoneNumber });
  if (existingUser) {
    await User.deleteOne({ phoneNumber: superAdminPhoneNumber });
  }
  const superAdminRole = await Role.findOne({ name: 'Super Admin' });
  if (superAdminRole) {
    await User.create({
      firstName: 'Super',
      lastName: 'Admin',
      phoneNumber: superAdminPhoneNumber,
      role: superAdminRole._id,
    });
    console.log('Created default Super Admin user.');
  }

  console.log('Database seeding completed successfully!');
  await mongoose.disconnect();
  console.log('Database connection closed.');
};

seedDatabase().catch(error => {
  console.error('Error seeding database:', error);
  mongoose.disconnect();
  process.exit(1);
});
