export interface Category {
  id: number;
  name: string;
  slug: string;
  display_order: number;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  display_order: number;
}
