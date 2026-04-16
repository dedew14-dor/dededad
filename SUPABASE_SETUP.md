# Supabase Database Schema for Absensi SMK Prima Unggul

To run this application, you need to set up the following tables and policies in your Supabase project.

## 1. Profiles Table
Stores user roles and basic info.

```sql
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text not null,
  role text check (role in ('admin', 'guru', 'staf')) default 'staf' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security
alter table public.profiles enable row level security;

create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using ( true );

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using ( auth.uid() = id );
```

## 2. Students Table
Stores student data.

```sql
create table public.students (
  id uuid default gen_random_uuid() primary key,
  nis text unique not null,
  name text not null,
  class_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security
alter table public.students enable row level security;

create policy "Students viewable by authenticated"
  on public.students for select
  to authenticated
  using ( true );

create policy "Only admin can manage students"
  on public.students for all
  to authenticated
  using ( (select role from profiles where id = auth.uid()) = 'admin' );
```

## 3. Attendances Table
Stores logs for both employees and students.

```sql
create table public.attendances (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  student_id uuid references public.students(id),
  type text check (type in ('employee', 'student')) not null,
  status text check (status in ('present', 'absent', 'late', 'excused')) not null,
  date date default current_date not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  -- Ensure one entry per student/date or user/date
  unique(user_id, date, type),
  unique(student_id, date, type)
);

-- Row Level Security
alter table public.attendances enable row level security;

create policy "Attendances viewable by authenticated"
  on public.attendances for select
  to authenticated
  using ( true );

create policy "Authenticated can insert attendance"
  on public.attendances for insert
  to authenticated
  with check ( true );
```

## 4. Trigger for Profile Creation
Automatically create a profile when a new user signs up.

```sql
-- Create a function to handle new user signups
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'name', 'User'),
    -- Set first user as admin, others as staff by default
    case when (select count(*) from public.profiles) = 0 then 'admin' else 'staf' end
  );
  return new;
end;
$$ language plpgsql security modeller;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```
