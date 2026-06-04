import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { requireAdmin, errorResponse, numberValue } from '../../../../lib/api';

export async function PUT(request, { params }) {
  const blocked = requireAdmin();
  if (blocked) return blocked;

  try {
    const body = await request.json();

    const result = await query(
      `update ingredients
       set name = $1, package_quantity = $2, package_unit = $3, package_cost = $4, notes = $5
       where id = $6
       returning *`,
      [
        body.name || 'Ingrediente',
        numberValue(body.package_quantity),
        body.package_unit || 'g',
        numberValue(body.package_cost),
        body.notes || '',
        params.id
      ]
    );

    return NextResponse.json({ ingredient: result.rows[0] });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request, { params }) {
  const blocked = requireAdmin();
  if (blocked) return blocked;

  try {
    await query('delete from ingredients where id = $1', [params.id]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
