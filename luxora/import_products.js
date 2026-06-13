/**
 * LUXORA — Bulk Product Import Script
 * Run this on your local machine:
 *   cd C:\Users\jagru\Desktop\LUXORA-complete-platform\luxora
 *   node import_products.js
 *
 * Requirements: Node.js, axios, form-data packages
 * Install: npm install axios form-data
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

const API_BASE = 'https://luxora-api-kayu.onrender.com/api/v1';
const IMAGES_DIR = path.join(__dirname, 'product_images');
const PRODUCTS_FILE = path.join(__dirname, 'products_clean.json');

// ── Admin credentials ──────────────────────────────────────────────────────
const ADMIN_EMAIL = 'luxora2010@gmail.com';
const ADMIN_PASSWORD = 'Jagrutjain10';

let accessToken = '';
let chandelerCategoryId = '';

// ── Helpers ────────────────────────────────────────────────────────────────
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function log(msg) {
  const time = new Date().toISOString().substring(11, 19);
  console.log(`[${time}] ${msg}`);
}

// ── Step 1: Login ──────────────────────────────────────────────────────────
async function login() {
  log('Logging in as admin...');
  const res = await axios.post(`${API_BASE}/auth/login`, {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  accessToken = res.data.data.accessToken;
  log('✅ Logged in successfully');
}

// ── Step 2: Get or create Chandeliers category ─────────────────────────────
async function ensureCategory() {
  log('Fetching categories...');
  const res = await axios.get(`${API_BASE}/categories`);
  const categories = res.data.data || [];
  
  const existing = categories.find(c => c.slug === 'chandeliers');
  if (existing) {
    chandelerCategoryId = existing.id;
    log(`✅ Found existing "Chandeliers" category: ${chandelerCategoryId}`);
    return;
  }

  log('Creating "Chandeliers" category...');
  const createRes = await axios.post(
    `${API_BASE}/admin/categories`,
    { name: 'Chandeliers', description: 'Luxury crystal and designer chandeliers', sortOrder: 0 },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  chandelerCategoryId = createRes.data.data.id;
  log(`✅ Created "Chandeliers" category: ${chandelerCategoryId}`);
}

// ── Step 3: Upload image to Cloudinary ────────────────────────────────────
async function uploadImage(sku) {
  const imgPath = path.join(IMAGES_DIR, `${sku}.jpg`);
  if (!fs.existsSync(imgPath)) {
    log(`⚠️  No image for ${sku}, skipping image`);
    return null;
  }

  const form = new FormData();
  form.append('image', fs.createReadStream(imgPath), `${sku}.jpg`);

  const res = await axios.post(`${API_BASE}/upload/single`, form, {
    headers: {
      ...form.getHeaders(),
      Authorization: `Bearer ${accessToken}`,
    },
    timeout: 30000,
  });

  return res.data.data?.url || res.data.url || null;
}

// ── Step 4: Create product ─────────────────────────────────────────────────
async function createProduct(product, imageUrl) {
  const slug = product.slug + '-' + Date.now().toString(36);
  
  const payload = {
    name: product.name,
    slug,
    description: product.description,
    shortDesc: `${product.color} crystal chandelier, ${product.size || product.light_source}`,
    sku: product.sku,
    price: product.mrp,
    discountPrice: product.sale_price,
    categoryId: chandelerCategoryId,
    stockQty: 10,
    material: product.material,
    isFeatured: product.mrp >= 20000,
    isBestSeller: false,
    isActive: true,
    images: imageUrl ? [{ url: imageUrl, isPrimary: true }] : [],
  };

  const res = await axios.post(`${API_BASE}/products`, payload, {
    headers: { Authorization: `Bearer ${accessToken}` },
    timeout: 15000,
  });

  return res.data.data;
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
  log(`Loaded ${products.length} products from products_clean.json`);

  await login();
  await ensureCategory();

  let success = 0, failed = 0;
  const errors = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    log(`[${i + 1}/${products.length}] Processing ${product.sku}...`);

    try {
      // Upload image
      let imageUrl = null;
      try {
        imageUrl = await uploadImage(product.sku);
        if (imageUrl) log(`  ✅ Image uploaded: ${imageUrl.substring(0, 60)}...`);
      } catch (imgErr) {
        log(`  ⚠️  Image upload failed: ${imgErr.message}`);
      }

      // Create product
      const created = await createProduct(product, imageUrl);
      log(`  ✅ Product created: ${created.name} (₹${product.mrp})`);
      success++;

      // Small delay to avoid rate limiting
      await sleep(500);

    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      log(`  ❌ Failed: ${msg}`);
      errors.push({ sku: product.sku, error: msg });
      failed++;
    }
  }

  log('');
  log('═══════════════════════════════════════');
  log(`✅ Success: ${success} products`);
  log(`❌ Failed:  ${failed} products`);
  if (errors.length > 0) {
    log('Failed items:');
    errors.forEach(e => log(`  - ${e.sku}: ${e.error}`));
  }
  log('═══════════════════════════════════════');
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
