import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vighnaharta Puja Committee REST API',
      version: '1.0.0',
      description: 'Full-Stack API documentation for Public Website & Secure Admin Management Dashboard (Includes GET, POST, PUT, DELETE)',
      contact: {
        name: 'Vighnaharta Dev Team',
        email: 'info@vighnahartapujacommittee.org',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'Current Host Server (Auto-detected)',
      },
      {
        url: 'https://vpcommittee-backend.onrender.com/api',
        description: 'Render Production Cloud Server',
      },
      {
        url: 'http://localhost:5000/api',
        description: 'Localhost Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    paths: {
      '/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'User Login (POST)',
          description: 'Authenticate user with email and password to retrieve JWT bearer token.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', example: 'superadmin@vighnaharta.org' },
                    password: { type: 'string', example: 'SuperAdmin@2026' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login successful with JWT token' },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Authentication'],
          summary: 'Get Current Authenticated User Profile (GET)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Profile details returned' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/finance/summary': {
        get: {
          tags: ['Financial Management'],
          summary: 'Get Financial Overview & Budget Metrics (GET)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Financial total donations, expenses, net balance, and budget progress' } },
        },
      },
      '/donations': {
        get: {
          tags: ['Financial Management'],
          summary: 'List All Donation Contributions (GET)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Donation register items' } },
        },
        post: {
          tags: ['Financial Management'],
          summary: 'Record New Donation (POST)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    donorName: { type: 'string', example: 'Rahul Sharma' },
                    amount: { type: 'number', example: 25000 },
                    paymentMethod: { type: 'string', example: 'UPI' },
                    category: { type: 'string', example: 'Pandal Sponsorship' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Donation recorded' } },
        },
      },
      '/donations/{id}': {
        put: {
          tags: ['Financial Management'],
          summary: 'Update Donation Details (PUT)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    donorName: { type: 'string', example: 'Rahul Sharma' },
                    amount: { type: 'number', example: 30000 },
                    paymentMethod: { type: 'string', example: 'UPI' },
                    category: { type: 'string', example: 'Pandal Sponsorship' },
                    receiptNo: { type: 'string', example: 'DON-2026-001' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Donation updated successfully' } },
        },
        delete: {
          tags: ['Financial Management'],
          summary: 'Delete Donation Record (DELETE)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Donation deleted successfully' } },
        },
      },
      '/expenses': {
        get: {
          tags: ['Financial Management'],
          summary: 'List Vendor Expenses & Vouchers (GET)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Expense list' } },
        },
        post: {
          tags: ['Financial Management'],
          summary: 'Log New Committee Expense (POST)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    expenseName: { type: 'string', example: 'Pandal Setup' },
                    category: { type: 'string', example: 'Pandal' },
                    amount: { type: 'number', example: 120000 },
                    vendor: { type: 'string', example: 'Odisha Builders' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Expense recorded' } },
        },
      },
      '/expenses/{id}': {
        put: {
          tags: ['Financial Management'],
          summary: 'Update Expense Voucher (PUT)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    expenseName: { type: 'string', example: 'Pandal Illumination & LED' },
                    category: { type: 'string', example: 'Lighting' },
                    amount: { type: 'number', example: 45000 },
                    vendor: { type: 'string', example: 'Standard Electricals' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Expense updated successfully' } },
        },
        delete: {
          tags: ['Financial Management'],
          summary: 'Delete Expense Record (DELETE)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Expense deleted successfully' } },
        },
      },
      '/budget': {
        get: {
          tags: ['Financial Management'],
          summary: 'Get Allocated Budget vs Actual Category Utilization (GET)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Budget breakdown' } },
        },
        put: {
          tags: ['Financial Management'],
          summary: 'Update Festival Budget Allocation (PUT)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    totalAllocatedBudget: { type: 'number', example: 500000 },
                    categories: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          category: { type: 'string', example: 'Pandal & Decor' },
                          allocatedAmount: { type: 'number', example: 150000 },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Budget updated successfully' } },
        },
        delete: {
          tags: ['Financial Management'],
          summary: 'Reset Festival Budget Allocations (DELETE)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Budget reset successfully' } },
        },
      },
      '/exports/financial-pdf': {
        get: {
          tags: ['Reports & Exports'],
          summary: 'Generate Downloadable PDF Financial Audit Statement (GET)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'PDF binary stream' } },
        },
      },
      '/exports/donations-excel': {
        get: {
          tags: ['Reports & Exports'],
          summary: 'Generate Downloadable Excel (.xlsx) Donation Register (GET)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Excel spreadsheet stream' } },
        },
      },
      '/events': {
        get: {
          tags: ['Events & Festival Schedule'],
          summary: 'Get All Festival Events & Puja Timings (GET)',
          responses: { 200: { description: 'List of events' } },
        },
        post: {
          tags: ['Events & Festival Schedule'],
          summary: 'Add New Festival Event (POST)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string', example: 'Grand Visarjan Procession' },
                    date: { type: 'string', example: '2026-09-17' },
                    time: { type: 'string', example: '04:00 PM' },
                    location: { type: 'string', example: 'River Ghat Route' },
                    category: { type: 'string', example: 'Visarjan' },
                    description: { type: 'string', example: 'Immersion procession with dhol tasha.' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Event created' } },
        },
      },
      '/events/{id}': {
        put: {
          tags: ['Events & Festival Schedule'],
          summary: 'Update Event Details (PUT)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string', example: 'Maha Aarti & Sandhya Puja' },
                    description: { type: 'string', example: 'Evening Aarti with 108 diyas' },
                    date: { type: 'string', example: '2026-09-08' },
                    time: { type: 'string', example: '07:30 PM' },
                    location: { type: 'string', example: 'Main Mandap Stage' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Event updated successfully' } },
        },
        delete: {
          tags: ['Events & Festival Schedule'],
          summary: 'Delete Event (DELETE)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Event deleted successfully' } },
        },
      },
      '/announcements': {
        get: {
          tags: ['Public Announcements'],
          summary: 'Get Active Public Announcements (GET)',
          responses: { 200: { description: 'Announcements list' } },
        },
        post: {
          tags: ['Public Announcements'],
          summary: 'Publish New Announcement (POST)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string', example: 'Traffic & Parking Route Alert' },
                    content: { type: 'string', example: 'North gate reserved for senior citizens.' },
                    priority: { type: 'string', example: 'HIGH' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Announcement published' } },
        },
      },
      '/announcements/{id}': {
        put: {
          tags: ['Public Announcements'],
          summary: 'Update Announcement (PUT)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string', example: 'VIP Parking & Route Update' },
                    content: { type: 'string', example: 'North gate reserved for senior citizens and emergency vehicles.' },
                    priority: { type: 'string', example: 'HIGH' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Announcement updated successfully' } },
        },
        delete: {
          tags: ['Public Announcements'],
          summary: 'Delete Announcement (DELETE)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Announcement deleted successfully' } },
        },
      },
      '/members': {
        get: {
          tags: ['Committee Members CMS'],
          summary: 'Get Executive Committee Members (GET)',
          responses: { 200: { description: 'Committee members list' } },
        },
        post: {
          tags: ['Committee Members CMS'],
          summary: 'Add Executive Member (POST)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'Amitabh Sen' },
                    role: { type: 'string', example: 'President' },
                    phone: { type: 'string', example: '+91 98765 43210' },
                    photoUrl: { type: 'string', example: '/assets/bannerimage.png' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Member added' } },
        },
      },
      '/members/{id}': {
        put: {
          tags: ['Committee Members CMS'],
          summary: 'Update Committee Member Details (PUT)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'Amitabh Sen' },
                    role: { type: 'string', example: 'Working President' },
                    phone: { type: 'string', example: '+91 98765 43210' },
                    photoUrl: { type: 'string', example: '/assets/bannerimage.png' },
                    bio: { type: 'string', example: 'Senior Mandap Trustee' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Member updated successfully' } },
        },
        delete: {
          tags: ['Committee Members CMS'],
          summary: 'Remove Committee Member (DELETE)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Member deleted successfully' } },
        },
      },
      '/gallery': {
        get: {
          tags: ['Media Gallery'],
          summary: 'Get Media Gallery Photos & Videos (GET)',
          responses: { 200: { description: 'Gallery media items' } },
        },
        post: {
          tags: ['Media Gallery'],
          summary: 'Upload Media Asset (POST)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string', example: 'Day 1 Grand Aarti' },
                    category: { type: 'string', example: 'Puja' },
                    imageUrl: { type: 'string', example: '/assets/bannerimage.png' },
                    albumName: { type: 'string', example: 'Ganesh Utsav 2026' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Media uploaded' } },
        },
      },
      '/gallery/{id}': {
        put: {
          tags: ['Media Gallery'],
          summary: 'Update Gallery Asset Info (PUT)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string', example: 'Day 1 Evening Pushpanjali' },
                    category: { type: 'string', example: 'Puja' },
                    imageUrl: { type: 'string', example: '/assets/bannerimage.png' },
                    albumName: { type: 'string', example: 'Ganesh Utsav 2026' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Gallery item updated successfully' } },
        },
        delete: {
          tags: ['Media Gallery'],
          summary: 'Delete Gallery Asset (DELETE)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Gallery item deleted successfully' } },
        },
      },
      '/volunteers': {
        get: {
          tags: ['Volunteers Roster'],
          summary: 'List Volunteer Applications (GET)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Volunteer applications' } },
        },
        post: {
          tags: ['Volunteers Roster'],
          summary: 'Submit Volunteer Application (POST)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'Rohan Verma' },
                    phone: { type: 'string', example: '+91 99887 76655' },
                    email: { type: 'string', example: 'rohan@example.com' },
                    preferredRole: { type: 'string', example: 'Crowd Control' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Application submitted' } },
        },
      },
      '/volunteers/{id}': {
        put: {
          tags: ['Volunteers Roster'],
          summary: 'Update Volunteer Status (PUT)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'APPROVED' },
                    preferredRole: { type: 'string', example: 'Prasad Management' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Volunteer status updated successfully' } },
        },
        delete: {
          tags: ['Volunteers Roster'],
          summary: 'Delete Volunteer Record (DELETE)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Volunteer record deleted successfully' } },
        },
      },
      '/settings': {
        get: {
          tags: ['Website CMS Settings'],
          summary: 'Get Global Website Settings (GET)',
          responses: { 200: { description: 'Website settings' } },
        },
        put: {
          tags: ['Website CMS Settings'],
          summary: 'Update Website Hero & Global Settings (PUT)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    heroTitle: { type: 'string', example: 'VIGHNAHARTA PUJA COMMITTEE' },
                    heroSubtitle: { type: 'string', example: 'GRAND GANESH UTSAV 2026' },
                    heroDescription: { type: 'string', example: 'Join us in celebrating devotion, unity, and divine blessings.' },
                    upiId: { type: 'string', example: 'vighnaharta@upi' },
                    contactPhone: { type: 'string', example: '+91 98765 43210' },
                    contactEmail: { type: 'string', example: 'info@vighnahartapujacommittee.org' },
                    contactAddress: { type: 'string', example: 'Main Mandap Grounds, Sector 4, City Center' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Settings updated successfully' } },
        },
        delete: {
          tags: ['Website CMS Settings'],
          summary: 'Reset Website Settings to System Defaults (DELETE)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Settings reset to default' } },
        },
      },
      '/audit-logs': {
        get: {
          tags: ['Security & System Audit'],
          summary: 'Get System Security Audit Trail (GET)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Audit logs' } },
        },
      },
    },
  },
  apis: ['./backend/src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('[Swagger] API Documentation available at http://localhost:5000/api/docs');
};
