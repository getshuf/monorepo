export interface MetaDefinition {
  type: string;
  key: string;
  default: any;
  showOnCLI?: boolean;
  description?: string;
  action?: (store: any) => Promise<void> | void;
}
