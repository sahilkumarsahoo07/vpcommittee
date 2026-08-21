import { Router } from 'express';
import { login, getMe } from '../controllers/authController';
import {
  getFinancialSummary,
  getDonations,
  createDonation,
  createPublicDonation,
  updateDonation,
  deleteDonation,
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getBudget,
  updateBudget,
  deleteBudget,
  exportFinancialPDF,
  exportDonorPDF,
  exportDonationsExcel,
} from '../controllers/financeController';
import {
  getSettings,
  updateSettings,
  resetSettings,
  getInstagramFeed,
  getMembers,
  createMember,
  updateMember,
  deleteMember,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getVolunteers,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
  getSubscribers,
  createSubscriber,
  deleteSubscriber,
  getAuditLogs,
} from '../controllers/contentController';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  forgotPassword,
  resetPassword,
} from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';

const router = Router();

// AUTH ROUTES
router.post('/auth/login', login);
router.get('/auth/me', authenticateToken, getMe);
router.post('/auth/change-password', authenticateToken, changePassword);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);

// USER & ACCOUNT MANAGEMENT (SUPERADMIN & ADMIN)
router.get('/users', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), getUsers);
router.post('/users', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), createUser);
router.put('/users/:id', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), updateUser);
router.delete('/users/:id', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), deleteUser);

// PUBLIC WEBSITE CONTENT & FORM SUBMISSION ROUTES
router.get('/settings', getSettings);
router.get('/instagram/feed', getInstagramFeed);
router.get('/members', getMembers);
router.get('/events', getEvents);
router.get('/announcements', getAnnouncements);
router.get('/gallery', getGallery);
router.post('/volunteers', createVolunteer);
router.post('/subscribers', createSubscriber);
router.post('/donations/public', createPublicDonation);

// PROTECTED CONTENT ROUTES (SUPERADMIN, ADMIN, COMMITTEE_MEMBER)
router.put('/settings', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), updateSettings);
router.delete('/settings', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), resetSettings);

router.post('/members', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN', 'COMMITTEE_MEMBER'), createMember);
router.put('/members/:id', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN', 'COMMITTEE_MEMBER'), updateMember);
router.delete('/members/:id', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), deleteMember);

router.post('/events', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN', 'COMMITTEE_MEMBER'), createEvent);
router.put('/events/:id', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN', 'COMMITTEE_MEMBER'), updateEvent);
router.delete('/events/:id', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), deleteEvent);

router.post('/announcements', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN', 'COMMITTEE_MEMBER'), createAnnouncement);
router.put('/announcements/:id', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN', 'COMMITTEE_MEMBER'), updateAnnouncement);
router.delete('/announcements/:id', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), deleteAnnouncement);

router.post('/gallery', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN', 'COMMITTEE_MEMBER'), createGalleryItem);
router.put('/gallery/:id', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN', 'COMMITTEE_MEMBER'), updateGalleryItem);
router.delete('/gallery/:id', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), deleteGalleryItem);

router.get('/volunteers', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN', 'COMMITTEE_MEMBER'), getVolunteers);
router.put('/volunteers/:id', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN', 'COMMITTEE_MEMBER'), updateVolunteer);
router.delete('/volunteers/:id', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), deleteVolunteer);

router.get('/subscribers', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), getSubscribers);
router.delete('/subscribers/:id', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), deleteSubscriber);

// PROTECTED FINANCE & REPORTING ROUTES (SUPERADMIN & ADMIN ONLY)
router.get('/finance/summary', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), getFinancialSummary);

router.get('/donations', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), getDonations);
router.post('/donations', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), createDonation);
router.put('/donations/:id', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), updateDonation);
router.delete('/donations/:id', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), deleteDonation);

router.get('/expenses', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), getExpenses);
router.post('/expenses', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), createExpense);
router.put('/expenses/:id', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), updateExpense);
router.delete('/expenses/:id', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), deleteExpense);

router.get('/budget', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), getBudget);
router.put('/budget', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), updateBudget);
router.delete('/budget', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), deleteBudget);

// EXPORTS
router.get('/exports/financial-pdf', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), exportFinancialPDF);
router.get('/exports/donor-pdf', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), exportDonorPDF);
router.get('/exports/donations-excel', authenticateToken, authorizeRoles('SUPERADMIN', 'ADMIN'), exportDonationsExcel);

// AUDIT LOGS (SUPERADMIN ONLY)
router.get('/audit-logs', authenticateToken, authorizeRoles('SUPERADMIN'), getAuditLogs);

export default router;
