type HierarchicalCategories = Readonly<{
  lvl0?: string[];
  lvl1?: string[];
}>;

export interface Product {
  readonly brand?: string;
  readonly categories?: string[] | string;
  readonly color?: string;
  readonly description?: string;
  readonly free_shipping?: boolean;
  readonly hierarchicalCategories?: HierarchicalCategories;
  readonly image?: string;
  readonly name: string;
  readonly objectID: string;
  readonly popularity?: number;
  readonly price: number;
  readonly currency?: string;
  readonly price_range?: string;
  readonly rating?: number;
  readonly type?: string;
  readonly url?: string;
}
