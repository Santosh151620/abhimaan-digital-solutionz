export interface CommandItem {
  id: string;
  title: string;

  subtitle?: string;
  group?: string;

  shortcut?: string;

  icon?: string;
  badge?: string;

  keywords?: string[];

  priority?: number;

  disabled?: boolean;
  hidden?: boolean;

  action?: string;
  route?: string;

  run: () => void;
}
