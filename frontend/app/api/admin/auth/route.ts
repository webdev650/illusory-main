import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (password === adminPassword) {
      // Return a success flag along with the password token to be stored securely client-side
      return NextResponse.json({ success: true, token: adminPassword });
    } else {
      return NextResponse.json({ error: 'Invalid admin password' }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
