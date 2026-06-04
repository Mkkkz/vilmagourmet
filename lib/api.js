import { NextResponse } from 'next/server';
import { isAuthenticated } from './auth';

export function requireAdmin() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }
  return null;
}

export function errorResponse(error, status = 500) {
  console.error(error);
  return NextResponse.json(
    { error: error?.message || 'Erro interno.' },
    { status }
  );
}

export function numberValue(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}
