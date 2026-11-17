const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Cafe Menu & Order Management API',
    version: '1.0.0',
    description: `
**Cafe Menu & Order Management System REST API**

Features:
- **Menu Catalog**: Filter by category, full-text search, multi-field sorting, allergen and dietary flags.
- **Order Placement**: Client tamper-proof server-side pricing & tax calculation, auto-generated order tracking codes.
- **Order Tracking**: Real-time status lookup by human-readable \`orderNumber\` for dine-in & takeaway customers.
- **Staff Operations**: Real-time order status transition workflow (\`pending\` -> \`preparing\` -> \`ready\` -> \`completed\` / \`cancelled\`).
- **Resilience**: Zero-crash in-memory Mock Store fallback when MongoDB Atlas is connecting or offline.
    `,
    contact: {
      name: 'Cafe API Support',
      email: 'support@cafemanager.local'
    }
  },
  servers: [
    {
      url: '/',
      description: 'Current Environment Server'
    }
  ],
  components: {
    schemas: {
      MenuItem: {
        type: 'object',
        required: ['name', 'description', 'price', 'category'],
        properties: {
          _id: {
            type: 'string',
            example: '65f1234567890abcdef12345'
          },
          name: {
            type: 'string',
            example: 'Artisan Espresso'
          },
          description: {
            type: 'string',
            example: 'Double shot of single-origin Ethiopian Yirgacheffe with bright floral notes.'
          },
          price: {
            type: 'number',
            format: 'float',
            example: 3.75
          },
          category: {
            type: 'string',
            enum: [
              'Coffee',
              'Tea & Beverages',
              'Bakery & Pastries',
              'Breakfast & Brunch',
              'Sandwiches & Savory',
              'Desserts'
            ],
            example: 'Coffee'
          },
          imageUrl: {
            type: 'string',
            example: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
          },
          isAvailable: {
            type: 'boolean',
            example: true
          },
          isVegetarian: {
            type: 'boolean',
            example: true
          },
          isVegan: {
            type: 'boolean',
            example: true
          },
          isGlutenFree: {
            type: 'boolean',
            example: true
          },
          rating: {
            type: 'number',
            example: 4.9
          },
          preparationTime: {
            type: 'integer',
            example: 3
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      OrderItem: {
        type: 'object',
        required: ['menuItem', 'name', 'price', 'quantity'],
        properties: {
          menuItem: {
            type: 'string',
            example: '65f1234567890abcdef12345'
          },
          name: {
            type: 'string',
            example: 'Artisan Espresso'
          },
          price: {
            type: 'number',
            example: 3.75
          },
          quantity: {
            type: 'integer',
            example: 2
          }
        }
      },
      Order: {
        type: 'object',
        required: [
          'orderNumber',
          'customerName',
          'customerPhone',
          'items',
          'subtotal',
          'totalAmount'
        ],
        properties: {
          _id: {
            type: 'string',
            example: '65f9876543210fedcba54321'
          },
          orderNumber: {
            type: 'string',
            example: 'ORD-20261117-4821'
          },
          customerName: {
            type: 'string',
            example: 'Sophia Rossi'
          },
          customerPhone: {
            type: 'string',
            example: '+1-555-019-2834'
          },
          tableNumber: {
            type: 'string',
            example: 'Table 7'
          },
          orderType: {
            type: 'string',
            enum: ['dine-in', 'takeaway'],
            example: 'dine-in'
          },
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/OrderItem'
            }
          },
          subtotal: {
            type: 'number',
            example: 7.50
          },
          tax: {
            type: 'number',
            example: 0.60
          },
          totalAmount: {
            type: 'number',
            example: 8.10
          },
          status: {
            type: 'string',
            enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'],
            example: 'pending'
          },
          notes: {
            type: 'string',
            example: 'Extra hot please'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string',
            example: 'Validation failed'
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                message: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }
};

const swaggerOptions = {
  swaggerDefinition,
  apis: [
    './routes/*.js',
    './models/*.js',
    './server.js'
  ]
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

const setupSwagger = (app) => {
  // Swagger UI docs page
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Cafe Management API Documentation'
    })
  );

  // Raw JSON spec endpoint
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

module.exports = {
  setupSwagger,
  swaggerSpec
};
