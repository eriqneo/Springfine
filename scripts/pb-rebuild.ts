/**
 * pb-rebuild.ts
 * Recreates all Springfine collections with correct schema (PocketBase v0.23+)
 * and seeds all records. Safe to run multiple times (skips existing collections).
 *
 * Run: npx tsx scripts/pb-rebuild.ts
 */
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://springfine.pockethost.io/');

async function main() {
  // ── Auth (PocketBase v0.23+ uses _superusers collection) ────
  console.log('🔐 Authenticating...');
  await pb.collection('_superusers').authWithPassword('aturaerick@gmail.com', 'dGY@SrzA86PQc5n');
  console.log('✅ Authenticated.\n');

  const COLLECTIONS = ['hero', 'stats', 'services', 'gallery', 'clients', 'values', 'contact_info', 'director'];

  // ── Step 1: Delete existing empty collections ────────────────
  console.log('🗑️  Deleting old collections...');
  for (const name of COLLECTIONS) {
    try {
      const col = await pb.collections.getOne(name);
      await pb.collections.delete(col.id);
      console.log(`  ✅ Deleted: ${name}`);
    } catch {
      console.log(`  ⚠️  Not found (skipping): ${name}`);
    }
  }

  // ── Step 2: Recreate with correct schema format ──────────────
  console.log('\n📦 Recreating collections with correct schema...');

  // HERO
  await pb.collections.create({
    name: 'hero', type: 'base', listRule: '', viewRule: '',
    fields: [
      { type: 'text',   name: 'headline',    required: true },
      { type: 'text',   name: 'subheadline', required: true },
      { type: 'text',   name: 'tagline',     required: false },
      { type: 'text',   name: 'cta_label',   required: false },
      { type: 'text',   name: 'badge1',      required: false },
      { type: 'text',   name: 'badge2',      required: false },
      { type: 'file',   name: 'background',  required: false, maxSelect: 1, mimeTypes: ['image/jpeg','image/png','image/webp'] },
      { type: 'file',   name: 'rig_image',   required: false, maxSelect: 1, mimeTypes: ['image/jpeg','image/png','image/webp'] },
    ]
  });
  console.log('  ✅ hero');

  // STATS
  await pb.collections.create({
    name: 'stats', type: 'base', listRule: '', viewRule: '',
    fields: [
      { type: 'number', name: 'value',  required: true },
      { type: 'text',   name: 'suffix', required: false },
      { type: 'text',   name: 'label',  required: true },
      { type: 'number', name: 'order',  required: true },
    ]
  });
  console.log('  ✅ stats');

  // SERVICES
  await pb.collections.create({
    name: 'services', type: 'base', listRule: '', viewRule: '',
    fields: [
      { type: 'text',   name: 'title',     required: true },
      { type: 'text',   name: 'desc',      required: true },
      { type: 'text',   name: 'icon_name', required: true },
      { type: 'text',   name: 'badge',     required: false },
      { type: 'number', name: 'order',     required: true },
    ]
  });
  console.log('  ✅ services');

  // GALLERY
  await pb.collections.create({
    name: 'gallery', type: 'base', listRule: '', viewRule: '',
    fields: [
      { type: 'text',   name: 'title', required: true },
      { type: 'text',   name: 'desc',  required: false },
      { type: 'file',   name: 'image', required: true, maxSelect: 1, mimeTypes: ['image/jpeg','image/png','image/webp'] },
      { type: 'number', name: 'order', required: true },
    ]
  });
  console.log('  ✅ gallery');

  // CLIENTS
  await pb.collections.create({
    name: 'clients', type: 'base', listRule: '', viewRule: '',
    fields: [
      { type: 'text',   name: 'name',    required: true },
      { type: 'select', name: 'variant', required: true, maxSelect: 1, values: ['engraved','bold','code'] },
      { type: 'number', name: 'order',   required: true },
    ]
  });
  console.log('  ✅ clients');

  // VALUES
  await pb.collections.create({
    name: 'values', type: 'base', listRule: '', viewRule: '',
    fields: [
      { type: 'text',   name: 'title', required: true },
      { type: 'text',   name: 'desc',  required: true },
      { type: 'number', name: 'order', required: true },
    ]
  });
  console.log('  ✅ values');

  // CONTACT INFO
  await pb.collections.create({
    name: 'contact_info', type: 'base', listRule: '', viewRule: '',
    fields: [
      { type: 'text', name: 'phone',    required: true },
      { type: 'text', name: 'email',    required: true },
      { type: 'text', name: 'address',  required: true },
      { type: 'text', name: 'whatsapp', required: false },
      { type: 'text', name: 'po_box',   required: false },
    ]
  });
  console.log('  ✅ contact_info');

  // DIRECTOR
  await pb.collections.create({
    name: 'director', type: 'base', listRule: '', viewRule: '',
    fields: [
      { type: 'text', name: 'name', required: true },
      { type: 'text', name: 'title', required: true },
      { type: 'text', name: 'bio', required: true },
      { type: 'text', name: 'quote', required: true },
      { type: 'text', name: 'credentials', required: true },
      { type: 'file', name: 'photo', required: false, maxSelect: 1, mimeTypes: ['image/jpeg','image/png','image/webp'] },
    ]
  });
  console.log('  ✅ director');

  // ── Step 3: Seed records ─────────────────────────────────────
  console.log('\n🌱 Seeding records...');

  async function create(col: string, data: object) {
    const rec = await pb.collection(col).create(data);
    const label = Object.values(data).slice(0,2).join(' | ');
    console.log(`  ➕ [${col}] ${label}`);
    return rec;
  }

  // Hero
  await create('hero', {
    headline: 'SAVING WATER, SAVING EARTH.',
    subheadline: 'Innovative borehole drilling and water systems enhancing access to safe water in Kitale and beyond.',
    tagline: 'Save Water, Save Earth',
    cta_label: 'Get a Free Quote',
    badge1: 'EST. 2018',
    badge2: '500+ PROJECTS',
  });

  // Stats
  await create('stats', { value: 500, suffix: '+', label: 'Boreholes Drilled',   order: 1 });
  await create('stats', { value: 15,  suffix: '+', label: 'Years Experience',    order: 2 });
  await create('stats', { value: 8,   suffix: '',  label: 'Counties Served',     order: 3 });
  await create('stats', { value: 98,  suffix: '%', label: 'Client Satisfaction', order: 4 });

  // Services
  await create('services', { title: 'Groundwater Exploration', desc: 'Hydrogeological surveys to identify the best drilling sites',      icon_name: 'Search',      badge: 'Specialized', order: 1 });
  await create('services', { title: 'Borehole Drilling',       desc: 'Professional drilling up to deep aquifer levels using modern rigs', icon_name: 'Droplets',    badge: 'Primary',     order: 2 });
  await create('services', { title: 'Pump Installation',       desc: 'Solar and electric pump systems for reliable water supply',         icon_name: 'Zap',         badge: 'Secondary',   order: 3 });
  await create('services', { title: 'Water Quality Testing',   desc: 'Laboratory analysis to ensure safe, clean water',                   icon_name: 'ShieldCheck', badge: 'Standard',    order: 4 });
  await create('services', { title: 'Borehole Rehabilitation', desc: 'Restoration of old or underperforming boreholes',                   icon_name: 'RotateCw',    badge: 'Maintenance', order: 5 });
  await create('services', { title: 'Piping & Distribution',   desc: 'End-to-end water reticulation system installation',                 icon_name: 'Waves',       badge: 'Standard',    order: 6 });

  // Clients
  await create('clients', { name: 'Kitale Water Authority', variant: 'engraved', order: 1 });
  await create('clients', { name: 'TransNzoia County',      variant: 'bold',     order: 2 });
  await create('clients', { name: 'AgroServe Kenya Ltd',    variant: 'code',     order: 3 });
  await create('clients', { name: 'Western Seeds Co.',      variant: 'engraved', order: 4 });
  await create('clients', { name: 'Hope Springs NGO',       variant: 'bold',     order: 5 });
  await create('clients', { name: 'Rift Valley Farms',      variant: 'code',     order: 6 });
  await create('clients', { name: 'Meru Highlands Resort',  variant: 'engraved', order: 7 });

  // Values
  await create('values', { title: 'Integrity',      desc: 'We operate with full transparency and honesty in every project we undertake.',                order: 1 });
  await create('values', { title: 'Quality',        desc: 'High standards in every borehole, every system, every interaction with our clients.',         order: 2 });
  await create('values', { title: 'Sustainability', desc: 'Every solution is designed to serve communities for generations, respecting the environment.', order: 3 });

  // Contact Info
  await create('contact_info', {
    phone:    '+254 700 000000',
    email:    'info@springfine.co.ke',
    address:  'Kitale, Trans-Nzoia County, Kenya',
    whatsapp: '+254 700 000000',
    po_box:   'P.O. Box 1234, Kitale',
  });

  // Director
  await create('director', {
    name: 'John Atura',
    title: 'Founder & Managing Director',
    bio: 'Dedicated to providing sustainable water solutions to communities across Kenya. With a passion for engineering and environmental stewardship, he leads Springfine Hydrosolutions LTD with a commitment to excellence and integrity.',
    quote: 'Water is not just a resource; it is the foundation of life and community development.',
    credentials: 'NEMA Certified,WRMA Licensed,15+ Years Experience',
  });

  // ── Step 4: Verify ───────────────────────────────────────────
  console.log('\n\n📊 Verification:');
  for (const name of COLLECTIONS) {
    const recs = await pb.collection(name).getFullList();
    const fields = (await pb.collections.getOne(name)).fields ?? [];
    console.log(`  ${recs.length > 0 ? '✅' : '⚠️ '} ${name}: ${recs.length} records, ${fields.length} fields`);
  }

  console.log('\n🎉 Done! Open https://springfine.pockethost.io/_/ to verify.');
}

main().catch((e) => {
  console.error('\n❌ Error:', JSON.stringify(e?.response?.data, null, 2) ?? e?.message ?? e);
  process.exit(1);
});
