import { NextResponse } from 'next/server';
import { getPool, query } from '../../../../lib/db';
import { requireAdmin, errorResponse, numberValue } from '../../../../lib/api';

export async function PUT(request, { params }) {
  const blocked = requireAdmin();
  if (blocked) return blocked;

  const client = await getPool().connect();

  try {
    const body = await request.json();
    await client.query('begin');

    await client.query(
      `update recipes
       set name = $1, extra_percent = $2, profit_multiplier = $3, yield_quantity = $4,
           individual_package_cost = $5, sale_price = $6, notes = $7
       where id = $8`,
      [
        body.name || 'Produto',
        numberValue(body.extra_percent || 25),
        numberValue(body.profit_multiplier || 3),
        numberValue(body.yield_quantity || 1),
        numberValue(body.individual_package_cost),
        numberValue(body.sale_price),
        body.notes || '',
        params.id
      ]
    );

    await client.query('delete from recipe_items where recipe_id = $1', [params.id]);

    const items = Array.isArray(body.items) ? body.items : [];
    for (const item of items) {
      if (!item.ingredient_id) continue;
      await client.query(
        `insert into recipe_items (recipe_id, ingredient_id, quantity_used)
         values ($1, $2, $3)`,
        [params.id, item.ingredient_id, numberValue(item.quantity_used)]
      );
    }

    await client.query('commit');
    return NextResponse.json({ ok: true });
  } catch (error) {
    await client.query('rollback');
    return errorResponse(error);
  } finally {
    client.release();
  }
}

export async function DELETE(request, { params }) {
  const blocked = requireAdmin();
  if (blocked) return blocked;

  try {
    await query('delete from recipes where id = $1', [params.id]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
