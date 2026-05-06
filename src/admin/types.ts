// Types et interfaces pour l'admin

export interface UserProfile {
  id: string;
  name: string;
  surname: string;
  email: string;
  photo?: string;
  role: string;
}

export type FieldType = 'text' | 'email' | 'number' | 'date' | 'datetime-local' | 'file_url' | 'select' | 'textarea' | 'rich_text' | 'single_image' | 'multiple_images';

export interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
}

export type TableSchemaMap = Record<string, FieldSchema[]>;

export interface NavItem {
  id: string;
  label: string;
  icon: any;
}
