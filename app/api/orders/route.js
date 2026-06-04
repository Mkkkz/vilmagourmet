import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';
import { requireAdmin, errorResponse, numberValue } from '../../../lib/api';

export async function GET() {
  const blocked = requireAdmin();
  if (blocked) return blocked;

  try {
    const result = await query('select * from orders order by order_date desc, created_at desc');
    return NextResponse.json({ orders: result.rows });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request) {
  const blocked = requireAdmin();
  if (blocked) return blocked;

  try {
    const body = await request.json();
    const quantity = numberValue(body.quantity || 1);
    const unitPrice = numberValue(body.unit_price);
    const totalPrice = numberValue(body.total_price || quantity * unitPrice);

    const result = await query(
      `insert into orders
       (order_date, client_name, product_name, quantity, unit_price, total_price, status, payment_method, notes)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       returning *`,
      [
        body.order_date,
        body.client_name || 'Cliente',
        body.product_name || 'Produto',
        quantity,
        unitPrice,
        totalPrice,
        body.status || 'Pendente',
        body.payment_method || 'Pix',
        body.notes || ''
      ]
    );

    return NextResponse.json({ order: result.rows[0] });
  } catch (error) {
    return errorResponse(error);
  }
}
