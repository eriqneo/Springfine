/**
 * pb-nuke.ts — force delete all Springfine collections by listing all and matching by name
 */
import PocketBase from 'pocketbase';
const pb = new PocketBase('https://springfine.pockethost.io/');

async function main() {
  await pb.admins.authWithPassword('aturaerick@gmail.com', 'dGY@SrzA86PQc5n');
  console.log('✅ Auth ok\n');

  const TARGET = ['hero','stats','services','gallery','clients','values','contact_info'];

  // List ALL collections
  const all = await pb.collections.getFullList();
  console.log('All collections found:', all.map(c => `${c.name} (${c.id})`).join(', '));

  for (const col of all) {
    if (TARGET.includes(col.name)) {
      try {
        await pb.collections.delete(col.id);
        console.log(`  🗑️  Deleted: ${col.name} (${col.id})`);
      } catch(e: any) {
        console.log(`  ❌ Could not delete ${col.name}:`, e?.response?.data ?? e?.message);
      }
    }
  }
  console.log('\n✅ Nuke complete. Now run pb-rebuild.ts');
}
main().catch(e => console.error(e?.response?.data ?? e?.message));
