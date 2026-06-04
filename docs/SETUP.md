# Setup Neon + Vercel

## 1. Neon

No painel do Neon:

SQL Editor > New Query

Cole o conteúdo de `neon.sql` e clique em **Run**.

## 2. Vercel

No projeto da Vercel:

Settings > Environment Variables

Adicione:

```env
DATABASE_URL=postgresql://...
ADMIN_EMAIL=email_do_painel
ADMIN_PASSWORD=senha_do_painel
SESSION_SECRET=um_texto_grande_aleatorio
```

Depois faça **Redeploy**.

## 3. Painel

Acesse:

```txt
https://seusite.vercel.app/admin
```
