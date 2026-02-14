import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '@/models/User';
import { Organization } from '@/models/Organization';
import { OrgMembership } from '@/models/OrgMembership';
import { Project } from '@/models/Project';
import { ProjectMembership } from '@/models/ProjectMembership';
import { Ticket } from '@/models/Ticket';
import { TicketComment } from '@/models/TicketComment';
import { hashPassword } from '@/utils/password';
import { log } from '@/config/logger';

dotenv.config();

async function seed() {
  try {
    // Connect to database
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error('MONGODB_URI not configured');

    await mongoose.connect(mongoUri);
    log.info('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Organization.deleteMany({});
    await OrgMembership.deleteMany({});
    await Project.deleteMany({});
    await ProjectMembership.deleteMany({});
    await Ticket.deleteMany({});
    await TicketComment.deleteMany({});
    log.info('Cleared existing data');

    // Create demo users
    const hashedPassword = await hashPassword('password123');
    const user1 = await User.create({
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: hashedPassword,
    });

    const user2 = await User.create({
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: hashedPassword,
    });

    const user3 = await User.create({
      name: 'Carol White',
      email: 'carol@example.com',
      password: hashedPassword,
    });

    log.info('Created 3 demo users');

    // Create demo organization
    const org = await Organization.create({
      name: 'Acme Corporation',
      description: 'A sample organization for demo purposes',
      ownerId: user1._id,
    });

    log.info('Created demo organization');

    // Add org members
    await OrgMembership.create({
      orgId: org._id,
      userId: user1._id,
      role: 'org_owner',
    });

    await OrgMembership.create({
      orgId: org._id,
      userId: user2._id,
      role: 'org_admin',
    });

    await OrgMembership.create({
      orgId: org._id,
      userId: user3._id,
      role: 'org_member',
    });

    log.info('Added org members');

    // Create demo project
    const project = await Project.create({
      orgId: org._id,
      name: 'Frontend Application',
      key: 'FRONT',
      description: 'Main frontend application project',
    });

    log.info('Created demo project');

    // Add project members
    await ProjectMembership.create({
      projectId: project._id,
      userId: user1._id,
      role: 'owner',
    });

    await ProjectMembership.create({
      projectId: project._id,
      userId: user2._id,
      role: 'admin',
    });

    await ProjectMembership.create({
      projectId: project._id,
      userId: user3._id,
      role: 'developer',
    });

    log.info('Added project members');

    // Create demo tickets
    const ticketTitles = [
      'Login button not working',
      'Implement dark mode',
      'Add user profile page',
      'Fix navigation menu responsive design',
      'Create API documentation',
      'Add email notifications',
      'Optimize image loading',
      'Create admin dashboard',
      'Add two-factor authentication',
      'Write unit tests',
    ];

    const priorities = ['low', 'medium', 'high', 'critical'];
    const statuses = ['open', 'in_progress', 'blocked', 'done'];
    const types = ['bug', 'task', 'feature'];

    for (let i = 0; i < ticketTitles.length; i++) {
      const ticket = await Ticket.create({
        orgId: org._id,
        projectId: project._id,
        title: ticketTitles[i],
        description: `This is a detailed description for ${ticketTitles[i]}. This ticket needs attention and should be worked on as soon as possible.`,
        type: types[i % types.length],
        status: statuses[i % statuses.length],
        priority: priorities[i % priorities.length],
        reporterId: user1._id,
        assigneeId: i % 3 === 0 ? user2._id : user3._id,
        tags: ['frontend', 'ui'],
      });

      // Add some comments
      if (i % 2 === 0) {
        await TicketComment.create({
          ticketId: ticket._id,
          authorId: user2._id,
          body: 'This is a critical issue that needs to be fixed ASAP.',
          mentions: [],
        });

        await TicketComment.create({
          ticketId: ticket._id,
          authorId: user3._id,
          body: 'I will start working on this ticket next.',
          mentions: [],
        });
      }
    }

    log.info('Created 10 demo tickets with comments');

    log.info('✓ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    log.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
