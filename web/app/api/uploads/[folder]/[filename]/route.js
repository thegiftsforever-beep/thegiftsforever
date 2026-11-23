import sharp from 'sharp';
import { dbConnect } from '@/lib/db';
import { StoredUpload } from '@/lib/models';
import { UPLOAD_FOLDERS } from '@/lib/uploads';

export const runtime = 'nodejs';

function bad(status, msg) {
  return new Response(msg, { status, headers: { 'Content-Type': 'text/plain' } });
}

export async function GET(req, { params }) {
  const { folder, filename } = await params;
  if (!UPLOAD_FOLDERS.includes(folder)) return bad(404, 'Not found');
  if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return bad(400, 'Bad path');
  }

  await dbConnect();
  const doc = await StoredUpload.findOne({ folder, filename }).lean();
  if (!doc) return bad(404, 'Not found');

  let bytes = Buffer.isBuffer(doc.data) ? doc.data : Buffer.from(doc.data.buffer ?? doc.data);
  let type = doc.mimeType;

  // ?w=&q= come from the Next/Image loader: send a resized WebP instead of the full upload
  const sp = req.nextUrl.searchParams;
  const w = Math.min(2048, Math.max(16, Number(sp.get('w')) || 0));
  if (sp.get('w') && type !== 'image/gif') {
    const q = Math.min(90, Math.max(30, Number(sp.get('q')) || 75));
    try {
      bytes = await sharp(bytes).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: q }).toBuffer();
      type = 'image/webp';
    } catch {}
  }
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(bytes));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': type,
      'Content-Length': String(bytes.length),
      'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
    },
  });
}
