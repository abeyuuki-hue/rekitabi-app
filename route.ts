import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region') || 'kanto';

  try {
    const jsonDirectory = path.join(process.cwd(), 'public/data/spots');
    const fileContents = await fs.readFile(`${jsonDirectory}/${region}.json`, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Region data not found' }, { status: 404 });
  }
}