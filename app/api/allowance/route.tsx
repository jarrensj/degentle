import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const address = request.nextUrl.searchParams.get('address');
  const apiUrl = `https://www.degen.tips/api/airdrop2/tip-allowance?address=${address}`;

  try {
    const apiResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await apiResponse.json();

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json'
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