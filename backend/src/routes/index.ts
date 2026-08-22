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
  deleteBudgetCategory,
  exportFinancialPDF,
  exportDonorPDF,
  exportDonationsExcel,
  exportExpensesPDF,
  exportExpensesExcel,
  exportBudgetPDF,
  exportBudgetExcel,
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
  getProxyThumbnail,
  getPublicVolunteers,
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
import { authorizeRoles, authorizePermission } from '../middleware/rbac';

const router = Router();

// AUTH ROUTES
router.post('/auth/login', login);
router.get('/auth/me', authenticateToken, getMe);
router.post('/auth/change-password', authenticateToken, changePassword);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);

// USER & ACCOUNT MANAGEMENT (SUPERADMIN & ADMIN)
router.get('/users', authenticateToken, authorizePermission('USERS', 'SUPERADMIN', 'ADMIN'), getUsers);
router.post('/users', authenticateToken, authorizePermission('USERS', 'SUPERADMIN', 'ADMIN'), createUser);
router.put('/users/:id', authenticateToken, authorizePermission('USERS', 'SUPERADMIN', 'ADMIN'), updateUser);
router.delete('/users/:id', authenticateToken, authorizePermission('USERS', 'SUPERADMIN', 'ADMIN'), deleteUser);

// PUBLIC WEBSITE CONTENT & FORM SUBMISSION ROUTES
router.get('/settings', getSettings);
router.get('/instagram/feed', getInstagramFeed);
router.get('/members', getMembers);
router.get('/events', getEvents);
router.get('/announcements', getAnnouncements);
router.get('/gallery', getGallery);
router.get('/media/proxy-thumbnail', getProxyThumbnail);
router.get('/volunteers/public', getPublicVolunteers);
router.post('/subscribers', createSubscriber);
router.post('/donations/public', createPublicDonation);

// PROTECTED CONTENT ROUTES (SUPERADMIN, ADMIN, COMMITTEE_MEMBER, OR GRANTED MEMBER)
router.put('/settings', authenticateToken, authorizePermission('SETTINGS', 'SUPERADMIN', 'ADMIN'), updateSettings);
router.delete('/settings', authenticateToken, authorizePermission('SETTINGS', 'SUPERADMIN', 'ADMIN'), resetSettings);

router.post('/members', authenticateToken, authorizePermission('CMS_MEMBERS', 'SUPERADMIN', 'ADMIN', 'COMMITTEE_MEMBER'), createMember);
router.put('/members/:id', authenticateToken, authorizePermission('CMS_MEMBERS', 'SUPERADMIN', 'ADMIN', 'COMMITTEE_MEMBER'), updateMember);
router.delete('/members/:id', authenticateToken, authorizePermission('CMS_MEMBERS', 'SUPERADMIN', 'ADMIN', 'COMMITTEE_MEMBER'), deleteMember);

router.post('/events', authenticateToken, authorizePermission('CMS_EVENTS', 'SUPERADMIN', 'ADMIN', 'COMMITTEE_MEMBER'), createEvent);
router.put('/events/:id', authenticateToken, authorizePermission('CMS_EVENTS', 'SUPERADMIN', 'ADMIN', 'COMMITTEE_MEMBER'), updateEvent);
router.delete('/events/:id', authenticateToken, authorizePermission('CMS_EVENTS', 'SUPERADMIN', 'ADMIN'), deleteEvent);

router.post('/announcements', authenticateToken, authorizePermission('CMS_ANNOUNCEMENTS', 'SUPERADMIN', 'ADMIN', 'COMMITTEE_MEMBER'), createAnnouncement);
router.put('/announcements/:id', authenticateToken, authorizePermission('CMS_ANNOUNCEMENTS', 'SUPERADMIN', 'ADMIN', 'COMMITTEE_MEMBER'), updateAnnouncement);
router.delete('/announcements/:id', authenticateToken, authorizePermission('CMS_ANNOUNCEMENTS', 'SUPERADMIN', 'ADMIN'), deleteAnnouncement);

router.post('/gallery', authenticateToken, authorizePermission('CMS_GALLERY', 'SUPERADMIN', 'ADMIN', 'COMMITTEE_MEMBER'), createGalleryItem);
router.put('/gallery/:id', authenticateToken, authorizePermission('CMS_GALLERY', 'SUPERADMIN', 'ADMIN', 'COMMITTEE_MEMBER'), updateGalleryItem);
router.delete('/gallery/:id', authenticateToken, authorizePermission('CMS_GALLERY', 'SUPERADMIN', 'ADMIN'), deleteGalleryItem);

