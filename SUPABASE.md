# Supabase গাইড — AI Tools প্রজেক্ট

## ১. Supabase কী?

Supabase একটি open-source backend platform। এটি দেয়:

- **Authentication** — ইউজার রেজিস্ট্রেশন ও লগইন
- **Database** — PostgreSQL ডেটাবেজ
- **Storage** — ফাইল আপলোড

এই প্রজেক্টে এখন শুধু Authentication ব্যবহার হচ্ছে।

---

## ২. Environment Variables

`.env.local` ফাইলে Supabase-এর credentials রাখা আছে:

```env
NEXT_PUBLIC_SUPABASE_URL=https://gitnhcnhwkjyzebujsxn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_tOzNKGlBevvDdkQRV85LGg_9zzB6_he
```

> ⚠️ এই ফাইল কখনো GitHub-এ push করবেন না। `.gitignore`-এ আছে কিনা চেক করুন।

---

## ৩. Supabase Client ফাইলসমূহ

### `lib/supabase/client.ts` — Browser-এ ব্যবহারের জন্য

```ts
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
```

Client Component (`"use client"`) এর ভেতরে ব্যবহার করুন।

### `lib/supabase/server.ts` — Server-এ ব্যবহারের জন্য

```ts
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();
```

Server Component বা Server Action-এ ব্যবহার করুন।

---

## ৪. Authentication — কীভাবে কাজ করে

### রেজিস্ট্রেশন (`/register`)

ইউজার নাম, ইমেইল ও পাসওয়ার্ড দিয়ে সাইন আপ করে।

```ts
await supabase.auth.signUp({
  email,
  password,
  options: { data: { name, role: "user" } },
});
```

- `role: "user"` — ডিফল্ট রোল
- Supabase confirmation email পাঠাতে পারে (নিচে দেখুন কীভাবে বন্ধ করবেন)

### লগইন (`/login`)

```ts
await supabase.auth.signInWithPassword({ email, password });
```

### লগআউট

```ts
await supabase.auth.signOut();
```

---

## ৫. Route Protection — কে কোথায় যেতে পারবে

`proxy.ts` ফাইলটি প্রতিটি request-এ চলে এবং চেক করে:

| Route                 | শর্ত                                   |
| --------------------- | -------------------------------------- |
| `/dashboard`          | লগইন থাকতে হবে                         |
| `/admin`              | লগইন + `role: "admin"` থাকতে হবে       |
| `/login`, `/register` | লগইন থাকলে `/dashboard`-এ redirect হবে |

---

## ৬. Admin ইউজার বানানোর পদ্ধতি

Supabase Dashboard থেকে যেকোনো ইউজারকে admin করা যায়:

1. [supabase.com](https://supabase.com) → আপনার প্রজেক্টে যান
2. বাম মেনু → **Authentication** → **Users**
3. যে ইউজারকে admin করবেন তার উপর ক্লিক করুন
4. **Edit** বাটন চাপুন
5. `raw_user_meta_data` ফিল্ডে লিখুন:
   ```json
   { "name": "Admin Name", "role": "admin" }
   ```
6. **Save** করুন

এরপর সেই ইউজার `/admin` পেজে ঢুকতে পারবে।

---

## ৭. Email Confirmation বন্ধ করা (Development-এ)

রেজিস্ট্রেশনের পর সরাসরি লগইন করতে চাইলে:

1. Supabase Dashboard → **Authentication** → **Providers**
2. **Email** সেকশনে যান
3. **"Confirm email"** টগল বন্ধ করুন
4. Save করুন

---

## ৮. Database ব্যবহার (ভবিষ্যতে)

নতুন টেবিল থেকে ডেটা আনতে:

```ts
// Server Component-এ
const supabase = await createClient();
const { data, error } = await supabase.from("tools").select("*");
```

```ts
// Client Component-এ
const supabase = createClient();
const { data, error } = await supabase.from("tools").select("*");
```

---

## ৯. প্রজেক্টের Auth ফাইল স্ট্রাকচার

```
lib/
  supabase/
    client.ts        ← Browser client
    server.ts        ← Server client
  auth-actions.ts    ← register, login, logout functions

app/
  register/page.tsx  ← রেজিস্ট্রেশন পেজ
  login/page.tsx     ← লগইন পেজ
  dashboard/page.tsx ← ইউজার প্যানেল
  admin/page.tsx     ← অ্যাডমিন প্যানেল

proxy.ts             ← Route protection
.env.local           ← Supabase credentials
```

asma710587
