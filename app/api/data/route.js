import { NextResponse } from 'next/server';
import { isAuthenticated } from '../../../lib/auth';
import { getSupabaseServer } from '../../../lib/supabaseServer';
function n(v){ const x=Number(v); return Number.isFinite(x)?x:0; }
function auth(){ if(!isAuthenticated()) return NextResponse.json({error:'Não autorizado.'},{status:401}); return null; }
function err(e){ return NextResponse.json({error:e?.message || 'Erro interno.'},{status:500}); }

export async function GET(){
  const blocked=auth(); if(blocked) return blocked;
  try{
    const supabase=getSupabaseServer();
    const [ing, rec, ord, note] = await Promise.all([
      supabase.from('ingredients').select('*').order('name',{ascending:true}),
      supabase.from('recipes').select('*, recipe_items(*, ingredients(*))').order('created_at',{ascending:false}),
      supabase.from('orders').select('*').order('order_date',{ascending:false}).order('created_at',{ascending:false}),
      supabase.from('notes').select('*').eq('id',1).maybeSingle()
    ]);
    for (const r of [ing,rec,ord,note]) if(r.error) throw r.error;
    return NextResponse.json({ingredients:ing.data||[], recipes:rec.data||[], orders:ord.data||[], note:note.data||{id:1,content:''}});
  } catch(e){ return err(e); }
}

export async function POST(request){
  const blocked=auth(); if(blocked) return blocked;
  try{
    const body=await request.json(); const {resource, action, id, payload}=body; const supabase=getSupabaseServer();
    if(resource==='ingredient'){
      const data={name:payload.name||'Ingrediente', package_quantity:n(payload.package_quantity), package_unit:payload.package_unit||'g', package_cost:n(payload.package_cost), notes:payload.notes||''};
      if(action==='create'){ const r=await supabase.from('ingredients').insert(data).select().single(); if(r.error) throw r.error; return NextResponse.json({item:r.data}); }
      if(action==='update'){ const r=await supabase.from('ingredients').update(data).eq('id',id).select().single(); if(r.error) throw r.error; return NextResponse.json({item:r.data}); }
      if(action==='delete'){ const r=await supabase.from('ingredients').delete().eq('id',id); if(r.error) throw r.error; return NextResponse.json({ok:true}); }
    }
    if(resource==='recipe'){
      const data={name:payload.name||'Produto', extra_percent:n(payload.extra_percent||25), profit_multiplier:n(payload.profit_multiplier||3), yield_quantity:n(payload.yield_quantity||1), individual_package_cost:n(payload.individual_package_cost), sale_price:n(payload.sale_price), notes:payload.notes||''};
      if(action==='create'){
        const r=await supabase.from('recipes').insert(data).select().single(); if(r.error) throw r.error;
        const items=(payload.items||[]).filter(i=>i.ingredient_id).map(i=>({recipe_id:r.data.id, ingredient_id:i.ingredient_id, quantity_used:n(i.quantity_used)}));
        if(items.length){ const ir=await supabase.from('recipe_items').insert(items); if(ir.error) throw ir.error; }
        return NextResponse.json({item:r.data});
      }
      if(action==='update'){
        const r=await supabase.from('recipes').update(data).eq('id',id); if(r.error) throw r.error;
        const del=await supabase.from('recipe_items').delete().eq('recipe_id',id); if(del.error) throw del.error;
        const items=(payload.items||[]).filter(i=>i.ingredient_id).map(i=>({recipe_id:id, ingredient_id:i.ingredient_id, quantity_used:n(i.quantity_used)}));
        if(items.length){ const ir=await supabase.from('recipe_items').insert(items); if(ir.error) throw ir.error; }
        return NextResponse.json({ok:true});
      }
      if(action==='delete'){ const r=await supabase.from('recipes').delete().eq('id',id); if(r.error) throw r.error; return NextResponse.json({ok:true}); }
    }
    if(resource==='order'){
      const quantity=n(payload.quantity||1), unit=n(payload.unit_price), total=n(payload.total_price || quantity*unit);
      const data={order_date:payload.order_date, client_name:payload.client_name||'Cliente', product_name:payload.product_name||'Produto', quantity, unit_price:unit, total_price:total, status:payload.status||'Pendente', payment_method:payload.payment_method||'Pix', notes:payload.notes||''};
      if(action==='create'){ const r=await supabase.from('orders').insert(data).select().single(); if(r.error) throw r.error; return NextResponse.json({item:r.data}); }
      if(action==='update'){ const r=await supabase.from('orders').update(data).eq('id',id).select().single(); if(r.error) throw r.error; return NextResponse.json({item:r.data}); }
      if(action==='delete'){ const r=await supabase.from('orders').delete().eq('id',id); if(r.error) throw r.error; return NextResponse.json({ok:true}); }
    }
    if(resource==='note' && action==='save'){
      const r=await supabase.from('notes').upsert({id:1, content:payload.content||'', updated_at:new Date().toISOString()}).select().single(); if(r.error) throw r.error; return NextResponse.json({note:r.data});
    }
    return NextResponse.json({error:'Ação inválida.'},{status:400});
  } catch(e){ return err(e); }
}
