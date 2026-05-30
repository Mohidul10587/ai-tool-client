# Category & Subcategory System

## Database Setup

Run the migration in your Supabase SQL Editor:
```sql
-- Execute: supabase-migrations/categories_subcategories.sql
```

This creates:
- `categories` table (main categories)
- `subcategories` table (linked to categories)
- Updates `tool_submissions` with category/subcategory fields and snapshots

## Features

### Admin Panel (`/admin/categories`)
- Create/edit/delete categories
- Manage subcategories within each category
- Each category and subcategory has a unique slug for URLs

### Submission Management (`/admin/submissions`)
- Select category and subcategory for each submission
- Saves both:
  - **IDs** (`category_id`, `subcategory_id`) - for filtering/queries
  - **Snapshots** (`category_snapshot`, `subcategory_snapshot`) - preserves names even if category is renamed/deleted

### Navbar
- Dynamically loads categories and subcategories
- Links to `/category/{subcategory-slug}`

## Filtering Tools by Category/Subcategory

Query submissions by category:
```typescript
const { data } = await supabase
  .from("tool_submissions")
  .select("*")
  .eq("category_id", categoryId)
  .eq("status", "published");
```

Query by subcategory:
```typescript
const { data } = await supabase
  .from("tool_submissions")
  .select("*")
  .eq("subcategory_id", subcategoryId)
  .eq("status", "published");
```

## Data Structure

**Categories:**
- id, name, slug, display_order

**Subcategories:**
- id, category_id, name, slug, display_order

**Submissions:**
- category_id, subcategory_id (for filtering)
- category_snapshot, subcategory_snapshot (for display)

