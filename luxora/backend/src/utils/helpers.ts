import { nanoid } from 'nanoid';

export async function generateSlug(name: string, exists: (slug: string) => Promise<boolean>): Promise<string> {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  let slug = base;
  let counter = 1;

  while (await exists(slug)) {
    slug = `${base}-${counter++}`;
  }

  return slug;
}

export function generateOrderNumber(): string {
  const prefix = 'LXR';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = nanoid(4).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function paginate(page: number, limit: number) {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
}
