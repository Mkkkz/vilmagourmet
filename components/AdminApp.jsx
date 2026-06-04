'use client';

import { useEffect, useMemo, useState } from 'react';

const today = new Date().toISOString().slice(0, 10);

const emptyIngredient = {
  name: '',
  package_quantity: '',
  package_unit: 'g',
  package_cost: '',
  notes: ''
};

const emptyRecipe = {
  name: '',
  extra_percent: 25,
  profit_multiplier: 3,
  yield_quantity: 1,
  individual_package_cost: 0,
  sale_price: '',
  notes: '',
  items: [{ ingredient_id: '', quantity_used: '' }]
};

const emptyOrder = {
  order_date: today,
  client_name: '',
  product_name: '',
  quantity: 1,
  unit_price: '',
  total_price: '',
  status: 'Pendente',
  payment_method: 'Pix',
  notes: ''
};

function money(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function number(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function cleanNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
  }).format(n);
}

function formatQuantity(value, unit = '') {
  return `${cleanNumber(value)} ${unit}`.trim();
}

function costPerUnit(ingredient) {
  const quantity = number(ingredient.package_quantity);
  const cost = number(ingredient.package_cost);
  return quantity > 0 ? cost / quantity : 0;
}

function monthKey(date) {
  return (date || '').slice(0, 7);
}

function yearKey(date) {
  return (date || '').slice(0, 4);
}

