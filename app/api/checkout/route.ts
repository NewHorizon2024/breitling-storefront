import { NextRequest, NextResponse } from 'next/server';

type CheckoutItem = {
  objectID: string;
  name: string;
  price: number;
  quantity: number;
  currency?: string;
};

function isValidItem(item: unknown): item is CheckoutItem {
  if (!item || typeof item !== 'object') return false;
  const candidate = item as Record<string, unknown>;
  return (
    typeof candidate.objectID === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.price === 'number' &&
    typeof candidate.quantity === 'number'
  );
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Invalid request body.' },
      { status: 400 },
    );
  }

  try {
    const data = (body ?? {}) as Record<string, unknown>;
    const rawItems = Array.isArray(data.items) ? data.items : [];
    const items = rawItems.filter(isValidItem);

    if (items.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Your cart is empty or contains invalid items.' },
        { status: 400 },
      );
    }

    const total =
      typeof data.total === 'number' && Number.isFinite(data.total)
        ? data.total
        : items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const currency = typeof data.currency === 'string' ? data.currency : undefined;

    const order = {
      id: `ORD-${Date.now()}`,
      items,
      total,
      currency,
      createdAt: new Date().toISOString(),
      status: 'Pending' as const,
    };

    // Return the created order to the client. Client will persist to localStorage
    // and clear the cart so that storage access remains client-side only.
    return NextResponse.json({ status: 'ok', order });
  } catch (error) {
    console.error('[checkout] failed to create order', error);
    return NextResponse.json(
      { status: 'error', message: 'We could not process your order. Please try again.' },
      { status: 500 },
    );
  }
}
