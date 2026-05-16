import PocketBase from 'pocketbase';

const pb = new PocketBase('https://springfine.pockethost.io/');

async function main() {
  // Credentials loaded from env — run as: PB_EMAIL=x PB_PASS=y npx tsx scripts/pb-setup.ts
  console.log('🔐 Authenticating...');
  await pb.admins.authWithPassword(
    process.env.PB_EMAIL ?? '',
    process.env.PB_PASS  ?? ''
  );
  console.log('✅ Authenticated as admin.\n');

  // ── Helper ───────────────────────────────────────────────────
  async function createCollection(schema: any) {
    try {
      await pb.collections.create(schema);
      console.log(`✅ Created collection: ${schema.name}`);
    } catch (e: any) {
      if (e?.response?.data?.name === 'validation_not_unique') {
        console.log(`⚠️  Collection already exists: ${schema.name} (skipping)`);
      } else {
        throw e;
      }
    }
  }

  async function seedRecord(collection: string, data: any) {
    try {
      const rec = await pb.collection(collection).create(data);
      console.log(`  ➕ ${collection}: ${JSON.stringify(Object.values(data).slice(0, 2))}`);
      return rec;
    } catch (e: any) {
      console.error(`  ❌ Failed seeding ${collection}:`, e?.message);
    }
  }

  // ════════════════════════════════════════════════════════════
  // 1. CREATE COLLECTIONS
  // ════════════════════════════════════════════════════════════
  console.log('📦 Creating collections...\n');

  await createCollection({
    name: 'hero',
    type: 'base',
    schema: [
      { name: 'headline',    type: 'text',   required: true },
      { name: 'subheadline', type: 'text',   required: true },
      { name: 'tagline',     type: 'text' },
      { name: 'cta_label',   type: 'text' },
      { name: 'badge1',      type: 'text' },
      { name: 'badge2',      type: 'text' },
      { name: 'background',  type: 'file',   options: { maxSelect: 1, mimeTypes: ['image/jpeg','image/png','image/webp'] } },
      { name: 'rig_image',   type: 'file',   options: { maxSelect: 1, mimeTypes: ['image/jpeg','image/png','image/webp'] } },
    ],
  });

  await createCollection({
    name: 'stats',
    type: 'base',
    schema: [
      { name: 'value',  type: 'number', required: true },
      { name: 'suffix', type: 'text' },
      { name: 'label',  type: 'text',   required: true },
      { name: 'order',  type: 'number', required: true },
    ],
  });

  await createCollection({
    name: 'services',
    type: 'base',
    schema: [
      { name: 'title',     type: 'text', required: true },
      { name: 'desc',      type: 'text', required: true },
      { name: 'icon_name', type: 'text', required: true },
      { name: 'badge',     type: 'text' },
      { name: 'order',     type: 'number', required: true },
    ],
  });

  await createCollection({
    name: 'gallery',
    type: 'base',
    schema: [
      { name: 'title', type: 'text', required: true },
      { name: 'desc',  type: 'text' },
      { name: 'image', type: 'file', required: true, options: { maxSelect: 1, mimeTypes: ['image/jpeg','image/png','image/webp'] } },
      { name: 'order', type: 'number', required: true },
    ],
  });

  await createCollection({
    name: 'clients',
    type: 'base',
    schema: [
      { name: 'name',    type: 'text',   required: true },
      { name: 'variant', type: 'select', required: true, options: { values: ['engraved','bold','code'] } },
      { name: 'order',   type: 'number', required: true },
    ],
  });

  await createCollection({
    name: 'values',
    type: 'base',
    schema: [
      { name: 'title', type: 'text', required: true },
      { name: 'desc',  type: 'text', required: true },
      { name: 'order', type: 'number', required: true },
    ],
  });

  await createCollection({
    name: 'contact_info',
    type: 'base',
    schema: [
      { name: 'phone',    type: 'text', required: true },
      { name: 'email',    type: 'text', required: true },
      { name: 'address',  type: 'text', required: true },
      { name: 'whatsapp', type: 'text' },
      { name: 'po_box',   type: 'text' },
    ],
  });

  // ════════════════════════════════════════════════════════════
  // 2. SEED RECORDS
  // ════════════════════════════════════════════════════════════
  console.log('\n🌱 Seeding records...\n');

  // Hero
  await seedRecord('hero', {
    headline:    'SAVING WATER, SAVING EARTH.',
    subheadline: 'Innovative borehole drilling and water systems enhancing access to safe water in Kitale and beyond.',
    tagline:     'Save Water, Save Earth',
    cta_label:   'Get a Free Quote',
    badge1:      'EST. 2018',
    badge2:      '500+ PROJECTS',
  });

  // Stats
  const statsData = [
    { value: 500, suffix: '+', label: 'Boreholes Drilled',   order: 1 },
    { value: 15,  suffix: '+', label: 'Years Experience',    order: 2 },
    { value: 8,   suffix: '',  label: 'Counties Served',     order: 3 },
    { value: 98,  suffix: '%', label: 'Client Satisfaction', order: 4 },
  ];
  for (const s of statsData) await seedRecord('stats', s);

  // Services
  const servicesData = [
    { title: 'Groundwater Exploration', desc: 'Hydrogeological surveys to identify the best drilling sites', icon_name: 'Search',     badge: 'Specialized', order: 1 },
    { title: 'Borehole Drilling',       desc: 'Professional drilling up to deep aquifer levels using modern rigs', icon_name: 'Droplets', badge: 'Primary',     order: 2 },
    { title: 'Pump Installation',       desc: 'Solar and electric pump systems for reliable water supply',  icon_name: 'Zap',        badge: 'Secondary',   order: 3 },
    { title: 'Water Quality Testing',   desc: 'Laboratory analysis to ensure safe, clean water',             icon_name: 'ShieldCheck', badge: 'Standard',    order: 4 },
    { title: 'Borehole Rehabilitation', desc: 'Restoration of old or underperforming boreholes',             icon_name: 'RotateCw',   badge: 'Maintenance', order: 5 },
    { title: 'Piping & Distribution',   desc: 'End-to-end water reticulation system installation',           icon_name: 'Waves',      badge: 'Standard',    order: 6 },
  ];
  for (const s of servicesData) await seedRecord('services', s);

  // Clients
  const clientsData = [
    { name: 'Kitale Water Authority', variant: 'engraved', order: 1 },
    { name: 'TransNzoia County',      variant: 'bold',     order: 2 },
    { name: 'AgroServe Kenya Ltd',    variant: 'code',     order: 3 },
    { name: 'Western Seeds Co.',      variant: 'engraved', order: 4 },
    { name: 'Hope Springs NGO',       variant: 'bold',     order: 5 },
    { name: 'Rift Valley Farms',      variant: 'code',     order: 6 },
    { name: 'Meru Highlands Resort',  variant: 'engraved', order: 7 },
  ];
  for (const c of clientsData) await seedRecord('clients', c);

  // Values
  const valuesData = [
    { title: 'Integrity',      desc: 'We operate with full transparency and honesty in every project we undertake.',                    order: 1 },
    { title: 'Quality',        desc: 'High standards in every borehole, every system, every interaction with our clients.',             order: 2 },
    { title: 'Sustainability', desc: 'Every solution is designed to serve communities for generations, respecting the environment.',     order: 3 },
  ];
  for (const v of valuesData) await seedRecord('values', v);

  // Contact Info
  await seedRecord('contact_info', {
    phone:    '+254 700 000000',
    email:    'info@springfine.co.ke',
    address:  'Kitale, Trans-Nzoia County, Kenya',
    whatsapp: '+254 700 000000',
    po_box:   'P.O. Box 1234, Kitale',
  });

  console.log('\n🎉 All done! Collections created and records seeded.');
  console.log('🔗 Check your admin: https://springfine.pockethost.io/_/');
}

main().catch((e) => {
  console.error('❌ Fatal error:', e?.response?.data || e?.message || e);
  process.exit(1);
});
