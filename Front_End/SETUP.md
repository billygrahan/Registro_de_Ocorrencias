# 🚀 Frontend - Pronto para Usar

## 📦 Instalação

```bash
# Limpar cache antigo
rm -rf node_modules package-lock.json
npm install

# Iniciar desenvolvimento
npm run dev
```

**URL**: http://localhost:3666

---

## ✅ O que foi criado

### **Estrutura Base**
- ✅ `package.json` - Dependências corrigidas (sem erros)
- ✅ `tsconfig.json` - TypeScript
- ✅ `tailwind.config.ts` - Tailwind CSS
- ✅ `.env.local` - Variáveis de ambiente

### **Integração GraphQL**
- ✅ `lib/graphql.ts` - Client GraphQL com suporte a token
- ✅ `hooks/useAuth.ts` - Hook de autenticação com backend
- ✅ `hooks/useGraphQL.ts` - Hook genérico para queries

### **Páginas**
- ✅ `app/login/page.tsx` - Login **conectado ao backend**
- ✅ `app/painel/mecanica/page.tsx` - Incidentes **conectado ao backend**

---

## 🔑 Credenciais de Teste

Após instalar e iniciar o frontend, use essas credenciais (configuradas no backend `.env`):

- **Email**: cualquer email (ex: admin@test.com)
- **Senha**: `senha123` (configurable em `AUTH_PASSWORD` do backend)

---

## 🔄 Fluxo de Funcionamento

### **1. Login**
```
Frontend → GraphQL Mutation `login` → Backend → JWT Token
            ↓
         localStorage['authToken']
```

### **2. Acesso Protegido**
```
Frontend → useAuth() → verificar token
   ↓
Se SEM token → redireciona para /login
Se COM token → acessa /painel/mecanica
```

### **3. Buscar Incidentes**
```
Frontend (useGraphQL) → Query `serviceOrders` com token → Backend → Lista de incidentes
```

### **4. Criar Incidente**
```
Frontend (form) → Mutation `createServiceOrder` → Backend → Novo incidente criado
```

---

## 📋 Checklist Pronto

- [x] Frontend estruturado
- [x] GraphQL integrado com token
- [x] Autenticação funcional
- [x] Página de login conectada
- [x] Página de incidentes conectada
- [ ] Testar login (você deve testar)
- [ ] Testar criar incidente (você deve testar)

---

## 🐛 Se houver erro ao instalar

Se ainda der erro com `npm install`, remova node_modules:

```bash
rm -rf node_modules package-lock.json yarn.lock
npm cache clean --force
npm install
```

---

## 🎯 Próximos Passos (Opcionais)

1. Deletar incidente (mutation)
2. Editar incidente que precisa terminar (mutation)
3. Exportar relatório PDF
4. Integrar com mais módulos do painel
5. Melhorar UI/UX conforme necessário

---

**Status**: ✅ Pronto para teste end-to-end com backend!
