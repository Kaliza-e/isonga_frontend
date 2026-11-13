import { ResidentUser, Announcement, NotificationItem } from '../types';

export interface SeededAccount {
  id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  role: 'SUPER_ADMIN' | 'CELL_ADMIN' | 'RESIDENT';
  label: string;
  subLabel: string;
  description: string;
  user: ResidentUser;
}

export const SEEDED_ACCOUNTS: {
  ADMIN: SeededAccount;
  RESIDENT: SeededAccount;
} = {
  ADMIN: {
    id: 'seed-admin-kaliza',
    name: 'Esther Kaliza',
    phone: '+250788999888',
    email: 'kalizaesther5@gmail.com',
    password: 'Password123!',
    role: 'SUPER_ADMIN',
    label: 'Local Administrator (Chief)',
    subLabel: 'Umukuru w\'Umudugudu / Akagari Leader',
    description: 'Full authority to create, schedule, and broadcast announcements and emergency alerts.',
    user: {
      id: 'admin-kaliza-01',
      name: 'Esther Kaliza',
      phone: '+250788999888',
      email: 'kalizaesther5@gmail.com',
      role: 'SUPER_ADMIN',
      title: 'Local Administrator & Village Chief',
      primaryAreaId: 'gasabo-kimironko-cell',
      primaryAreaName: 'Kimironko Cell',
      district: 'Gasabo District',
      sector: 'Kimironko Sector',
      cell: 'Kimironko Cell',
      village: 'Rebero Village',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
      language: 'rw',
      consentLaw058: true,
    },
  },
  RESIDENT: {
    id: 'seed-resident-mugisha',
    name: 'Jean-Luc Mugisha',
    phone: '+250788123456',
    email: 'jeanluc.mugisha@isonga.rw',
    password: 'Password123!',
    role: 'RESIDENT',
    label: 'Community Resident',
    subLabel: 'Rebero Village Citizen',
    description: 'Verified resident receiving community announcements, SMS, and Umuganda notices.',
    user: {
      id: 'resident-mugisha-01',
      name: 'Jean-Luc Mugisha',
      phone: '+250788123456',
      email: 'jeanluc.mugisha@isonga.rw',
      role: 'RESIDENT',
      title: 'Verified Community Resident',
      primaryAreaId: 'gasabo-kimironko-rebero',
      primaryAreaName: 'Rebero Village',
      district: 'Gasabo District',
      sector: 'Kimironko Sector',
      cell: 'Kimironko Cell',
      village: 'Rebero Village',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      language: 'rw',
      consentLaw058: true,
    },
  },
};

export const SEEDED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-seed-01',
    title: 'Umuganda Rusange: Drainage Clearing & Tree Planting',
    content:
      'All residents of Kimironko Cell and Rebero Village are requested to gather at 07:00 AM this Saturday at the main road junction. We will focus on clearing storm water drainage culverts and planting anti-erosion trees before the rainy season. Please bring proper tools (hoes, shovels, gloves). The community meeting (Inama y\'Abaturage) will commence immediately afterwards at 10:30 AM.',
    category: 'UMUGANDA',
    priority: 'HIGH',
    status: 'PUBLISHED',
    targetAreaName: 'Kimironko Cell, Gasabo',
    authorName: 'Esther Kaliza (Umukuru w\'Umudugudu)',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80',
  },
  {
    id: 'ann-seed-02',
    title: 'Community Health Drive: Routine Vaccinations & Nutrition Screening',
    content:
      'Kimironko Health Centre in collaboration with community health workers (Abajyanama b\'Ubuzima) is organizing free immunization and child growth monitoring sessions at the cell office from Monday to Wednesday (08:00 AM - 03:00 PM). Parents with children under 5 years are warmly encouraged to bring vaccination cards.',
    category: 'HEALTH_INFORMATION',
    priority: 'NORMAL',
    status: 'PUBLISHED',
    targetAreaName: 'Kimironko Sector',
    authorName: 'Kimironko Health Centre Liaison',
    publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80',
  },
  {
    id: 'ann-seed-03',
    title: 'WASAC Notice: Scheduled Water Infrastructure Maintenance',
    content:
      'Water and Sanitation Corporation (WASAC) informs residents in Kimironko, Bibare, and Kibagabaga zones that scheduled pipe modernization will take place on Thursday between 08:30 AM and 04:30 PM. Water supply will be temporarily paused. Residents are kindly advised to store sufficient water in advance.',
    category: 'PUBLIC_SERVICES',
    priority: 'NORMAL',
    status: 'PUBLISHED',
    targetAreaName: 'Gasabo District',
    authorName: 'WASAC Gasabo Regional Office',
    publishedAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
  },
  {
    id: 'ann-seed-04',
    title: 'Inama y\'Abaturage: Neighborhood Security & Cleanliness Review',
    content:
      'The Village Executive Committee invites all household representatives in Rebero Village to the monthly village assembly on Sunday at 03:00 PM at the village community center. Agenda: Night patrols (Irondo), proper waste management, and welcoming new residents.',
    category: 'COMMUNITY_MEETINGS',
    priority: 'NORMAL',
    status: 'PUBLISHED',
    targetAreaName: 'Rebero Village',
    authorName: 'Esther Kaliza (Umukuru w\'Umudugudu)',
    publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&q=80',
  },
  {
    id: 'ann-seed-05',
    title: 'Weather Warning: Heavy Rainfall & Low-Lying Drainage Advisory',
    content:
      'Meteo Rwanda forecasts intense thunderstorms across Kigali City and Northern Province tonight. Residents living along drainage slopes are urged to secure property, keep children away from swift water ravines, and report any blockages to emergency dispatch (Dial 112).',
    category: 'EMERGENCY_PUBLIC_INFORMATION',
    priority: 'EMERGENCY',
    status: 'PUBLISHED',
    targetAreaName: 'City of Kigali',
    authorName: 'Ministry in Charge of Emergency Management (MINEMA)',
    publishedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&q=80',
  },
];

export const SEEDED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-seed-01',
    title: 'Umuganda Rusange this Saturday',
    content: 'Gathering at 07:00 AM at the Kimironko main intersection. Bring tools for drainage clearing.',
    timeAgo: '2 hours ago',
    channel: 'SMS',
    status: 'DELIVERED',
    category: 'UMUGANDA',
  },
  {
    id: 'notif-seed-02',
    title: 'Childhood Vaccination Clinic Open',
    content: 'Free routine vaccines available Monday to Wednesday at Kimironko Health Centre.',
    timeAgo: '14 hours ago',
    channel: 'PUSH',
    status: 'DELIVERED',
    category: 'HEALTH_INFORMATION',
  },
  {
    id: 'notif-seed-03',
    title: 'Water Service Maintenance Notice',
    content: 'WASAC scheduled maintenance Thursday 08:30 AM to 04:30 PM. Please store water.',
    timeAgo: '1 day ago',
    channel: 'SMS',
    status: 'DELIVERED',
    category: 'PUBLIC_SERVICES',
  },
  {
    id: 'notif-seed-04',
    title: 'Civic Data Privacy Confirmed',
    content: 'Your resident profile is registered and verified under Rwanda Data Protection Law N° 058/2021.',
    timeAgo: '3 days ago',
    channel: 'IN_APP',
    status: 'DELIVERED',
    category: 'ADMINISTRATIVE_NOTICES',
  },
];
