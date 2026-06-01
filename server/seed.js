import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const users = [
  {
    firstName: 'System',
    lastName: 'Admin',
    email: 'admin@admin.com',
    password: 'admin123',
    phone: '+1 (555) 010-0001',
    role: 'Admin',
    department: 'Management',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=admin',
    status: 'Active'
  },
  {
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'manager.eng@admin.com',
    password: 'manager123',
    phone: '+1 (555) 010-0002',
    role: 'Manager',
    department: 'Engineering',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=sarah',
    status: 'Active'
  },
  {
    firstName: 'Robert',
    lastName: 'Ford',
    email: 'manager.hr@admin.com',
    password: 'manager123',
    phone: '+1 (555) 010-0003',
    role: 'Manager',
    department: 'HR',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=robert',
    status: 'Active'
  },
  {
    firstName: 'Clarissa',
    lastName: 'Vance',
    email: 'manager.sales@admin.com',
    password: 'manager123',
    phone: '+1 (555) 010-0020',
    role: 'Manager',
    department: 'Sales',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=clarissa',
    status: 'Active'
  },
  {
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@admin.com',
    password: 'user123',
    phone: '+1 (555) 010-0004',
    role: 'User',
    department: 'Engineering',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=alice',
    status: 'Active'
  },
  {
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob@admin.com',
    password: 'user123',
    phone: '+1 (555) 010-0005',
    role: 'User',
    department: 'Engineering',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=bob',
    status: 'Active'
  },
  {
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie@admin.com',
    password: 'user123',
    phone: '+1 (555) 010-0006',
    role: 'User',
    department: 'HR',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=charlie',
    status: 'Active'
  },
  {
    firstName: 'Diana',
    lastName: 'Prince',
    email: 'diana@admin.com',
    password: 'user123',
    phone: '+1 (555) 010-0007',
    role: 'User',
    department: 'Sales',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=diana',
    status: 'Active'
  },
  {
    firstName: 'Evan',
    lastName: 'Wright',
    email: 'evan@admin.com',
    password: 'user123',
    phone: '+1 (555) 010-0008',
    role: 'User',
    department: 'Marketing',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=evan',
    status: 'Active'
  },
  {
    firstName: 'Fiona',
    lastName: 'Gallagher',
    email: 'fiona@admin.com',
    password: 'user123',
    phone: '+1 (555) 010-0009',
    role: 'User',
    department: 'Support',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=fiona',
    status: 'Active'
  },
  {
    firstName: 'George',
    lastName: 'Costanza',
    email: 'george@admin.com',
    password: 'user123',
    phone: '+1 (555) 010-0010',
    role: 'User',
    department: 'Finance',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=george',
    status: 'Inactive'
  },
  {
    firstName: 'Hannah',
    lastName: 'Abbott',
    email: 'hannah@admin.com',
    password: 'user123',
    phone: '+1 (555) 010-0011',
    role: 'User',
    department: 'Marketing',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=hannah',
    status: 'Active'
  },
  {
    firstName: 'Ian',
    lastName: 'Malcolm',
    email: 'ian@admin.com',
    password: 'user123',
    phone: '+1 (555) 010-0012',
    role: 'User',
    department: 'Design',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ian',
    status: 'Active'
  },
  {
    firstName: 'Julia',
    lastName: 'Roberts',
    email: 'julia@admin.com',
    password: 'user123',
    phone: '+1 (555) 010-0013',
    role: 'User',
    department: 'Design',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=julia',
    status: 'Active'
  },
  {
    firstName: 'Kevin',
    lastName: 'Mitnick',
    email: 'kevin@admin.com',
    password: 'user123',
    phone: '+1 (555) 010-0014',
    role: 'User',
    department: 'QA',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=kevin',
    status: 'Active'
  },
  {
    firstName: 'Laura',
    lastName: 'Croft',
    email: 'laura@admin.com',
    password: 'user123',
    phone: '+1 (555) 010-0015',
    role: 'User',
    department: 'QA',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=laura',
    status: 'Inactive'
  },
  {
    firstName: 'Michael',
    lastName: 'Scott',
    email: 'michael@admin.com',
    password: 'user123',
    phone: '+1 (555) 010-0016',
    role: 'User',
    department: 'Sales',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=michael',
    status: 'Active'
  },
  {
    firstName: 'Nina',
    lastName: 'Simone',
    email: 'nina@admin.com',
    password: 'user123',
    phone: '+1 (555) 010-0017',
    role: 'User',
    department: 'Support',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=nina',
    status: 'Active'
  },
  {
    firstName: 'Oscar',
    lastName: 'Martinez',
    email: 'oscar@admin.com',
    password: 'user123',
    phone: '+1 (555) 010-0018',
    role: 'User',
    department: 'Finance',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=oscar',
    status: 'Active'
  },
  {
    firstName: 'Pam',
    lastName: 'Beesly',
    email: 'pam@admin.com',
    password: 'user123',
    phone: '+1 (555) 010-0019',
    role: 'User',
    department: 'Design',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=pam',
    status: 'Active'
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/usermanagement';
    console.log(`Seeding database at ${mongoUri}...`);
    
    await mongoose.connect(mongoUri);
    
    // Clear existing users
    await User.deleteMany();
    console.log('Cleared existing users.');

    // Insert new users
    for (const u of users) {
      await User.create(u);
    }
    
    console.log(`Successfully seeded ${users.length} users.`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDB();
