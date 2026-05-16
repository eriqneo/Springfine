/**
 * Springfine PocketHost Seeder
 * Seeds records into all collections using the admin API directly.
 * Run: PB_EMAIL=x PB_PASS=y npx tsx scripts/pb-seed.ts
 */
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://springfine.pockethost.io/');

async function seed() {
  console.log('🔐 Authenticating as admin...');
  const adminAuth = await pb.admins.authWithPassword(
    process.env.PB_EMAIL ?? 'aturaerick@gmail.com',
    process.env.PB_PASS  ?? 'dGY@SrzA86PQc5n'
  );
  
  // Use the admin token for all requests
  pb.authStore.save(adminAuth.token, adminAuth.admin);
  console.log('✅ Authenticated.\n');

  // ── Helper: clear collection first, then seed ──────────────────
  async function clearAndSeed(collectionName: string, records: object[]) {
    console.log(`\n📂 Processing: ${collectionName}`);
    
    // Delete existing records first (idempotent re-runs)
    try {
      const existing = await pb.collection(collectionName).getFullList();
      for (const rec of existing) {
        await pb.collection(collectionName).delete(rec.id);
        process.stdout.write('  🗑️  deleted existing\r');
      }
      if (existing.length > 0) console.log(`  🗑️  Cleared ${existing.length} old records`);
    } catch (e) {
      // Collection might be empty or inaccessible — continue
    }

    // Seed new records
    for (const record of records) {
      try {
        await pb.collection(collectionName).create(record);
        const label = Object.values(record).slice(0, 2).join(' | ');
        console.log(`  ➕ ${label}`);
      } catch (e: any) {
        console.error(`  ❌ Failed:`, e?.response?.data ?? e?.message);
      }
    }
  }

  // ════════════════════════════════════════════════════════════
  // HERO
  // ════════════════════════════════════════════════════════════
  await clearAndSeed('hero', [{
    headline:    'SAVING WATER, SAVING EARTH.',
    subheadline: 'Innovative borehole drilling and water systems enhancing access to safe water in Kitale and beyond.',
    tagline:     'Save Water, Save Earth',
    cta_label:   'Get a Free Quote',
    badge1:      'EST. 2018',
    badge2:      '500+ PROJECTS',
  }]);

  // ════════════════════════════════════════════════════════════
  // STATS
  // ════════════════════════════════════════════════════════════
  await clearAndSeed('stats', [
    { value: 500, suffix: '+', label: 'Boreholes Drilled',   order: 1 },
    { value: 15,  suffix: '+', label: 'Years Experience',    order: 2 },
    { value: 8,   suffix: '',  label: 'Counties Served',     order: 3 },
    { value: 98,  suffix: '%', label: 'Client Satisfaction', order: 4 },
  ]);

  // ════════════════════════════════════════════════════════════
  // SERVICES
  // ════════════════════════════════════════════════════════════
  await clearAndSeed('services', [
    { title: 'Groundwater Exploration', desc: 'Hydrogeological surveys to identify the best drilling sites',      icon_name: 'Search',      badge: 'Specialized', order: 1 },
    { title: 'Borehole Drilling',       desc: 'Professional drilling up to deep aquifer levels using modern rigs', icon_name: 'Droplets',    badge: 'Primary',     order: 2 },
    { title: 'Pump Installation',       desc: 'Solar and electric pump systems for reliable water supply',         icon_name: 'Zap',         badge: 'Secondary',   order: 3 },
    { title: 'Water Quality Testing',   desc: 'Laboratory analysis to ensure safe, clean water',                   icon_name: 'ShieldCheck', badge: 'Standard',    order: 4 },
    { title: 'Borehole Rehabilitation', desc: 'Restoration of old or underperforming boreholes',                   icon_name: 'RotateCw',    badge: 'Maintenance', order: 5 },
    { title: 'Piping & Distribution',   desc: 'End-to-end water reticulation system installation',                 icon_name: 'Waves',       badge: 'Standard',    order: 6 },
  ]);

  // ════════════════════════════════════════════════════════════
  // CLIENTS
  // ════════════════════════════════════════════════════════════
  await clearAndSeed('clients', [
    { name: 'Kitale Water Authority', variant: 'engraved', order: 1 },
    { name: 'TransNzoia County',      variant: 'bold',     order: 2 },
    { name: 'AgroServe Kenya Ltd',    variant: 'code',     order: 3 },
    { name: 'Western Seeds Co.',      variant: 'engraved', order: 4 },
    { name: 'Hope Springs NGO',       variant: 'bold',     order: 5 },
    { name: 'Rift Valley Farms',      variant: 'code',     order: 6 },
    { name: 'Meru Highlands Resort',  variant: 'engraved', order: 7 },
  ]);

  // ════════════════════════════════════════════════════════════
  // VALUES
  // ════════════════════════════════════════════════════════════
  await clearAndSeed('values', [
    { title: 'Integrity',      desc: 'We operate with full transparency and honesty in every project we undertake.',                order: 1 },
    { title: 'Quality',        desc: 'High standards in every borehole, every system, every interaction with our clients.',         order: 2 },
    { title: 'Sustainability', desc: 'Every solution is designed to serve communities for generations, respecting the environment.', order: 3 },
  ]);

  // ════════════════════════════════════════════════════════════
  // CONTACT INFO
  // ════════════════════════════════════════════════════════════
  await clearAndSeed('contact_info', [{
    phone:    '+254 700 000000',
    email:    'info@springfine.co.ke',
    address:  'Kitale, Trans-Nzoia County, Kenya',
    whatsapp: '+254 700 000000',
    po_box:   'P.O. Box 1234, Kitale',
  }]);

  // ════════════════════════════════════════════════════════════
  // VERIFY
  // ════════════════════════════════════════════════════════════
  console.log('\n\n📊 Final record counts:');
  const all = ['hero', 'stats', 'services', 'gallery', 'clients', 'values', 'contact_info'];
  for (const name of all) {
    try {
      const recs = await pb.collection(name).getFullList();
      console.log(`  ${recs.length > 0 ? '✅' : '⚠️ '} ${name}: ${recs.length} records`);
    } catch {
      console.log(`  ❌ ${name}: could not read`);
    }
  }
  console.log('\n🎉 Seeding complete!');
  console.log('📌 Admin UI: https://springfine.pockethost.io/_/');
  console.log('💡 Gallery images must be uploaded manually via the admin UI.\n');
}

seed().catch((e) => {
  console.error('\n❌ Error:', e?.response?.data ?? e?.message ?? e);
  process.exit(1);
});
