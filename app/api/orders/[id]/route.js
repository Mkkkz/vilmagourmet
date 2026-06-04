import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { requireAdmin, errorResponse, numberValue } from '../../../../lib/api';

export async function PUT(request, { params }) {
  const blocked = requireAdmin();
  if (blocked) return blocked;

  try {
    const body = await request.json();
    const quantity = numberValue(body.quantity || 1);
    const unitPrice = numberValue(body.unit_price);
    const totalPrice = numberValue(body.total_price || quantity * unitPrice);

    const result = await query(
      `update orders
       set order_date = $1, client_name = $2, product_name = $3, quantity = $4,
           unit_price = $5, total_price = $6, status = $7, payment_method = $8, notes = $9
       where id = $10
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
        body.notes || '',
        params.id
      ]
    );

    return NextResponse.json({ order: result.rows[0] });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request, { params }) {
  const blocked = requireAdmin();
  if (blocked) return blocked;

  try {
    await query('delete from orders where id = $1', [params.id]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
