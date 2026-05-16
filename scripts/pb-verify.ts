import PocketBase from 'pocketbase';

const pb = new PocketBase('https://springfine.pockethost.io/');

async function main() {
  await pb.admins.authWithPassword('aturaerick@gmail.com', 'dGY@SrzA86PQc5n');
  console.log('✅ Authenticated\n');

  const collections = ['hero', 'stats', 'services', 'gallery', 'clients', 'values', 'contact_info'];

  for (const name of collections) {
    try {
      const records = await pb.collection(name).getFullList();
      console.log(`📂 ${name}: ${records.length} records`);
    } catch (e: any) {
      console.log(`❌ ${name}: ${e?.message}`);
    }
  }
}

main().catch(console.error);
