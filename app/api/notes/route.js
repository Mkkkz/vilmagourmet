import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';
import { requireAdmin, errorResponse } from '../../../lib/api';

export async function GET() {
  const blocked = requireAdmin();
  if (blocked) return blocked;

  try {
    const result = await query('select * from notes where id = 1');
    return NextResponse.json({ note: result.rows[0] || { id: 1, content: '' } });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request) {
  const blocked = requireAdmin();
  if (blocked) return blocked;

  try {
    const body = await request.json();

    const result = await query(
      `insert into notes (id, content, updated_at)
       values (1, $1, now())
       on conflict (id)
       do update set content = excluded.content, updated_at = now()
       returning *`,
      [body.content || '']
    );

    return NextResponse.json({ note: result.rows[0] });
  } catch (error) {
    return errorResponse(error);
  }
}
