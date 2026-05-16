import PocketBase from 'pocketbase';

// Using the provided PocketHost URL
const url = 'https://springfine.pockethost.io/';
export const pb = new PocketBase(url);

// Utility to get file URLs from PocketBase records
export const getPbImageUrl = (record: any, filename: string, thumb = '1200x0') => {
  if (!filename) return '';
  return pb.files.getURL(record, filename, { thumb });
};
