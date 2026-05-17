import PocketBase from 'pocketbase';

const url = 'https://springfine.pockethost.io/';
export const pb = new PocketBase(url);

/**
 * Build a PocketBase file URL directly — more reliable than pb.files.getURL()
 * which has inconsistencies across SDK versions.
 *
 * @param record  - The full PocketBase record object (must have collectionId + id)
 * @param filename - The filename string stored in the record field
 * @param thumb   - Optional thumbnail size like '800x0' or '400x400'
 */
export const getPbImageUrl = (record: any, filename: string, thumb = '') => {
  if (!filename || !record?.collectionId || !record?.id) return '';
  const base = `${url}api/files/${record.collectionId}/${record.id}/${encodeURIComponent(filename)}`;
  return thumb ? `${base}?thumb=${thumb}` : base;
};
