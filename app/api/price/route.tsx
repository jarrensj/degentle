import { NextResponse, NextRequest } from 'next/server';
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const apiKey = process.env.COINGECKO_API_KEY || '';
  const url = 'https://api.coingecko.com/api/v3/simple/price';

  try {
    const response = await fetch(`${url}?ids=ethereum,degen-base&vs_currencies=usd&x-api-key=${apiKey}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    const path = '/api/price';

    revalidatePath(path);
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate', 
        'Pragma': 'no-cache',
        'Expires': '60'
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      statusText: 'Internal Server Error',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
