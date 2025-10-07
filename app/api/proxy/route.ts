import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const isDev = process.env.NODE_ENV !== 'production';
const BACKEND_URL = isDev
  ? 'http://localhost:9000/api/v1'
  : 'http://localhost:9000/api/v1';

async function handleProxy(req: NextRequest) {
  try {
    const { pathname, search } = new URL(req.url);
    const path = pathname.replace(/^\/api\/proxy/, '');
    const data = req.method !== 'GET' ? await req.json() : undefined;

    const response = await axios({
      method: req.method,
      url: `${BACKEND_URL}${path}${search}`,
      data,
      headers: req.headers as any,
      withCredentials: true,
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) { return handleProxy(req); }
export async function POST(req: NextRequest) { return handleProxy(req); }
export async function PUT(req: NextRequest) { return handleProxy(req); }
export async function DELETE(req: NextRequest) { return handleProxy(req); }