export default function AdminApp() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [login, setLogin] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [tab, setTab] = useState('dashboard');
  const [message, setMessage] = useState('');

  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [note, setNote] = useState('');

  const [ingredientForm, setIngredientForm] = useState(emptyIngredient);
  const [editingIngredient, setEditingIngredient] = useState(null);

  const [recipeForm, setRecipeForm] = useState(emptyRecipe);
  const [editingRecipe, setEditingRecipe] = useState(null);

  const [orderForm, setOrderForm] = useState(emptyOrder);
  const [editingOrder, setEditingOrder] = useState(null);

  const [calc, setCalc] = useState({ a: '', b: '', op: '+' });

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    setAuthenticated(Boolean(data.authenticated));
    setChecking(false);
    if (data.authenticated) loadData();
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(login)
    });

    const data = await res.json();
    if (!res.ok) {
      setLoginError(data.error || 'Erro ao entrar.');
      return;
    }

    setAuthenticated(true);
    loadData();
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAuthenticated(false);
  }

  async function loadData() {
    setMessage('Carregando dados...');

    const [ingRes, recRes, ordRes, noteRes] = await Promise.all([
      fetch('/api/ingredients'),
      fetch('/api/recipes'),
      fetch('/api/orders'),
      fetch('/api/notes')
    ]);

    if ([ingRes.status, recRes.status, ordRes.status, noteRes.status].includes(401)) {
      setAuthenticated(false);
      return;
    }

    const ing = await ingRes.json();
    const rec = await recRes.json();
    const ord = await ordRes.json();
    const not = await noteRes.json();

    setIngredients(ing.ingredients || []);
    setRecipes(rec.recipes || []);
    setOrders(ord.orders || []);
    setNote(not.note?.content || '');
    setMessage('');
  }

  async function saveIngredient(e) {
    e.preventDefault();
    const url = editingIngredient ? `/api/ingredients/${editingIngredient}` : '/api/ingredients';
    const method = editingIngredient ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ingredientForm)
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Erro ao salvar ingrediente.');
      return;
    }

    setIngredientForm(emptyIngredient);
    setEditingIngredient(null);
    setMessage('Ingrediente salvo!');
    loadData();
  }

  function editIngredient(item) {
    setEditingIngredient(item.id);
    setIngredientForm({
      name: item.name || '',
      package_quantity: item.package_quantity || '',
      package_unit: item.package_unit || 'g',
      package_cost: item.package_cost || '',
      notes: item.notes || ''
    });
    setTab('ingredientes');
  }

  async function deleteIngredient(id) {
    if (!confirm('Apagar ingrediente? Isso também pode afetar receitas que usam ele.')) return;
    await fetch(`/api/ingredients/${id}`, { method: 'DELETE' });
    setMessage('Ingrediente apagado.');
    loadData();
  }

  function updateRecipeItem(index, field, value) {
    const items = [...recipeForm.items];
    items[index] = { ...items[index], [field]: value };
    setRecipeForm({ ...recipeForm, items });
  }

  function addRecipeItem() {
    setRecipeForm({
      ...recipeForm,
      items: [...recipeForm.items, { ingredient_id: '', quantity_used: '' }]
    });
  }

  function removeRecipeItem(index) {
    const items = recipeForm.items.filter((_, i) => i !== index);
    setRecipeForm({ ...recipeForm, items: items.length ? items : [{ ingredient_id: '', quantity_used: '' }] });
  }

  function calculateRecipe(form) {
    const totalIngredients = (form.items || []).reduce((sum, item) => {
      const ing = ingredients.find((i) => i.id === item.ingredient_id);
      if (!ing) return sum;
      return sum + costPerUnit(ing) * number(item.quantity_used);
    }, 0);

    const extra = totalIngredients * (number(form.extra_percent) / 100);
    const withExtra = totalIngredients + extra;
    const withProfit = withExtra * number(form.profit_multiplier || 1);
    const yieldQuantity = number(form.yield_quantity || 1) || 1;
    const pricePerUnit = withProfit / yieldQuantity;
    const finalPrice = pricePerUnit + number(form.individual_package_cost);

    return { totalIngredients, extra, withExtra, withProfit, pricePerUnit, finalPrice };
  }

  async function saveRecipe(e) {
    e.preventDefault();
    const calc = calculateRecipe(recipeForm);
    const payload = { ...recipeForm, sale_price: recipeForm.sale_price || calc.finalPrice };

    const url = editingRecipe ? `/api/recipes/${editingRecipe}` : '/api/recipes';
    const method = editingRecipe ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Erro ao salvar receita.');
      return;
    }

    setRecipeForm(emptyRecipe);
    setEditingRecipe(null);
    setMessage('Receita/produto salvo!');
    loadData();
  }

  function editRecipe(recipe) {
    setEditingRecipe(recipe.id);
    setRecipeForm({
      name: recipe.name || '',
      extra_percent: recipe.extra_percent ?? 25,
      profit_multiplier: recipe.profit_multiplier ?? 3,
      yield_quantity: recipe.yield_quantity ?? 1,
      individual_package_cost: recipe.individual_package_cost ?? 0,
      sale_price: recipe.sale_price || '',
      notes: recipe.notes || '',
      items: recipe.recipe_items?.length
        ? recipe.recipe_items.map((item) => ({ ingredient_id: item.ingredient_id, quantity_used: item.quantity_used }))
        : [{ ingredient_id: '', quantity_used: '' }]
    });
    setTab('receitas');
  }

  async function deleteRecipe(id) {
    if (!confirm('Apagar receita/produto?')) return;
    await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
    setMessage('Receita apagada.');
    loadData();
  }

  async function saveOrder(e) {
    e.preventDefault();
    const quantity = number(orderForm.quantity || 1);
    const unitPrice = number(orderForm.unit_price);
    const total = orderForm.total_price || quantity * unitPrice;
    const payload = { ...orderForm, total_price: total };

    const url = editingOrder ? `/api/orders/${editingOrder}` : '/api/orders';
    const method = editingOrder ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Erro ao salvar pedido.');
      return;
    }

    setOrderForm(emptyOrder);
    setEditingOrder(null);
    setMessage('Pedido salvo!');
    loadData();
  }

  function editOrder(order) {
    setEditingOrder(order.id);
    setOrderForm({
      order_date: order.order_date ? order.order_date.slice(0, 10) : today,
      client_name: order.client_name || '',
      product_name: order.product_name || '',
      quantity: order.quantity || 1,
      unit_price: order.unit_price || '',
      total_price: order.total_price || '',
      status: order.status || 'Pendente',
      payment_method: order.payment_method || 'Pix',
      notes: order.notes || ''
    });
    setTab('pedidos');
  }

  async function deleteOrder(id) {
    if (!confirm('Apagar pedido?')) return;
    await fetch(`/api/orders/${id}`, { method: 'DELETE' });
    setMessage('Pedido apagado.');
    loadData();
  }

  async function saveNote() {
    const res = await fetch('/api/notes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: note })
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Erro ao salvar anotação.');
      return;
    }

    setMessage('Anotações salvas!');
  }

  const stats = useMemo(() => {
    const currentDay = today;
    const currentMonth = today.slice(0, 7);
    const currentYear = today.slice(0, 4);
    const validOrders = orders.filter((o) => o.status !== 'Cancelado');

    const day = validOrders.filter((o) => (o.order_date || '').slice(0, 10) === currentDay).reduce((sum, o) => sum + number(o.total_price), 0);
    const month = validOrders.filter((o) => monthKey(o.order_date) === currentMonth).reduce((sum, o) => sum + number(o.total_price), 0);
    const year = validOrders.filter((o) => yearKey(o.order_date) === currentYear).reduce((sum, o) => sum + number(o.total_price), 0);

    return { day, month, year, ingredients: ingredients.length, recipes: recipes.length, orders: orders.length };
  }, [orders, ingredients, recipes]);

  const recipeCalc = calculateRecipe(recipeForm);

  const calcResult = useMemo(() => {
    const a = number(calc.a);
    const b = number(calc.b);
    if (calc.a === '' || calc.b === '') return '';
    if (calc.op === '+') return a + b;
    if (calc.op === '-') return a - b;
    if (calc.op === '*') return a * b;
    if (calc.op === '/') return b === 0 ? 'Não dividir por zero' : a / b;
    return '';
  }, [calc]);

  if (checking) return <div className="centerScreen">Carregando...</div>;

  if (!authenticated) {
    return (
      <main className="loginPage">
        <form className="loginCard" onSubmit={handleLogin}>
          <img src="/logo.png" alt="VilmaGourmet" />
          <span>Painel administrativo</span>
          <h1>Painel Vilma Gourmet</h1>
          <p>Entre para gerenciar ingredientes, receitas, pedidos e vendas.</p>

          <label>Email</label>
          <input type="email" value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} required />

          <label>Senha</label>
          <input type="password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} required />

          {loginError && <div className="alert error">{loginError}</div>}

          <button className="primaryBtn" type="submit">Entrar</button>
        </form>
      </main>
    );
  }

  return (
    <main className="adminShell">
      <aside className="sidebar">
        <div className="sideBrand">
          <img src="/logo.png" alt="VilmaGourmet" />
          <div><b>VilmaGourmet</b><span>Painel Admin</span></div>
        </div>

        <button className={tab === 'dashboard' ? 'active' : ''} onClick={() => setTab('dashboard')}>📊 Dashboard</button>
        <button className={tab === 'ingredientes' ? 'active' : ''} onClick={() => setTab('ingredientes')}>🥣 Ingredientes</button>
        <button className={tab === 'receitas' ? 'active' : ''} onClick={() => setTab('receitas')}>🍰 Receitas</button>
        <button className={tab === 'pedidos' ? 'active' : ''} onClick={() => setTab('pedidos')}>🛒 Pedidos</button>
        <button className={tab === 'notas' ? 'active' : ''} onClick={() => setTab('notas')}>📝 Bloco de notas</button>
        <button className={tab === 'calculadora' ? 'active' : ''} onClick={() => setTab('calculadora')}>🧮 Calculadora</button>

        <div className="sideBottom">
          <button onClick={loadData}>🔄 Atualizar</button>
          <button onClick={logout}>🚪 Sair</button>
        </div>
      </aside>

      <section className="content">
        <header className="contentHeader">
          <div><h1>{labels[tab]}</h1><p>Controle interno da VilmaGourmet</p></div>
        </header>

        {message && <div className="alert">{message}</div>}

        {tab === 'dashboard' && (
          <>
            <div className="statsGrid">
              <div><span>Vendido hoje</span><b>{money(stats.day)}</b></div>
              <div><span>Vendido no mês</span><b>{money(stats.month)}</b></div>
              <div><span>Vendido no ano</span><b>{money(stats.year)}</b></div>
              <div><span>Pedidos</span><b>{stats.orders}</b></div>
            </div>

            <div className="panelGrid">
              <div className="panel">
                <h2>Resumo</h2>
                <p className="bigLine">🥣 {stats.ingredients} ingredientes cadastrados</p>
                <p className="bigLine">🍰 {stats.recipes} receitas/produtos cadastrados</p>
                <p className="bigLine">🛒 {stats.orders} pedidos registrados</p>
              </div>

              <div className="panel">
                <h2>Últimos pedidos</h2>
                <OrdersTable orders={orders.slice(0, 5)} onEdit={editOrder} onDelete={deleteOrder} />
              </div>
            </div>
          </>
        )}

        {tab === 'ingredientes' && (
          <div className="panel">
            <h2>{editingIngredient ? 'Editar ingrediente' : 'Novo ingrediente'}</h2>

            <form className="formGrid" onSubmit={saveIngredient}>
              <input placeholder="Ingrediente" value={ingredientForm.name} onChange={(e) => setIngredientForm({ ...ingredientForm, name: e.target.value })} required />
              <input type="number" step="0.001" placeholder="Quantidade da embalagem" value={ingredientForm.package_quantity} onChange={(e) => setIngredientForm({ ...ingredientForm, package_quantity: e.target.value })} required />
              <select value={ingredientForm.package_unit} onChange={(e) => setIngredientForm({ ...ingredientForm, package_unit: e.target.value })}>
                <option value="g">g</option>
                <option value="ml">ml</option>
                <option value="un">un</option>
              </select>
              <input type="number" step="0.01" placeholder="Custo da embalagem" value={ingredientForm.package_cost} onChange={(e) => setIngredientForm({ ...ingredientForm, package_cost: e.target.value })} required />
              <input className="wide" placeholder="Observação" value={ingredientForm.notes} onChange={(e) => setIngredientForm({ ...ingredientForm, notes: e.target.value })} />
              <button className="primaryBtn" type="submit">{editingIngredient ? 'Salvar edição' : 'Adicionar ingrediente'}</button>
              {editingIngredient && <button className="ghostBtn" type="button" onClick={() => { setEditingIngredient(null); setIngredientForm(emptyIngredient); }}>Cancelar</button>}
            </form>

            <IngredientsTable ingredients={ingredients} onEdit={editIngredient} onDelete={deleteIngredient} />
          </div>
        )}

        {tab === 'receitas' && (
          <div className="panel">
            <h2>{editingRecipe ? 'Editar receita/produto' : 'Nova receita/produto'}</h2>
            <p className="muted">Essa área funciona como uma calculadora de precificação mais fácil que planilha.</p>

            <form onSubmit={saveRecipe}>
              <div className="recipeFormNamed">
                <label>
                  Nome do produto/receita
                  <input placeholder="Ex: Bolo de chocolate" value={recipeForm.name} onChange={(e) => setRecipeForm({ ...recipeForm, name: e.target.value })} required />
                </label>

                <label>
                  Custos extras (%)
                  <input type="number" step="0.01" placeholder="Ex: 25" value={recipeForm.extra_percent} onChange={(e) => setRecipeForm({ ...recipeForm, extra_percent: e.target.value })} />
                </label>

                <label>
                  Multiplicador de lucro/mão de obra
                  <input type="number" step="0.01" placeholder="Ex: 3" value={recipeForm.profit_multiplier} onChange={(e) => setRecipeForm({ ...recipeForm, profit_multiplier: e.target.value })} />
                </label>

                <label>
                  Rendimento / quantas unidades
                  <input type="number" step="0.01" placeholder="Ex: 12" value={recipeForm.yield_quantity} onChange={(e) => setRecipeForm({ ...recipeForm, yield_quantity: e.target.value })} />
                </label>

                <label>
                  Preço da embalagem individual
                  <input type="number" step="0.01" placeholder="Ex: 1.50" value={recipeForm.individual_package_cost} onChange={(e) => setRecipeForm({ ...recipeForm, individual_package_cost: e.target.value })} />
                </label>

                <label>
                  Preço de venda manual/opcional
                  <input type="number" step="0.01" placeholder="Se deixar vazio, usa o sugerido" value={recipeForm.sale_price} onChange={(e) => setRecipeForm({ ...recipeForm, sale_price: e.target.value })} />
                </label>

                <label className="wide">
                  Observação
                  <input placeholder="Anotações sobre essa receita" value={recipeForm.notes} onChange={(e) => setRecipeForm({ ...recipeForm, notes: e.target.value })} />
                </label>
              </div>

              <div className="pricingLayout">
                <div className="itemsBox">
                  <div className="itemsHeader">
                    <div>
                      <h3>Ingredientes da receita</h3>
                      <p className="muted">Selecione o ingrediente e informe a quantidade usada. O custo será calculado automaticamente.</p>
                    </div>
                    <button className="ghostBtn smallBtn" type="button" onClick={addRecipeItem}>+ Adicionar</button>
                  </div>

                  <div className="pricingTable">
                    <div className="pricingRow pricingHead">
                      <span>Ingrediente</span>
                      <span>Custo embalagem</span>
                      <span>Quantidade embalagem</span>
                      <span>Quantidade usada</span>
                      <span>Quanto custou</span>
                      <span>Ação</span>
                    </div>

                    {recipeForm.items.map((item, index) => {
                      const ing = ingredients.find((i) => i.id === item.ingredient_id);
                      const itemCost = ing ? costPerUnit(ing) * number(item.quantity_used) : 0;

                      return (
                        <div className="pricingRow" key={index}>
                          <select value={item.ingredient_id} onChange={(e) => updateRecipeItem(index, 'ingredient_id', e.target.value)}>
                            <option value="">Selecione</option>
                            {ingredients.map((ingredient) => <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>)}
                          </select>

                          <strong>{ing ? money(ing.package_cost) : '-'}</strong>
                          <strong>{ing ? formatQuantity(ing.package_quantity, ing.package_unit) : '-'}</strong>

                          <div className="quantityInputWrap">
                            <input type="number" step="0.001" placeholder="Quantidade usada" value={item.quantity_used} onChange={(e) => updateRecipeItem(index, 'quantity_used', e.target.value)} />
                            <small>{ing ? `em ${ing.package_unit}` : 'selecione o ingrediente'}</small>
                          </div>

                          <div className="itemCost">{money(itemCost)}</div>
                          <button className="tableBtn danger" type="button" onClick={() => removeRecipeItem(index)}>Remover</button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="finalAccounts">
                  <h3>Contas Finais</h3>

                  <div className="accountLine">
                    <span>Total custo dos ingredientes</span>
                    <b>{money(recipeCalc.totalIngredients)}</b>
                  </div>

                  <div className="accountLine">
                    <span>Adiciona {recipeForm.extra_percent || 0}% de custos extras</span>
                    <b>{money(recipeCalc.extra)}</b>
                  </div>

                  <div className="accountLine">
                    <span>Subtotal com custos extras</span>
                    <b>{money(recipeCalc.withExtra)}</b>
                  </div>

                  <div className="accountLine">
                    <span>Multiplica por {recipeForm.profit_multiplier || 0} lucro/mão de obra</span>
                    <b>{money(recipeCalc.withProfit)}</b>
                  </div>

                  <div className="accountLine">
                    <span>Rendimento / quantas unidades</span>
                    <b>{recipeForm.yield_quantity || 1}</b>
                  </div>

                  <div className="accountLine">
                    <span>Preço por unidade</span>
                    <b>{money(recipeCalc.pricePerUnit)}</b>
                  </div>

                  <div className="accountLine">
                    <span>Preço embalagem individual</span>
                    <b>{money(recipeForm.individual_package_cost)}</b>
                  </div>

                  <div className="accountLine final">
                    <span>Preço final de venda por unidade</span>
                    <b>{money(recipeCalc.finalPrice)}</b>
                  </div>
                </div>
              </div>

              <button className="primaryBtn" type="submit">{editingRecipe ? 'Salvar edição' : 'Salvar receita'}</button>
              {editingRecipe && <button className="ghostBtn marginLeft" type="button" onClick={() => { setEditingRecipe(null); setRecipeForm(emptyRecipe); }}>Cancelar</button>}
            </form>

            <RecipesList recipes={recipes} onEdit={editRecipe} onDelete={deleteRecipe} />
          </div>
        )}

        {tab === 'pedidos' && (
          <div className="panel">
            <h2>{editingOrder ? 'Editar pedido' : 'Novo pedido'}</h2>

            <form className="formGrid" onSubmit={saveOrder}>
              <input type="date" value={orderForm.order_date} onChange={(e) => setOrderForm({ ...orderForm, order_date: e.target.value })} required />
              <input placeholder="Cliente" value={orderForm.client_name} onChange={(e) => setOrderForm({ ...orderForm, client_name: e.target.value })} required />
              <input placeholder="Produto" value={orderForm.product_name} onChange={(e) => setOrderForm({ ...orderForm, product_name: e.target.value })} required />
              <input type="number" step="0.01" placeholder="Quantidade" value={orderForm.quantity} onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value, total_price: number(e.target.value) * number(orderForm.unit_price) })} />
              <input type="number" step="0.01" placeholder="Preço unitário" value={orderForm.unit_price} onChange={(e) => setOrderForm({ ...orderForm, unit_price: e.target.value, total_price: number(orderForm.quantity) * number(e.target.value) })} />
              <input type="number" step="0.01" placeholder="Total" value={orderForm.total_price} onChange={(e) => setOrderForm({ ...orderForm, total_price: e.target.value })} />
              <select value={orderForm.status} onChange={(e) => setOrderForm({ ...orderForm, status: e.target.value })}>
                <option>Pendente</option>
                <option>Em preparo</option>
                <option>Entregue</option>
                <option>Cancelado</option>
              </select>
              <select value={orderForm.payment_method} onChange={(e) => setOrderForm({ ...orderForm, payment_method: e.target.value })}>
                <option>Pix</option>
                <option>Dinheiro</option>
                <option>Cartão</option>
                <option>Outro</option>
              </select>
              <input className="wide" placeholder="Observação" value={orderForm.notes} onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })} />
              <button className="primaryBtn" type="submit">{editingOrder ? 'Salvar edição' : 'Adicionar pedido'}</button>
              {editingOrder && <button className="ghostBtn" type="button" onClick={() => { setEditingOrder(null); setOrderForm(emptyOrder); }}>Cancelar</button>}
            </form>

            <OrdersTable orders={orders} onEdit={editOrder} onDelete={deleteOrder} />
          </div>
        )}

        {tab === 'notas' && (
          <div className="panel">
            <h2>Bloco de notas</h2>
            <p className="muted">Anote compras, pedidos, ideias, clientes e lembretes.</p>
            <textarea className="notesArea" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Digite suas anotações..." />
            <button className="primaryBtn" onClick={saveNote}>Salvar anotações</button>
          </div>
        )}

        {tab === 'calculadora' && (
          <div className="panel calculatorPanel">
            <h2>Calculadora</h2>
            <div className="calculator">
              <input type="number" value={calc.a} onChange={(e) => setCalc({ ...calc, a: e.target.value })} placeholder="Valor 1" />
              <select value={calc.op} onChange={(e) => setCalc({ ...calc, op: e.target.value })}>
                <option value="+">+</option>
                <option value="-">-</option>
                <option value="*">×</option>
                <option value="/">÷</option>
              </select>
              <input type="number" value={calc.b} onChange={(e) => setCalc({ ...calc, b: e.target.value })} placeholder="Valor 2" />
            </div>
            <div className="calcResult">Resultado: <b>{typeof calcResult === 'number' ? money(calcResult) : calcResult || '---'}</b></div>
          </div>
        )}
      </section>
    </main>
  );
}

