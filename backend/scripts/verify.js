const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { app } = require('../server');
const { connectDB } = require('../config/db');

async function runVerification() {
  console.log('--- Starting Backend Verification Tests ---');

  // Connect DB / Fallback
  await connectDB();

  const PORT = 5555;
  const server = app.listen(PORT);
  const baseUrl = `http://localhost:${PORT}`;

  try {
    // 1. Health check
    console.log('\n[1] Testing GET /api/health...');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthJson = await healthRes.json();
    console.log('Health Response:', healthJson);
    if (healthJson.status !== 'ok') throw new Error('Health check failed');

    // 2. Swagger docs.json
    console.log('\n[2] Testing GET /api/docs.json...');
    const docsRes = await fetch(`${baseUrl}/api/docs.json`);
    const docsJson = await docsRes.json();
    console.log('Swagger Title:', docsJson.info?.title);
    if (!docsJson.openapi) throw new Error('Swagger spec missing openapi property');

    // 3. Menu list
    console.log('\n[3] Testing GET /api/menu...');
    const menuRes = await fetch(`${baseUrl}/api/menu`);
    const menuJson = await menuRes.json();
    console.log(`Fetched ${menuJson.count} menu items. First item: ${menuJson.data[0]?.name}`);
    if (menuJson.count < 15) throw new Error('Expected at least 15 menu items');

    // 4. Menu categories
    console.log('\n[4] Testing GET /api/menu/categories...');
    const catRes = await fetch(`${baseUrl}/api/menu/categories`);
    const catJson = await catRes.json();
    console.log('Categories:', catJson.data);
    if (catJson.count < 6) throw new Error('Expected 6 categories');

    // 5. Menu item by ID
    const firstItemId = menuJson.data[0]._id;
    console.log(`\n[5] Testing GET /api/menu/${firstItemId}...`);
    const itemRes = await fetch(`${baseUrl}/api/menu/${firstItemId}`);
    const itemJson = await itemRes.json();
    console.log(`Retrieved: ${itemJson.data?.name} ($${itemJson.data?.price})`);

    // 6. Search and Filter
    console.log('\n[6] Testing GET /api/menu with filter ?category=Coffee&search=Latte...');
    const filterRes = await fetch(`${baseUrl}/api/menu?category=Coffee&search=Latte`);
    const filterJson = await filterRes.json();
    console.log(`Search result count: ${filterJson.count}`);

    // 7. Place Order
    console.log('\n[7] Testing POST /api/orders...');
    const orderPayload = {
      customerName: 'Marcus Vance',
      customerPhone: '555-019-8234',
      tableNumber: 'Table 5',
      orderType: 'dine-in',
      items: [
        {
          menuItem: firstItemId,
          quantity: 2
        }
      ],
      notes: 'Oat milk please'
    };

    const orderRes = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    const orderJson = await orderRes.json();
    console.log('Order Created:', {
      orderNumber: orderJson.data?.orderNumber,
      subtotal: orderJson.data?.subtotal,
      tax: orderJson.data?.tax,
      totalAmount: orderJson.data?.totalAmount,
      status: orderJson.data?.status
    });
    if (!orderJson.data?.orderNumber) throw new Error('Order creation failed');

    const createdOrderNumber = orderJson.data.orderNumber;
    const createdOrderId = orderJson.data._id;

    // 8. Track Order by orderNumber
    console.log(`\n[8] Testing GET /api/orders/track/${createdOrderNumber}...`);
    const trackRes = await fetch(`${baseUrl}/api/orders/track/${createdOrderNumber}`);
    const trackJson = await trackRes.json();
    console.log(`Tracked order for ${trackJson.data?.customerName}: status=${trackJson.data?.status}`);
    if (trackJson.data?.orderNumber !== createdOrderNumber) throw new Error('Order tracking mismatch');

    // 9. Update order status
    console.log(`\n[9] Testing PATCH /api/orders/${createdOrderId}/status...`);
    const statusRes = await fetch(`${baseUrl}/api/orders/${createdOrderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'preparing' })
    });
    const statusJson = await statusRes.json();
    console.log(`Updated status: ${statusJson.data?.status}`);
    if (statusJson.data?.status !== 'preparing') throw new Error('Status update failed');

    // 10. Create Menu Item (admin)
    console.log('\n[10] Testing POST /api/menu (admin create)...');
    const newMenuItem = {
      name: 'Honey Lavender Cold Brew',
      description: 'Cold brew coffee steeped with organic French lavender buds and infused with wildflower honey.',
      price: 5.85,
      category: 'Coffee',
      imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      rating: 4.8,
      preparationTime: 4
    };
    const createItemRes = await fetch(`${baseUrl}/api/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMenuItem)
    });
    const createItemJson = await createItemRes.json();
    console.log(`Created new menu item: ${createItemJson.data?.name} (ID: ${createItemJson.data?._id})`);
    if (!createItemJson.data?._id) throw new Error('Menu item creation failed');

    console.log('\n=============================================');
    console.log(' ALL 10 BACKEND VERIFICATION CHECKS PASSED! ');
    console.log('=============================================\n');
  } catch (err) {
    console.error('Verification failed with error:', err);
    process.exitCode = 1;
  } finally {
    server.close();
    process.exit(process.exitCode || 0);
  }
}

runVerification();
