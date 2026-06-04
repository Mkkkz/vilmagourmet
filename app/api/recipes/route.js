import { NextResponse } from 'next/server';
import { query, getPool } from '../../../lib/db';
import { requireAdmin, errorResponse, numberValue } from '../../../lib/api';

async function getRecipes() {
  const recipesResult = await query('select * from recipes order by created_at desc');
  const itemsResult = await query(`
    select
      ri.*,
      i.name as ingredient_name,
      i.package_quantity,
      i.package_unit,
      i.package_cost
    from recipe_items ri
    join ingredients i on i.id = ri.ingredient_id
    order by ri.created_at asc
  `);

  return recipesResult.rows.map((recipe) => ({
    ...recipe,
    recipe_items: itemsResult.rows.filter((item) => item.recipe_id === recipe.id)
  }));
}

export async function GET() {
  const blocked = requireAdmin();
  if (blocked) return blocked;

  try {
    const recipes = await getRecipes();
    return NextResponse.json({ recipes });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request) {
  const blocked = requireAdmin();
  if (blocked) return blocked;

  const client = await getPool().connect();

  try {
    const body = await request.json();
    await client.query('begin');

    const recipeResult = await client.query(
      `insert into recipes
       (name, extra_percent, profit_multiplier, yield_quantity, individual_package_cost, sale_price, notes)
       values ($1, $2, $3, $4, $5, $6, $7)
       returning *`,
      [
        body.name || 'Produto',
        numberValue(body.extra_percent || 25),
        numberValue(body.profit_multiplier || 3),
        numberValue(body.yield_quantity || 1),
        numberValue(body.individual_package_cost),
        numberValue(body.sale_price),
        body.notes || ''
      ]
    );

    const recipe = recipeResult.rows[0];
    const items = Array.isArray(body.items) ? body.items : [];

    for (const item of items) {
      if (!item.ingredient_id) continue;
      await client.query(
        `insert into recipe_items (recipe_id, ingredient_id, quantity_used)
         values ($1, $2, $3)`,
        [recipe.id, item.ingredient_id, numberValue(item.quantity_used)]
      );
    }

    await client.query('commit');
    return NextResponse.json({ recipe });
  } catch (error) {
    await client.query('rollback');
    return errorResponse(error);
  } finally {
    client.release();
  }
}
