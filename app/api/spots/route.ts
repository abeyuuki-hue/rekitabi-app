import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region') || 'kanto';

  // Sanitize region to prevent directory traversal
  const safeRegion = region.replace(/[^a-zA-Z0-9_-]/g, '');

  try {
    const jsonDirectory = path.join(process.cwd(), 'public/data/spots');
    const filePath = path.join(jsonDirectory, `${safeRegion}.json`);
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Region data not found' }, { status: 404 });
  }
}
