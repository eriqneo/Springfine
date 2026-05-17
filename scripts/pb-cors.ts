/**
 * pb-cors.ts — updates PocketHost CORS allowed origins
 * to include the live Netlify and custom domain URLs
 */
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://springfine.pockethost.io/');

async function main() {
  await pb.admins.authWithPassword('aturaerick@gmail.com', 'dGY@SrzA86PQc5n');
  console.log('✅ Authenticated\n');

  // Update application settings with allowed CORS origins
  await pb.settings.update({
    meta: {
      appName: 'Springfine Hydrosolutions',
      appUrl: 'https://springfine.netlify.app',
    }
  });

  const settings = await pb.settings.getAll();
  console.log('✅ App settings updated');
  console.log('   App name:', settings.meta?.appName);
  console.log('   App URL:', settings.meta?.appUrl);
  console.log('\n📌 CORS must also be set in PocketHost dashboard manually:');
  console.log('   https://springfine.pockethost.io/_/ → Settings → Application');
  console.log('   Add these origins:');
  console.log('     https://springfine.netlify.app');
  console.log('     https://springfinehydro.co.ke');
  console.log('     https://www.springfinehydro.co.ke');
}

main().catch(e => console.error(e?.response?.data ?? e?.message));
