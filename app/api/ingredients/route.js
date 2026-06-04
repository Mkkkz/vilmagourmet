import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';
import { requireAdmin, errorResponse, numberValue } from '../../../lib/api';

export async function GET() {
  const blocked = requireAdmin();
  if (blocked) return blocked;

  try {
    const result = await query('select * from ingredients order by name asc');
    return NextResponse.json({ ingredients: result.rows });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request) {
  const blocked = requireAdmin();
  if (blocked) return blocked;

  try {
    const body = await request.json();

    const result = await query(
      `insert into ingredients (name, package_quantity, package_unit, package_cost, notes)
       values ($1, $2, $3, $4, $5)
       returning *`,
      [
        body.name || 'Ingrediente',
        numberValue(body.package_quantity),
        body.package_unit || 'g',
        numberValue(body.package_cost),
        body.notes || ''
      ]
    );

    return NextResponse.json({ ingredient: result.rows[0] });
  } catch (error) {
    return errorResponse(error);
  }
}
