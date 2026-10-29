export type AlgorithmCategory = 'sorting' | 'searching';

export type AlgorithmId =
  | 'bubble-sort'
  | 'selection-sort'
  | 'insertion-sort'
  | 'merge-sort'
  | 'quick-sort'
  | 'heap-sort'
  | 'linear-search'
  | 'binary-search'
  | 'jump-search'
  | 'interpolation-search';

export type ElementState =
  | 'default'
  | 'comparing'
  | 'swapping'
  | 'pivot'
  | 'sorted'
  | 'found'
  | 'eliminated'
  | 'bound';

export interface PointerMarker {
  index: number;
  label: string;
}

export interface AlgorithmStep {
  array: number[];
  states: Record<number, ElementState>;
  pointers: PointerMarker[];
  activeRange?: [number, number]; // inclusive [low, high] for search or partition range
  line: number; // 1-indexed line in source code
  message: string;
  operationType: 'init' | 'compare' | 'swap' | 'overwrite' | 'pivot' | 'partition' | 'sorted' | 'found' | 'not-found' | 'bound';
  comparisons: number;
  swaps: number;
  arrayAccesses: number;
  variables?: Record<string, string | number>;
}

export interface CodeLine {
  lineNumber: number;
  code: string;
  indent: number;
}

export interface ComplexitySpec {
  bestTime: string;
  averageTime: string;
  worstTime: string;
  space: string;
  stable?: string;
  inPlace?: string;
  precondition?: string;
}

export interface AlgorithmMetadata {
  id: AlgorithmId;
  name: string;
  category: AlgorithmCategory;
  shortDescription: string;
  keyInsight: string;
  invariants: string[];
  whenToUse: string[];
  limitations: string[];
  complexity: ComplexitySpec;
  codeLines: CodeLine[];
}

export type ArrayPreset = 'random' | 'nearly-sorted' | 'reversed' | 'few-unique' | 'sorted';

export type ActiveTab = 'visualizer' | 'compare' | 'algorithms' | 'learn';