router.get('/volunteers', authenticateToken, authorizePermission('CMS_VOLUNTEERS', 'SUPERADMIN', 'ADMIN', 'COMMITTEE_MEMBER'), getVolunteers);
router.post('/volunteers', authenticateToken, authorizePermission('CMS_VOLUNTEERS', 'SUPERADMIN', 'ADMIN', 'COMMITTEE_MEMBER'), createVolunteer);
router.put('/volunteers/:id', authenticateToken, authorizePermission('CMS_VOLUNTEERS', 'SUPERADMIN', 'ADMIN', 'COMMITTEE_MEMBER'), updateVolunteer);
router.delete('/volunteers/:id', authenticateToken, authorizePermission('CMS_VOLUNTEERS', 'SUPERADMIN', 'ADMIN'), deleteVolunteer);

router.get('/subscribers', authenticateToken, authorizePermission('CMS_SUBSCRIBERS', 'SUPERADMIN', 'ADMIN'), getSubscribers);
router.delete('/subscribers/:id', authenticateToken, authorizePermission('CMS_SUBSCRIBERS', 'SUPERADMIN', 'ADMIN'), deleteSubscriber);

// PROTECTED FINANCE & REPORTING ROUTES (SUPERADMIN & ADMIN, OR GRANTED MEMBER)
router.get('/finance/summary', authenticateToken, authorizePermission('FINANCE', 'SUPERADMIN', 'ADMIN'), getFinancialSummary);

router.get('/donations', authenticateToken, authorizePermission('FINANCE', 'SUPERADMIN', 'ADMIN'), getDonations);
router.post('/donations', authenticateToken, authorizePermission('FINANCE', 'SUPERADMIN', 'ADMIN'), createDonation);
router.put('/donations/:id', authenticateToken, authorizePermission('FINANCE', 'SUPERADMIN', 'ADMIN'), updateDonation);
router.delete('/donations/:id', authenticateToken, authorizePermission('FINANCE', 'SUPERADMIN', 'ADMIN'), deleteDonation);

router.get('/expenses', authenticateToken, authorizePermission('FINANCE', 'SUPERADMIN', 'ADMIN'), getExpenses);
router.post('/expenses', authenticateToken, authorizePermission('FINANCE', 'SUPERADMIN', 'ADMIN'), createExpense);
router.put('/expenses/:id', authenticateToken, authorizePermission('FINANCE', 'SUPERADMIN', 'ADMIN'), updateExpense);
router.delete('/expenses/:id', authenticateToken, authorizePermission('FINANCE', 'SUPERADMIN', 'ADMIN'), deleteExpense);

router.get('/budget', authenticateToken, authorizePermission('FINANCE', 'SUPERADMIN', 'ADMIN'), getBudget);
router.put('/budget', authenticateToken, authorizePermission('FINANCE', 'SUPERADMIN', 'ADMIN'), updateBudget);
router.delete('/budget', authenticateToken, authorizePermission('FINANCE', 'SUPERADMIN', 'ADMIN'), deleteBudget);
router.delete('/budget/categories/:categoryId', authenticateToken, authorizePermission('FINANCE', 'SUPERADMIN', 'ADMIN'), deleteBudgetCategory);

// EXPORTS
router.get('/exports/financial-pdf', authenticateToken, authorizePermission('REPORTS', 'SUPERADMIN', 'ADMIN'), exportFinancialPDF);
router.get('/exports/donor-pdf', authenticateToken, authorizePermission('REPORTS', 'SUPERADMIN', 'ADMIN'), exportDonorPDF);
router.get('/exports/donations-excel', authenticateToken, authorizePermission('REPORTS', 'SUPERADMIN', 'ADMIN'), exportDonationsExcel);
router.get('/exports/expenses-pdf', authenticateToken, authorizePermission('REPORTS', 'SUPERADMIN', 'ADMIN'), exportExpensesPDF);
router.get('/exports/expenses-excel', authenticateToken, authorizePermission('REPORTS', 'SUPERADMIN', 'ADMIN'), exportExpensesExcel);
router.get('/exports/budget-pdf', authenticateToken, authorizePermission('REPORTS', 'SUPERADMIN', 'ADMIN'), exportBudgetPDF);
router.get('/exports/budget-excel', authenticateToken, authorizePermission('REPORTS', 'SUPERADMIN', 'ADMIN'), exportBudgetExcel);

// AUDIT LOGS (SUPERADMIN ONLY OR GRANTED AUDIT_LOGS)
router.get('/audit-logs', authenticateToken, authorizePermission('AUDIT_LOGS', 'SUPERADMIN'), getAuditLogs);

export default router;
