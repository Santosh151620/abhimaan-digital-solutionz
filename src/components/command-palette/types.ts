export interface CommandAction {
  id: string;
  title: string;
  subtitle?: string;
  group?: string;
  shortcut?: string;
  icon?: React.ReactNode;
  run: () => void;
}