const labels = {
  dashboard: 'Dashboard',
  ingredientes: 'Ingredientes',
  receitas: 'Receitas e Produtos',
  pedidos: 'Pedidos',
  notas: 'Bloco de notas',
  calculadora: 'Calculadora'
};

function IngredientsTable({ ingredients, onEdit, onDelete }) {
  if (!ingredients.length) return <p className="muted">Nenhum ingrediente cadastrado ainda.</p>;

  return (
    <div className="responsiveTable">
      <table>
        <thead><tr><th>Ingrediente</th><th>Quantidade embalagem</th><th>Custo</th><th>Custo por unidade</th><th>Ações</th></tr></thead>
        <tbody>
          {ingredients.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{formatQuantity(item.package_quantity, item.package_unit)}</td>
              <td>{money(item.package_cost)}</td>
              <td>{money(costPerUnit(item))} / {item.package_unit}</td>
              <td><button className="tableBtn" onClick={() => onEdit(item)}>Editar</button><button className="tableBtn danger" onClick={() => onDelete(item.id)}>Apagar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecipesList({ recipes, onEdit, onDelete }) {
  if (!recipes.length) return <p className="muted">Nenhuma receita/produto cadastrado ainda.</p>;

  return (
    <div className="recipesGrid">
      {recipes.map((recipe) => (
        <div className="recipeCard" key={recipe.id}>
          <span>Produto</span>
          <h3>{recipe.name}</h3>
          <p>{recipe.recipe_items?.length || 0} ingrediente(s)</p>
          <b>{money(recipe.sale_price)}</b>
          <div className="rowActions">
            <button className="tableBtn" onClick={() => onEdit(recipe)}>Editar</button>
            <button className="tableBtn danger" onClick={() => onDelete(recipe.id)}>Apagar</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function OrdersTable({ orders, onEdit, onDelete }) {
  if (!orders.length) return <p className="muted">Nenhum pedido cadastrado ainda.</p>;

  return (
    <div className="responsiveTable">
      <table>
        <thead><tr><th>Data</th><th>Cliente</th><th>Contato/Endereço</th><th>Produto</th><th>Qtd.</th><th>Total</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{(order.order_date || '').slice(0, 10)}</td>
              <td>{order.client_name}</td>
              <td><div className="orderContact">{order.customer_phone && <b>{order.customer_phone}</b>}{order.customer_address && <span>{order.customer_address}, nº {order.customer_number} - {order.customer_neighborhood}</span>}{order.customer_complement && <small>{order.customer_complement}</small>}{order.payment_status && <small>Pagamento: {order.payment_status}</small>}</div></td>
              <td>{order.product_name}</td>
              <td>{order.quantity}</td>
              <td>{money(order.total_price)}</td>
              <td>{order.status}</td>
              <td><button className="tableBtn" onClick={() => onEdit(order)}>Editar</button><button className="tableBtn danger" onClick={() => onDelete(order.id)}>Apagar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
