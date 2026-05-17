/**
 * pb-nuke.ts — force delete all Springfine collections by listing all and matching by name
 */
import PocketBase from 'pocketbase';
const pb = new PocketBase('https://springfine.pockethost.io/');

async function main() {
  await pb.admins.authWithPassword('aturaerick@gmail.com', 'dGY@SrzA86PQc5n');
  console.log('✅ Auth ok\n');

  const TARGET = ['hero','stats','services','gallery','clients','values','contact_info', 'director'];

  // List ALL collections
  const all = await pb.collections.getFullList();
  console.log('All collections found:', all.map(c => `${c.name} (${c.id})`).join(', '));

  for (const col of all) {
    if (TARGET.includes(col.name)) {
      let success = false;
      let retries = 3;
      while (!success && retries > 0) {
        try {
          await pb.collections.delete(col.id);
          console.log(`  🗑️  Deleted: ${col.name} (${col.id})`);
          success = true;
          await new Promise(r => setTimeout(r, 1000));
        } catch(e: any) {
          retries--;
          console.log(`  ❌ Could not delete ${col.name}:`, e?.response?.data ?? e?.message);
          if (retries > 0) {
            console.log(`  ⏳ Retrying ${col.name}...`);
            await new Promise(r => setTimeout(r, 2000));
          }
        }
      }
    }
  }
  console.log('\n✅ Nuke complete. Now run pb-rebuild.ts');
}
main().catch(e => console.error(e?.response?.data ?? e?.message));
