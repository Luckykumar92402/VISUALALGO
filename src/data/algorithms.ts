import { AlgorithmId, AlgorithmMetadata, AlgorithmStep, ArrayPreset, ElementState } from '../types/algorithm';

export const ALGORITHMS: Record<AlgorithmId, AlgorithmMetadata> = {
  'bubble-sort': {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    shortDescription: 'Repeatedly steps through the array, compares adjacent elements, and swaps them if they are in the wrong order. Larger elements "bubble" toward the end of the array after each full pass.',
    keyInsight: 'After pass i, the last i+1 elements are guaranteed to be in their final sorted positions. An early-exit flag stops execution immediately if a full pass completes with zero swaps.',
    invariants: [
      'Subarray A[n - i .. n - 1] contains the i largest elements in sorted order.',
      'All elements in A[0 .. n - i - 1] are less than or equal to A[n - i].'
    ],
    whenToUse: [
      'Detecting whether an already-sorted or nearly-sorted list has small local inversions in O(n) time.',
      'Teaching introductory loop invariants, swap mechanics, and asymptotic analysis.'
    ],
    limitations: [
      'Performs O(n²) comparisons and swaps on average and worst-case inputs.',
      'High write amplification compared to Selection Sort or Insertion Sort.'
    ],
    complexity: {
      bestTime: 'O(n)',
      averageTime: 'O(n²)',
      worstTime: 'O(n²)',
      space: 'O(1)',
      stable: 'Yes',
      inPlace: 'Yes'
    },
    codeLines: [
      { lineNumber: 1, indent: 0, code: 'function bubbleSort(A, n) {' },
      { lineNumber: 2, indent: 1, code: 'for (let i = 0; i < n - 1; i++) {' },
      { lineNumber: 3, indent: 2, code: 'let swapped = false;' },
      { lineNumber: 4, indent: 2, code: 'for (let j = 0; j < n - i - 1; j++) {' },
      { lineNumber: 5, indent: 3, code: 'if (A[j] > A[j + 1]) {' },
      { lineNumber: 6, indent: 4, code: 'swap(A, j, j + 1);' },
      { lineNumber: 7, indent: 4, code: 'swapped = true;' },
      { lineNumber: 8, indent: 3, code: '}' },
      { lineNumber: 9, indent: 2, code: '}' },
      { lineNumber: 10, indent: 2, code: 'if (!swapped) break;' },
      { lineNumber: 11, indent: 1, code: '}' },
      { lineNumber: 12, indent: 0, code: '}' },
    ]
  },

  'selection-sort': {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'sorting',
    shortDescription: 'Partitions the array into a sorted prefix and an unsorted suffix. In each iteration, scans the unsorted suffix to locate the minimum element and swaps it into the next position of the sorted prefix.',
    keyInsight: 'Minimizes the total number of memory writes to at most O(n) swaps, even though it always performs O(n²) comparisons regardless of initial array order.',
    invariants: [
      'Prefix A[0 .. i - 1] is sorted and contains the i smallest elements of the array.',
      'During the inner scan, minIdx always points to the smallest value in A[i .. j].'
    ],
    whenToUse: [
      'Environments where memory writes or flash/EEPROM cycles are significantly more expensive than reads.',
      'Small fixed-size arrays where predictable instruction count is preferred.'
    ],
    limitations: [
      'Insensitive to input order: takes O(n²) comparisons even on an already-sorted array.',
      'Unstable in its standard swap-based implementation.'
    ],
    complexity: {
      bestTime: 'O(n²)',
      averageTime: 'O(n²)',
      worstTime: 'O(n²)',
      space: 'O(1)',
      stable: 'No',
      inPlace: 'Yes'
    },
    codeLines: [
      { lineNumber: 1, indent: 0, code: 'function selectionSort(A, n) {' },
      { lineNumber: 2, indent: 1, code: 'for (let i = 0; i < n - 1; i++) {' },
      { lineNumber: 3, indent: 2, code: 'let minIdx = i;' },
      { lineNumber: 4, indent: 2, code: 'for (let j = i + 1; j < n; j++) {' },
      { lineNumber: 5, indent: 3, code: 'if (A[j] < A[minIdx]) {' },
      { lineNumber: 6, indent: 4, code: 'minIdx = j;' },
      { lineNumber: 7, indent: 3, code: '}' },
      { lineNumber: 8, indent: 2, code: '}' },
      { lineNumber: 9, indent: 2, code: 'if (minIdx !== i) swap(A, i, minIdx);' },
      { lineNumber: 10, indent: 1, code: '}' },
      { lineNumber: 11, indent: 0, code: '}' },
    ]
  },

  'insertion-sort': {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'sorting',
    shortDescription: 'Builds a sorted prefix one element at a time by taking the next unsorted element (key) and shifting larger elements in the sorted prefix one position to the right before inserting the key.',
    keyInsight: 'Highly adaptive: the number of comparisons and shifts is directly proportional to the number of inversions in the input. Used as the base-case sorter inside industrial Quick Sort and TimSort implementations.',
    invariants: [
      'At the start of iteration i, the subarray A[0 .. i - 1] consists of the original first i elements in sorted order.',
      'Elements in A[j + 1 .. i] are strictly greater than key.'
    ],
    whenToUse: [
      'Small arrays (typically n <= 32) or as the leaf cutoff in hybrid divide-and-conquer sorts.',
      'Streaming/online data where elements arrive sequentially and must be maintained in order.',
      'Nearly-sorted datasets where most elements are within k positions of their final index (runs in O(nk)).'
    ],
    limitations: [
      'Quadratic O(n²) runtime on reverse-ordered or uniform random large inputs.'
    ],
    complexity: {
      bestTime: 'O(n)',
      averageTime: 'O(n²)',
      worstTime: 'O(n²)',
      space: 'O(1)',
      stable: 'Yes',
      inPlace: 'Yes'
    },
    codeLines: [
      { lineNumber: 1, indent: 0, code: 'function insertionSort(A, n) {' },
      { lineNumber: 2, indent: 1, code: 'for (let i = 1; i < n; i++) {' },
      { lineNumber: 3, indent: 2, code: 'let key = A[i];' },
      { lineNumber: 4, indent: 2, code: 'let j = i - 1;' },
      { lineNumber: 5, indent: 2, code: 'while (j >= 0 && A[j] > key) {' },
      { lineNumber: 6, indent: 3, code: 'A[j + 1] = A[j];' },
      { lineNumber: 7, indent: 3, code: 'j = j - 1;' },
      { lineNumber: 8, indent: 2, code: '}' },
      { lineNumber: 9, indent: 2, code: 'A[j + 1] = key;' },
      { lineNumber: 10, indent: 1, code: '}' },
      { lineNumber: 11, indent: 0, code: '}' },
    ]
  },

  'merge-sort': {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    shortDescription: 'A divide-and-conquer algorithm that recursively splits the array into halves until reaching single-element subarrays, then merges adjacent sorted subarrays into a combined sorted range.',
    keyInsight: 'Guarantees worst-case O(n log n) time complexity and preserves relative order of equal keys (stability), trading off O(n) auxiliary buffer memory.',
    invariants: [
      'Before merge(A, left, mid, right), both A[left .. mid] and A[mid + 1 .. right] are sorted.',
      'At each step of the merge loop, A[left .. k - 1] contains the k - left smallest elements from L and R in sorted order.'
    ],
    whenToUse: [
      'Sorting linked lists or external storage streams where sequential access is fast and random access is costly.',
      'Applications requiring guaranteed O(n log n) worst-case performance and stability.'
    ],
    limitations: [
      'Requires O(n) auxiliary memory for array buffers.',
      'Higher constant overhead than in-place Quick Sort on in-memory primitive arrays.'
    ],
    complexity: {
      bestTime: 'O(n log n)',
      averageTime: 'O(n log n)',
      worstTime: 'O(n log n)',
      space: 'O(n)',
      stable: 'Yes',
      inPlace: 'No'
    },
    codeLines: [
      { lineNumber: 1, indent: 0, code: 'function mergeSort(A, left, right) {' },
      { lineNumber: 2, indent: 1, code: 'if (left >= right) return;' },
      { lineNumber: 3, indent: 1, code: 'let mid = Math.floor((left + right) / 2);' },
      { lineNumber: 4, indent: 1, code: 'mergeSort(A, left, mid);' },
      { lineNumber: 5, indent: 1, code: 'mergeSort(A, mid + 1, right);' },
      { lineNumber: 6, indent: 1, code: 'merge(A, left, mid, right);' },
      { lineNumber: 7, indent: 0, code: '}' },
      { lineNumber: 8, indent: 0, code: 'function merge(A, left, mid, right) {' },
      { lineNumber: 9, indent: 1, code: 'let L = A.slice(left, mid + 1), R = A.slice(mid + 1, right + 1);' },
      { lineNumber: 10, indent: 1, code: 'let i = 0, j = 0, k = left;' },
      { lineNumber: 11, indent: 1, code: 'while (i < L.length && j < R.length) {' },
      { lineNumber: 12, indent: 2, code: 'A[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];' },
      { lineNumber: 13, indent: 1, code: '}' },
      { lineNumber: 14, indent: 1, code: 'while (i < L.length) A[k++] = L[i++];' },
      { lineNumber: 15, indent: 1, code: 'while (j < R.length) A[k++] = R[j++];' },
      { lineNumber: 16, indent: 0, code: '}' },
    ]
  },

  'quick-sort': {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    shortDescription: 'Selects a pivot element and partitions the subarray so all elements less than or equal to the pivot precede it and all greater elements follow it, then recursively sorts both partitions in-place.',
    keyInsight: 'Lomuto and Hoare partitioning exhibit strong CPU cache locality and low inner-loop overhead, making Quick Sort faster in practice than Merge Sort or Heap Sort on contiguous memory.',
    invariants: [
      'During partition(A, low, high), elements in A[low .. i] are <= pivot.',
      'Elements in A[i + 1 .. j - 1] are strictly > pivot.',
      'After placing the pivot at i + 1, the pivot is at its exact final sorted index.'
    ],
    whenToUse: [
      'General-purpose in-memory sorting of primitive or value-type arrays where cache locality matters.',
      'When O(log n) stack space is preferred over O(n) auxiliary heap allocations.'
    ],
    limitations: [
      'Degrades to O(n²) time if pivot selection consistently picks extreme values (e.g., last-element pivot on already-sorted input).',
      'Not stable without additional index tracking.'
    ],
    complexity: {
      bestTime: 'O(n log n)',
      averageTime: 'O(n log n)',
      worstTime: 'O(n²)',
      space: 'O(log n)',
      stable: 'No',
      inPlace: 'Yes'
    },
    codeLines: [
      { lineNumber: 1, indent: 0, code: 'function quickSort(A, low, high) {' },
      { lineNumber: 2, indent: 1, code: 'if (low < high) {' },
      { lineNumber: 3, indent: 2, code: 'let p = partition(A, low, high);' },
      { lineNumber: 4, indent: 2, code: 'quickSort(A, low, p - 1);' },
      { lineNumber: 5, indent: 2, code: 'quickSort(A, p + 1, high);' },
      { lineNumber: 6, indent: 1, code: '}' },
      { lineNumber: 7, indent: 0, code: '}' },
      { lineNumber: 8, indent: 0, code: 'function partition(A, low, high) {' },
      { lineNumber: 9, indent: 1, code: 'let pivot = A[high], i = low - 1;' },
      { lineNumber: 10, indent: 1, code: 'for (let j = low; j < high; j++) {' },
      { lineNumber: 11, indent: 2, code: 'if (A[j] <= pivot) {' },
      { lineNumber: 12, indent: 3, code: 'i++; swap(A, i, j);' },
      { lineNumber: 13, indent: 2, code: '}' },
      { lineNumber: 14, indent: 1, code: '}' },
      { lineNumber: 15, indent: 1, code: 'swap(A, i + 1, high); return i + 1;' },
      { lineNumber: 16, indent: 0, code: '}' },
    ]
  },

  'heap-sort': {
    id: 'heap-sort',
    name: 'Heap Sort',
    category: 'sorting',
    shortDescription: 'Rearranges the array into an in-place binary Max-Heap in O(n) time, then repeatedly swaps the maximum root element A[0] with the end of the unsorted heap and restores the heap property via sift-down.',
    keyInsight: 'Combines the best structural properties of Merge Sort and Insertion Sort: guaranteed O(n log n) worst-case runtime with strictly O(1) auxiliary space.',
    invariants: [
      'After the build-max-heap phase, A[0 .. n - 1] satisfies the Max-Heap property: A[parent(k)] >= A[k].',
      'During extraction step i, A[0 .. i - 1] is a valid Max-Heap and A[i .. n - 1] is sorted.'
    ],
    whenToUse: [
      'Embedded or real-time systems requiring strict O(n log n) worst-case latency bounds with zero heap allocation (O(1) space).',
      'As the fallback sorter in Introsort when Quick Sort recursion depth exceeds 2 log₂(n).'
    ],
    limitations: [
      'Poor spatial locality: parent-child jumps (i -> 2i+1) cause frequent CPU cache misses on large arrays.',
      'Not stable.'
    ],
    complexity: {
      bestTime: 'O(n log n)',
      averageTime: 'O(n log n)',
      worstTime: 'O(n log n)',
      space: 'O(1)',
      stable: 'No',
      inPlace: 'Yes'
    },
    codeLines: [
      { lineNumber: 1, indent: 0, code: 'function heapSort(A, n) {' },
      { lineNumber: 2, indent: 1, code: 'for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {' },
      { lineNumber: 3, indent: 2, code: 'siftDown(A, n, i);' },
      { lineNumber: 4, indent: 1, code: '}' },
      { lineNumber: 5, indent: 1, code: 'for (let i = n - 1; i > 0; i--) {' },
      { lineNumber: 6, indent: 2, code: 'swap(A, 0, i);' },
      { lineNumber: 7, indent: 2, code: 'siftDown(A, i, 0);' },
      { lineNumber: 8, indent: 1, code: '}' },
      { lineNumber: 9, indent: 0, code: '}' },
      { lineNumber: 10, indent: 0, code: 'function siftDown(A, heapSize, root) {' },
      { lineNumber: 11, indent: 1, code: 'let largest = root, L = 2 * root + 1, R = 2 * root + 2;' },
      { lineNumber: 12, indent: 1, code: 'if (L < heapSize && A[L] > A[largest]) largest = L;' },
      { lineNumber: 13, indent: 1, code: 'if (R < heapSize && A[R] > A[largest]) largest = R;' },
      { lineNumber: 14, indent: 1, code: 'if (largest !== root) {' },
      { lineNumber: 15, indent: 2, code: 'swap(A, root, largest); siftDown(A, heapSize, largest);' },
      { lineNumber: 16, indent: 1, code: '}' },
      { lineNumber: 17, indent: 0, code: '}' },
    ]
  },

  'linear-search': {
    id: 'linear-search',
    name: 'Linear Search',
    category: 'searching',
    shortDescription: 'Sequentially inspects each element of the array from index 0 to n - 1 until the target value is matched or the entire collection has been exhausted.',
    keyInsight: 'The only general search algorithm that requires zero preprocessing or ordering assumptions on the input array.',
    invariants: [
      'At the start of iteration i, target does not appear in A[0 .. i - 1].'
    ],
    whenToUse: [
      'Unsorted arrays or one-off searches where sorting the dataset first (O(n log n)) would exceed the O(n) scan cost.',
      'Very small arrays (n <= 16) where sequential SIMD/cache-line scanning beats branch-heavy binary search.'
    ],
    limitations: [
      'Scales linearly O(n); impractical for repeated queries on large collections.'
    ],
    complexity: {
      bestTime: 'O(1)',
      averageTime: 'O(n)',
      worstTime: 'O(n)',
      space: 'O(1)',
      precondition: 'None (works on unsorted or sorted arrays)'
    },
    codeLines: [
      { lineNumber: 1, indent: 0, code: 'function linearSearch(A, n, target) {' },
      { lineNumber: 2, indent: 1, code: 'for (let i = 0; i < n; i++) {' },
      { lineNumber: 3, indent: 2, code: 'if (A[i] === target) {' },
      { lineNumber: 4, indent: 3, code: 'return i; // Target found' },
      { lineNumber: 5, indent: 2, code: '}' },
      { lineNumber: 6, indent: 1, code: '}' },
      { lineNumber: 7, indent: 1, code: 'return -1; // Target not in array' },
      { lineNumber: 8, indent: 0, code: '}' },
    ]
  },

  'binary-search': {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'searching',
    shortDescription: 'Repeatedly bisects a sorted search interval [low, high] by comparing the target value with the middle element A[mid], eliminating half of the remaining candidates on every comparison.',
    keyInsight: 'Reduces the search space exponentially: searching 1,000,000 sorted elements requires at most 20 comparisons.',
    invariants: [
      'If target exists in A, its index k satisfies low <= k <= high.',
      'Every iteration strictly shrinks the interval width (high - low) by at least half.'
    ],
    whenToUse: [
      'Any sorted random-access array subjected to repeated lookup or range queries.',
      'Finding lower/upper bounds or monotonic predicate transitions.'
    ],
    limitations: [
      'Requires the input array to be sorted in ascending order and support O(1) random indexing.'
    ],
    complexity: {
      bestTime: 'O(1)',
      averageTime: 'O(log n)',
      worstTime: 'O(log n)',
      space: 'O(1)',
      precondition: 'Sorted ascending array'
    },
    codeLines: [
      { lineNumber: 1, indent: 0, code: 'function binarySearch(A, n, target) {' },
      { lineNumber: 2, indent: 1, code: 'let low = 0, high = n - 1;' },
      { lineNumber: 3, indent: 1, code: 'while (low <= high) {' },
      { lineNumber: 4, indent: 2, code: 'let mid = Math.floor((low + high) / 2);' },
      { lineNumber: 5, indent: 2, code: 'if (A[mid] === target) return mid;' },
      { lineNumber: 6, indent: 2, code: 'if (A[mid] < target) {' },
      { lineNumber: 7, indent: 3, code: 'low = mid + 1;' },
      { lineNumber: 8, indent: 2, code: '} else {' },
      { lineNumber: 9, indent: 3, code: 'high = mid - 1;' },
      { lineNumber: 10, indent: 2, code: '}' },
      { lineNumber: 11, indent: 1, code: '}' },
      { lineNumber: 12, indent: 1, code: 'return -1;' },
      { lineNumber: 13, indent: 0, code: '}' },
    ]
  },

  'jump-search': {
    id: 'jump-search',
    name: 'Jump Search',
    category: 'searching',
    shortDescription: 'Advances through a sorted array in fixed block steps of size m = ⌊√n⌋ until finding an upper bound A[step] >= target, then performs a backward-bounded linear scan inside that block.',
    keyInsight: 'Balances block-jump count (n/m) and intra-block linear scan length (m), minimizing worst-case comparisons at m = √n while only jumping forward.',
    invariants: [
      'After the jumping loop terminates, all elements in A[0 .. prev - 1] are strictly less than target.',
      'If target is present, it resides within the bounded block A[prev .. min(step, n) - 1].'
    ],
    whenToUse: [
      'Sorted structures where jumping forward is cheaper than jumping backward, or as a two-level index over sequential blocks.'
    ],
    limitations: [
      'Asymptotically slower O(√n) than Binary Search O(log n) when full random access is available.'
    ],
    complexity: {
      bestTime: 'O(1)',
      averageTime: 'O(√n)',
      worstTime: 'O(√n)',
      space: 'O(1)',
      precondition: 'Sorted ascending array'
    },
    codeLines: [
      { lineNumber: 1, indent: 0, code: 'function jumpSearch(A, n, target) {' },
      { lineNumber: 2, indent: 1, code: 'let step = Math.floor(Math.sqrt(n)), prev = 0;' },
      { lineNumber: 3, indent: 1, code: 'while (A[Math.min(step, n) - 1] < target) {' },
      { lineNumber: 4, indent: 2, code: 'prev = step; step += Math.floor(Math.sqrt(n));' },
      { lineNumber: 5, indent: 2, code: 'if (prev >= n) return -1;' },
      { lineNumber: 6, indent: 1, code: '}' },
      { lineNumber: 7, indent: 1, code: 'for (let i = prev; i < Math.min(step, n); i++) {' },
      { lineNumber: 8, indent: 2, code: 'if (A[i] === target) return i;' },
      { lineNumber: 9, indent: 2, code: 'if (A[i] > target) break;' },
      { lineNumber: 10, indent: 1, code: '}' },
      { lineNumber: 11, indent: 1, code: 'return -1;' },
      { lineNumber: 12, indent: 0, code: '}' },
    ]
  },

  'interpolation-search': {
    id: 'interpolation-search',
    name: 'Interpolation Search',
    category: 'searching',
    shortDescription: 'Estimates the probable position of the target inside a sorted interval [low, high] using linear interpolation on the endpoint values A[low] and A[high], similar to looking up a name in a telephone directory.',
    keyInsight: 'Achieves O(log log n) average comparisons on uniformly distributed numeric keys by weighting the probe index toward whichever bound is numerically closer to the target.',
    invariants: [
      'Probe index pos is linearly interpolated within [low, high] whenever A[low] <= target <= A[high].',
      'Each mismatch eliminates either A[low .. pos] or A[pos .. high].'
    ],
    whenToUse: [
      'Large sorted arrays of uniformly distributed numerical keys (e.g., timestamps, sequential IDs, sensor tables).'
    ],
    limitations: [
      'Can degrade to O(n) worst-case time on exponentially skewed or heavily clustered key distributions.'
    ],
    complexity: {
      bestTime: 'O(1)',
      averageTime: 'O(log log n)',
      worstTime: 'O(n)',
      space: 'O(1)',
      precondition: 'Sorted ascending array (best on uniform keys)'
    },
    codeLines: [
      { lineNumber: 1, indent: 0, code: 'function interpolationSearch(A, n, target) {' },
      { lineNumber: 2, indent: 1, code: 'let low = 0, high = n - 1;' },
      { lineNumber: 3, indent: 1, code: 'while (low <= high && target >= A[low] && target <= A[high]) {' },
      { lineNumber: 4, indent: 2, code: 'if (low === high) return A[low] === target ? low : -1;' },
      { lineNumber: 5, indent: 2, code: 'let pos = low + Math.floor(((target - A[low]) * (high - low)) / (A[high] - A[low]));' },
      { lineNumber: 6, indent: 2, code: 'if (A[pos] === target) return pos;' },
      { lineNumber: 7, indent: 2, code: 'if (A[pos] < target) low = pos + 1;' },
      { lineNumber: 8, indent: 2, code: 'else high = pos - 1;' },
      { lineNumber: 9, indent: 1, code: '}' },
      { lineNumber: 10, indent: 1, code: 'return -1;' },
      { lineNumber: 11, indent: 0, code: '}' },
    ]
  },
};

export const SORTING_ALGORITHMS: AlgorithmId[] = [
  'bubble-sort',
  'selection-sort',
  'insertion-sort',
  'merge-sort',
  'quick-sort',
  'heap-sort',
];

export const SEARCHING_ALGORITHMS: AlgorithmId[] = [
  'linear-search',
  'binary-search',
  'jump-search',
  'interpolation-search',
];

export function generatePresetArray(size: number, preset: ArrayPreset, sortedRequired: boolean = false): number[] {
  const clampedSize = Math.max(4, Math.min(48, size));
  let arr: number[] = [];

  if (preset === 'sorted') {
    let val = 8;
    for (let i = 0; i < clampedSize; i++) {
      arr.push(val);
      val += Math.floor(Math.random() * 5) + 2;
    }
    return arr;
  }

  if (preset === 'reversed') {
    let val = 8 + clampedSize * 4;
    for (let i = 0; i < clampedSize; i++) {
      arr.push(val);
      val -= Math.floor(Math.random() * 4) + 2;
    }
  } else if (preset === 'nearly-sorted') {
    let val = 10;
    for (let i = 0; i < clampedSize; i++) {
      arr.push(val);
      val += Math.floor(Math.random() * 5) + 2;
    }
    // Introduce 2-3 small local swaps
    const swaps = Math.max(1, Math.floor(clampedSize / 6));
    for (let s = 0; s < swaps; s++) {
      const idx = Math.floor(Math.random() * (clampedSize - 1));
      const tmp = arr[idx];
      arr[idx] = arr[idx + 1];
      arr[idx + 1] = tmp;
    }
  } else if (preset === 'few-unique') {
    const domain = [14, 28, 42, 56, 70, 84];
    for (let i = 0; i < clampedSize; i++) {
      arr.push(domain[Math.floor(Math.random() * domain.length)]);
    }
  } else {
    // random distinct-ish values in [8, 98]
    const used = new Set<number>();
    for (let i = 0; i < clampedSize; i++) {
      let candidate = Math.floor(Math.random() * 88) + 8;
      let attempts = 0;
      while (used.has(candidate) && attempts < 20) {
        candidate = Math.floor(Math.random() * 88) + 8;
        attempts++;
      }
      used.add(candidate);
      arr.push(candidate);
    }
  }

  if (sortedRequired) {
    arr = [...arr].sort((a, b) => a - b);
  }

  return arr;
}

export function generateAlgorithmSteps(
  algorithmId: AlgorithmId,
  initialArray: number[],
  searchTarget: number = 42
): AlgorithmStep[] {
  const arr = [...initialArray];
  const n = arr.length;

  switch (algorithmId) {
    case 'bubble-sort':
      return generateBubbleSortSteps(arr, n);
    case 'selection-sort':
      return generateSelectionSortSteps(arr, n);
    case 'insertion-sort':
      return generateInsertionSortSteps(arr, n);
    case 'merge-sort':
      return generateMergeSortSteps(arr, n);
    case 'quick-sort':
      return generateQuickSortSteps(arr, n);
    case 'heap-sort':
      return generateHeapSortSteps(arr, n);
    case 'linear-search':
      return generateLinearSearchSteps(arr, n, searchTarget);
    case 'binary-search':
      return generateBinarySearchSteps(arr, n, searchTarget);
    case 'jump-search':
      return generateJumpSearchSteps(arr, n, searchTarget);
    case 'interpolation-search':
      return generateInterpolationSearchSteps(arr, n, searchTarget);
  }
}

function buildSortedTailStates(n: number, sortedStartIdx: number, extra: Record<number, ElementState> = {}): Record<number, ElementState> {
  const states: Record<number, ElementState> = {};
  for (let k = sortedStartIdx; k < n; k++) {
    states[k] = 'sorted';
  }
  return { ...states, ...extra };
}

function generateBubbleSortSteps(A: number[], n: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;

  steps.push({
    array: [...A],
    states: {},
    pointers: [],
    line: 1,
    message: `Initialized Bubble Sort on array of ${n} elements.`,
    operationType: 'init',
    comparisons,
    swaps,
    arrayAccesses: accesses,
    variables: { n }
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    const sortedTailStart = n - i;

    steps.push({
      array: [...A],
      states: buildSortedTailStates(n, sortedTailStart),
      pointers: [{ index: 0, label: 'j=0' }],
      activeRange: [0, n - i - 1],
      line: 3,
      message: `Pass ${i + 1}: scanning unsorted prefix A[0..${n - i - 1}].`,
      operationType: 'bound',
      comparisons,
      swaps,
      arrayAccesses: accesses,
      variables: { i, swapped: 'false', unsortedEnd: n - i - 1 }
    });

    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      accesses += 2;

      steps.push({
        array: [...A],
        states: buildSortedTailStates(n, sortedTailStart, {
          [j]: 'comparing',
          [j + 1]: 'comparing'
        }),
        pointers: [
          { index: j, label: 'j' },
          { index: j + 1, label: 'j+1' }
        ],
        activeRange: [0, n - i - 1],
        line: 5,
        message: `Comparing A[${j}] = ${A[j]} and A[${j + 1}] = ${A[j + 1]}.`,
        operationType: 'compare',
        comparisons,
        swaps,
        arrayAccesses: accesses,
        variables: { i, j, 'A[j]': A[j], 'A[j+1]': A[j + 1], swapped: String(swapped) }
      });

      if (A[j] > A[j + 1]) {
        const leftVal = A[j];
        const rightVal = A[j + 1];
        A[j] = rightVal;
        A[j + 1] = leftVal;
        swaps++;
        accesses += 4;
        swapped = true;

        steps.push({
          array: [...A],
          states: buildSortedTailStates(n, sortedTailStart, {
            [j]: 'swapping',
            [j + 1]: 'swapping'
          }),
          pointers: [
            { index: j, label: 'j' },
            { index: j + 1, label: 'j+1' }
          ],
          activeRange: [0, n - i - 1],
          line: 6,
          message: `Swapped ${leftVal} and ${rightVal} at indices ${j} and ${j + 1} (${leftVal} > ${rightVal}).`,
          operationType: 'swap',
          comparisons,
          swaps,
          arrayAccesses: accesses,
          variables: { i, j, 'A[j]': A[j], 'A[j+1]': A[j + 1], swapped: 'true' }
        });
      }
    }

    const newSortedStart = n - i - 1;
    if (!swapped) {
      const allSorted: Record<number, ElementState> = {};
      for (let k = 0; k < n; k++) allSorted[k] = 'sorted';
      steps.push({
        array: [...A],
        states: allSorted,
        pointers: [],
        line: 10,
        message: `Pass ${i + 1} completed with 0 swaps. Early exit triggered — array is fully sorted.`,
        operationType: 'sorted',
        comparisons,
        swaps,
        arrayAccesses: accesses,
        variables: { i, swapped: 'false' }
      });
      return steps;
    } else {
      steps.push({
        array: [...A],
        states: buildSortedTailStates(n, newSortedStart),
        pointers: [{ index: newSortedStart, label: 'sorted' }],
        line: 9,
        message: `Element ${A[newSortedStart]} locked in final sorted position at index ${newSortedStart}.`,
        operationType: 'sorted',
        comparisons,
        swaps,
        arrayAccesses: accesses,
        variables: { i, lockedIndex: newSortedStart, value: A[newSortedStart] }
      });
    }
  }

  const finalStates: Record<number, ElementState> = {};
  for (let k = 0; k < n; k++) finalStates[k] = 'sorted';
  steps.push({
    array: [...A],
    states: finalStates,
    pointers: [],
    line: 12,
    message: `Bubble Sort complete. Total comparisons: ${comparisons}, swaps: ${swaps}.`,
    operationType: 'sorted',
    comparisons,
    swaps,
    arrayAccesses: accesses,
    variables: { n }
  });

  return steps;
}

function generateSelectionSortSteps(A: number[], n: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;

  const prefixSorted = (count: number, extra: Record<number, ElementState> = {}) => {
    const s: Record<number, ElementState> = {};
    for (let k = 0; k < count; k++) s[k] = 'sorted';
    return { ...s, ...extra };
  };

  steps.push({
    array: [...A],
    states: {},
    pointers: [],
    line: 1,
    message: `Initialized Selection Sort on ${n} elements.`,
    operationType: 'init',
    comparisons,
    swaps,
    arrayAccesses: accesses,
    variables: { n }
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    accesses++;

    steps.push({
      array: [...A],
      states: prefixSorted(i, { [minIdx]: 'pivot' }),
      pointers: [{ index: i, label: 'i / min' }],
      activeRange: [i, n - 1],
      line: 3,
      message: `Pass ${i + 1}: initialized minimum candidate A[${minIdx}] = ${A[minIdx]}.`,
      operationType: 'pivot',
      comparisons,
      swaps,
      arrayAccesses: accesses,
      variables: { i, minIdx, 'A[minIdx]': A[minIdx] }
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      accesses += 2;

      steps.push({
        array: [...A],
        states: prefixSorted(i, {
          [minIdx]: 'pivot',
          [j]: 'comparing'
        }),
        pointers: [
          { index: i, label: 'i' },
          { index: minIdx, label: 'min' },
          { index: j, label: 'j' }
        ],
        activeRange: [i, n - 1],
        line: 5,
        message: `Comparing candidate A[${j}] = ${A[j]} against current minimum A[${minIdx}] = ${A[minIdx]}.`,
        operationType: 'compare',
        comparisons,
        swaps,
        arrayAccesses: accesses,
        variables: { i, j, minIdx, 'A[j]': A[j], 'A[minIdx]': A[minIdx] }
      });

      if (A[j] < A[minIdx]) {
        minIdx = j;
        steps.push({
          array: [...A],
          states: prefixSorted(i, { [minIdx]: 'pivot' }),
          pointers: [
            { index: i, label: 'i' },
            { index: minIdx, label: 'new min' }
          ],
          activeRange: [i, n - 1],
          line: 6,
          message: `New minimum found: A[${minIdx}] = ${A[minIdx]}.`,
          operationType: 'pivot',
          comparisons,
          swaps,
          arrayAccesses: accesses,
          variables: { i, j, minIdx, 'A[minIdx]': A[minIdx] }
        });
      }
    }

    if (minIdx !== i) {
      const valI = A[i];
      const valMin = A[minIdx];
      A[i] = valMin;
      A[minIdx] = valI;
      swaps++;
      accesses += 4;

      steps.push({
        array: [...A],
        states: prefixSorted(i, {
          [i]: 'swapping',
          [minIdx]: 'swapping'
        }),
        pointers: [
          { index: i, label: 'i' },
          { index: minIdx, label: 'minIdx' }
        ],
        line: 9,
        message: `Swapped minimum ${valMin} (index ${minIdx}) into sorted boundary index ${i}.`,
        operationType: 'swap',
        comparisons,
        swaps,
        arrayAccesses: accesses,
        variables: { i, minIdx, swappedValue: valMin }
      });
    } else {
      steps.push({
        array: [...A],
        states: prefixSorted(i + 1),
        pointers: [{ index: i, label: 'i' }],
        line: 9,
        message: `A[${i}] = ${A[i]} is already the minimum of the remaining suffix; no swap needed.`,
        operationType: 'sorted',
        comparisons,
        swaps,
        arrayAccesses: accesses,
        variables: { i, minIdx }
      });
    }
  }

  const finalStates: Record<number, ElementState> = {};
  for (let k = 0; k < n; k++) finalStates[k] = 'sorted';
  steps.push({
    array: [...A],
    states: finalStates,
    pointers: [],
    line: 11,
    message: `Selection Sort complete. Total comparisons: ${comparisons}, swaps: ${swaps}.`,
    operationType: 'sorted',
    comparisons,
    swaps,
    arrayAccesses: accesses,
    variables: { n }
  });

  return steps;
}

function generateInsertionSortSteps(A: number[], n: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;

  const prefixStates = (sortedCount: number, extra: Record<number, ElementState> = {}) => {
    const s: Record<number, ElementState> = {};
    for (let k = 0; k < sortedCount; k++) s[k] = 'sorted';
    return { ...s, ...extra };
  };

  steps.push({
    array: [...A],
    states: { 0: 'sorted' },
    pointers: [{ index: 0, label: 'sorted' }],
    line: 1,
    message: `Initialized Insertion Sort. Single-element prefix A[0] = ${A[0]} is trivially sorted.`,
    operationType: 'init',
    comparisons,
    swaps,
    arrayAccesses: accesses,
    variables: { n }
  });

  for (let i = 1; i < n; i++) {
    const key = A[i];
    let j = i - 1;
    accesses++;

    steps.push({
      array: [...A],
      states: prefixStates(i, { [i]: 'pivot' }),
      pointers: [
        { index: i, label: `key=${key}` },
        { index: j, label: 'j' }
      ],
      activeRange: [0, i],
      line: 3,
      message: `Selected key = A[${i}] = ${key} for insertion into sorted prefix A[0..${i - 1}].`,
      operationType: 'pivot',
      comparisons,
      swaps,
      arrayAccesses: accesses,
      variables: { i, key, j }
    });

    while (j >= 0) {
      comparisons++;
      accesses++;

      steps.push({
        array: [...A],
        states: prefixStates(i + 1, {
          [j]: 'comparing',
          [j + 1]: 'pivot'
        }),
        pointers: [
          { index: j, label: 'j' },
          { index: j + 1, label: `key=${key}` }
        ],
        activeRange: [0, i],
        line: 5,
        message: `Comparing A[${j}] = ${A[j]} with key = ${key}.`,
        operationType: 'compare',
        comparisons,
        swaps,
        arrayAccesses: accesses,
        variables: { i, j, 'A[j]': A[j], key }
      });

      if (A[j] > key) {
        const movedVal = A[j];
        A[j + 1] = movedVal;
        A[j] = key; // Visually show key sliding left so bars remain a true permutation
        swaps++;
        accesses += 2;

        steps.push({
          array: [...A],
          states: prefixStates(i + 1, {
            [j]: 'pivot',
            [j + 1]: 'swapping'
          }),
          pointers: [
            { index: j, label: `key=${key}` },
            { index: j + 1, label: 'shifted' }
          ],
          activeRange: [0, i],
          line: 6,
          message: `Shifted A[${j}] = ${movedVal} right to index ${j + 1} (${movedVal} > ${key}).`,
          operationType: 'overwrite',
          comparisons,
          swaps,
          arrayAccesses: accesses,
          variables: { i, j, shifted: movedVal, key }
        });
        j = j - 1;
      } else {
        break;
      }
    }

    A[j + 1] = key;
    accesses++;

    steps.push({
      array: [...A],
      states: prefixStates(i + 1, { [j + 1]: 'sorted' }),
      pointers: [{ index: j + 1, label: 'inserted' }],
      activeRange: [0, i],
      line: 9,
      message: `Inserted key ${key} at index ${j + 1}. Prefix A[0..${i}] is now sorted.`,
      operationType: 'sorted',
      comparisons,
      swaps,
      arrayAccesses: accesses,
      variables: { i, insertedAt: j + 1, key }
    });
  }

  const finalStates: Record<number, ElementState> = {};
  for (let k = 0; k < n; k++) finalStates[k] = 'sorted';
  steps.push({
    array: [...A],
    states: finalStates,
    pointers: [],
    line: 11,
    message: `Insertion Sort complete. Total comparisons: ${comparisons}, shifts: ${swaps}.`,
    operationType: 'sorted',
    comparisons,
    swaps,
    arrayAccesses: accesses,
    variables: { n }
  });

  return steps;
}

function generateMergeSortSteps(A: number[], n: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;

  steps.push({
    array: [...A],
    states: {},
    pointers: [],
    line: 1,
    message: `Initialized Merge Sort on A[0..${n - 1}].`,
    operationType: 'init',
    comparisons,
    swaps,
    arrayAccesses: accesses,
    variables: { left: 0, right: n - 1 }
  });

  function rangeStates(left: number, right: number, extra: Record<number, ElementState> = {}): Record<number, ElementState> {
    const s: Record<number, ElementState> = {};
    for (let idx = 0; idx < n; idx++) {
      if (idx < left || idx > right) {
        s[idx] = 'eliminated';
      }
    }
    return { ...s, ...extra };
  }

  function mergeSortRec(left: number, right: number) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);

    steps.push({
      array: [...A],
      states: rangeStates(left, right, { [mid]: 'bound' }),
      pointers: [
        { index: left, label: 'left' },
        { index: mid, label: 'mid' },
        { index: right, label: 'right' }
      ],
      activeRange: [left, right],
      line: 3,
      message: `Dividing A[${left}..${right}] at midpoint mid = ${mid} into A[${left}..${mid}] and A[${mid + 1}..${right}].`,
      operationType: 'partition',
      comparisons,
      swaps,
      arrayAccesses: accesses,
      variables: { left, mid, right }
    });

    mergeSortRec(left, mid);
    mergeSortRec(mid + 1, right);

    // Merge A[left..mid] and A[mid+1..right]
    const L = A.slice(left, mid + 1);
    const R = A.slice(mid + 1, right + 1);
    accesses += right - left + 1;

    let i = 0;
    let j = 0;
    let k = left;

    steps.push({
      array: [...A],
      states: rangeStates(left, right),
      pointers: [
        { index: left, label: 'L start' },
        { index: mid + 1, label: 'R start' }
      ],
      activeRange: [left, right],
      line: 9,
      message: `Merging sorted subarrays L = [${L.join(', ')}] and R = [${R.join(', ')}] into A[${left}..${right}].`,
      operationType: 'bound',
      comparisons,
      swaps,
      arrayAccesses: accesses,
      variables: { left, mid, right, '|L|': L.length, '|R|': R.length }
    });

    while (i < L.length && j < R.length) {
      comparisons++;
      accesses += 2;
      const leftIdx = left + i;
      const rightIdx = mid + 1 + j;

      steps.push({
        array: [...A],
        states: rangeStates(left, right, {
          [k]: 'comparing',
          [Math.min(right, rightIdx)]: 'comparing'
        }),
        pointers: [
          { index: k, label: `k=${k}` }
        ],
        activeRange: [left, right],
        line: 11,
        message: `Comparing L[${i}] = ${L[i]} and R[${j}] = ${R[j]} for write index k = ${k}.`,
        operationType: 'compare',
        comparisons,
        swaps,
        arrayAccesses: accesses,
        variables: { k, 'L[i]': L[i], 'R[j]': R[j] }
      });

      if (L[i] <= R[j]) {
        A[k] = L[i];
        i++;
      } else {
        A[k] = R[j];
        j++;
      }
      swaps++;
      accesses++;

      const mergedSoFar: Record<number, ElementState> = {};
      for (let m = left; m <= k; m++) mergedSoFar[m] = 'sorted';
      mergedSoFar[k] = 'swapping';

      steps.push({
        array: [...A],
        states: rangeStates(left, right, mergedSoFar),
        pointers: [{ index: k, label: `write ${A[k]}` }],
        activeRange: [left, right],
        line: 12,
        message: `Wrote ${A[k]} into A[${k}].`,
        operationType: 'overwrite',
        comparisons,
        swaps,
        arrayAccesses: accesses,
        variables: { k, written: A[k] }
      });

      k++;
    }

    while (i < L.length) {
      A[k] = L[i];
      i++;
      swaps++;
      accesses += 2;

      const mergedSoFar: Record<number, ElementState> = {};
      for (let m = left; m <= k; m++) mergedSoFar[m] = 'sorted';
      mergedSoFar[k] = 'swapping';

      steps.push({
        array: [...A],
        states: rangeStates(left, right, mergedSoFar),
        pointers: [{ index: k, label: `copy L` }],
        activeRange: [left, right],
        line: 14,
        message: `Copied remaining left-half element ${A[k]} into A[${k}].`,
        operationType: 'overwrite',
        comparisons,
        swaps,
        arrayAccesses: accesses,
        variables: { k, written: A[k] }
      });
      k++;
    }

    while (j < R.length) {
      A[k] = R[j];
      j++;
      swaps++;
      accesses += 2;

      const mergedSoFar: Record<number, ElementState> = {};
      for (let m = left; m <= k; m++) mergedSoFar[m] = 'sorted';
      mergedSoFar[k] = 'swapping';

      steps.push({
        array: [...A],
        states: rangeStates(left, right, mergedSoFar),
        pointers: [{ index: k, label: `copy R` }],
        activeRange: [left, right],
        line: 15,
        message: `Copied remaining right-half element ${A[k]} into A[${k}].`,
        operationType: 'overwrite',
        comparisons,
        swaps,
        arrayAccesses: accesses,
        variables: { k, written: A[k] }
      });
      k++;
    }

    const doneRange: Record<number, ElementState> = {};
    for (let m = left; m <= right; m++) doneRange[m] = 'sorted';
    steps.push({
      array: [...A],
      states: rangeStates(left, right, doneRange),
      pointers: [
        { index: left, label: 'left' },
        { index: right, label: 'right' }
      ],
      activeRange: [left, right],
      line: 6,
      message: `Subarray A[${left}..${right}] merged and sorted.`,
      operationType: 'sorted',
      comparisons,
      swaps,
      arrayAccesses: accesses,
      variables: { left, right }
    });
  }

  mergeSortRec(0, n - 1);

  const finalStates: Record<number, ElementState> = {};
  for (let k = 0; k < n; k++) finalStates[k] = 'sorted';
  steps.push({
    array: [...A],
    states: finalStates,
    pointers: [],
    line: 7,
    message: `Merge Sort complete. Total comparisons: ${comparisons}, buffer writes: ${swaps}.`,
    operationType: 'sorted',
    comparisons,
    swaps,
    arrayAccesses: accesses,
    variables: { n }
  });

  return steps;
}

function generateQuickSortSteps(A: number[], n: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;
  const lockedSorted = new Set<number>();

  function buildStates(low: number, high: number, extra: Record<number, ElementState> = {}): Record<number, ElementState> {
    const s: Record<number, ElementState> = {};
    for (let idx = 0; idx < n; idx++) {
      if (lockedSorted.has(idx)) {
        s[idx] = 'sorted';
      } else if (idx < low || idx > high) {
        s[idx] = 'eliminated';
      }
    }
    return { ...s, ...extra };
  }

  steps.push({
    array: [...A],
    states: {},
    pointers: [],
    line: 1,
    message: `Initialized Quick Sort (Lomuto partition scheme) on A[0..${n - 1}].`,
    operationType: 'init',
    comparisons,
    swaps,
    arrayAccesses: accesses,
    variables: { low: 0, high: n - 1 }
  });

  function quickSortRec(low: number, high: number) {
    if (low > high) return;
    if (low === high) {
      lockedSorted.add(low);
      steps.push({
        array: [...A],
        states: buildStates(low, high, { [low]: 'sorted' }),
        pointers: [{ index: low, label: 'base' }],
        line: 2,
        message: `Single-element partition A[${low}] = ${A[low]} is in its final sorted position.`,
        operationType: 'sorted',
        comparisons,
        swaps,
        arrayAccesses: accesses,
        variables: { low, high }
      });
      return;
    }

    const pivot = A[high];
    accesses++;
    let i = low - 1;

    steps.push({
      array: [...A],
      states: buildStates(low, high, { [high]: 'pivot' }),
      pointers: [
        { index: low, label: 'low' },
        { index: high, label: `pivot=${pivot}` }
      ],
      activeRange: [low, high],
      line: 9,
      message: `Partitioning A[${low}..${high}]: selected pivot A[${high}] = ${pivot}.`,
      operationType: 'pivot',
      comparisons,
      swaps,
      arrayAccesses: accesses,
      variables: { low, high, pivot, i }
    });

    for (let j = low; j < high; j++) {
      comparisons++;
      accesses++;

      const ptrs = [
        { index: j, label: 'j' },
        { index: high, label: `pivot=${pivot}` }
      ];
      if (i >= low) ptrs.push({ index: i, label: 'i' });

      steps.push({
        array: [...A],
        states: buildStates(low, high, {
          [high]: 'pivot',
          [j]: 'comparing',
          ...(i >= low ? { [i]: 'bound' } : {})
        }),
        pointers: ptrs,
        activeRange: [low, high],
        line: 11,
        message: `Comparing A[${j}] = ${A[j]} against pivot ${pivot}.`,
        operationType: 'compare',
        comparisons,
        swaps,
        arrayAccesses: accesses,
        variables: { low, high, i, j, 'A[j]': A[j], pivot }
      });

      if (A[j] <= pivot) {
        i++;
        if (i !== j) {
          const tmp = A[i];
          A[i] = A[j];
          A[j] = tmp;
          swaps++;
          accesses += 4;

          steps.push({
            array: [...A],
            states: buildStates(low, high, {
              [high]: 'pivot',
              [i]: 'swapping',
              [j]: 'swapping'
            }),
            pointers: [
              { index: i, label: 'i' },
              { index: j, label: 'j' },
              { index: high, label: `pivot` }
            ],
            activeRange: [low, high],
            line: 12,
            message: `A[${j}] <= ${pivot}: incremented i to ${i} and swapped A[${i}] (${A[i]}) with A[${j}] (${A[j]}).`,
            operationType: 'swap',
            comparisons,
            swaps,
            arrayAccesses: accesses,
            variables: { low, high, i, j, pivot }
          });
        } else {
          steps.push({
            array: [...A],
            states: buildStates(low, high, {
              [high]: 'pivot',
              [i]: 'bound'
            }),
            pointers: [
              { index: i, label: 'i=j' },
              { index: high, label: `pivot` }
            ],
            activeRange: [low, high],
            line: 12,
            message: `A[${j}] = ${A[j]} <= ${pivot}: advanced partition boundary i to ${i}.`,
            operationType: 'bound',
            comparisons,
            swaps,
            arrayAccesses: accesses,
            variables: { low, high, i, j, pivot }
          });
        }
      }
    }

    const pivotFinalIdx = i + 1;
    if (pivotFinalIdx !== high) {
      const tmp = A[pivotFinalIdx];
      A[pivotFinalIdx] = A[high];
      A[high] = tmp;
      swaps++;
      accesses += 4;
    }
    lockedSorted.add(pivotFinalIdx);

    steps.push({
      array: [...A],
      states: buildStates(low, high, {
        [pivotFinalIdx]: 'sorted',
        ...(pivotFinalIdx !== high ? { [high]: 'swapping' } : {})
      }),
      pointers: [{ index: pivotFinalIdx, label: `p=${pivotFinalIdx}` }],
      activeRange: [low, high],
      line: 15,
      message: `Placed pivot ${pivot} at final sorted index p = ${pivotFinalIdx}.`,
      operationType: 'sorted',
      comparisons,
      swaps,
      arrayAccesses: accesses,
      variables: { low, high, p: pivotFinalIdx, pivot }
    });

    quickSortRec(low, pivotFinalIdx - 1);
    quickSortRec(pivotFinalIdx + 1, high);
  }

  quickSortRec(0, n - 1);

  const finalStates: Record<number, ElementState> = {};
  for (let k = 0; k < n; k++) finalStates[k] = 'sorted';
  steps.push({
    array: [...A],
    states: finalStates,
    pointers: [],
    line: 7,
    message: `Quick Sort complete. Total comparisons: ${comparisons}, swaps: ${swaps}.`,
    operationType: 'sorted',
    comparisons,
    swaps,
    arrayAccesses: accesses,
    variables: { n }
  });

  return steps;
}

function generateHeapSortSteps(A: number[], n: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;

  function heapStates(heapSize: number, extra: Record<number, ElementState> = {}): Record<number, ElementState> {
    const s: Record<number, ElementState> = {};
    for (let k = heapSize; k < n; k++) {
      s[k] = 'sorted';
    }
    return { ...s, ...extra };
  }

  steps.push({
    array: [...A],
    states: {},
    pointers: [],
    line: 1,
    message: `Initialized Heap Sort. Phase 1: building in-place Max-Heap on ${n} elements.`,
    operationType: 'init',
    comparisons,
    swaps,
    arrayAccesses: accesses,
    variables: { n, phase: 'Build-Max-Heap' }
  });

  function siftDown(heapSize: number, root: number, phaseLabel: string) {
    let largest = root;
    const L = 2 * root + 1;
    const R = 2 * root + 2;

    if (L < heapSize) {
      comparisons++;
      accesses += 2;
      steps.push({
        array: [...A],
        states: heapStates(heapSize, {
          [root]: 'pivot',
          [L]: 'comparing'
        }),
        pointers: [
          { index: root, label: 'root' },
          { index: L, label: 'L child' }
        ],
        activeRange: [0, heapSize - 1],
        line: 12,
        message: `${phaseLabel}: comparing root A[${root}] = ${A[root]} with left child A[${L}] = ${A[L]}.`,
        operationType: 'compare',
        comparisons,
        swaps,
        arrayAccesses: accesses,
        variables: { heapSize, root, L, 'A[root]': A[root], 'A[L]': A[L] }
      });
      if (A[L] > A[largest]) {
        largest = L;
      }
    }

    if (R < heapSize) {
      comparisons++;
      accesses += 2;
      steps.push({
        array: [...A],
        states: heapStates(heapSize, {
          [root]: 'pivot',
          [largest]: 'bound',
          [R]: 'comparing'
        }),
        pointers: [
          { index: largest, label: 'largest' },
          { index: R, label: 'R child' }
        ],
        activeRange: [0, heapSize - 1],
        line: 13,
        message: `${phaseLabel}: comparing current largest A[${largest}] = ${A[largest]} with right child A[${R}] = ${A[R]}.`,
        operationType: 'compare',
        comparisons,
        swaps,
        arrayAccesses: accesses,
        variables: { heapSize, root, R, largest, 'A[largest]': A[largest], 'A[R]': A[R] }
      });
      if (A[R] > A[largest]) {
        largest = R;
      }
    }

    if (largest !== root) {
      const valRoot = A[root];
      const valLargest = A[largest];
      A[root] = valLargest;
      A[largest] = valRoot;
      swaps++;
      accesses += 4;

      steps.push({
        array: [...A],
        states: heapStates(heapSize, {
          [root]: 'swapping',
          [largest]: 'swapping'
        }),
        pointers: [
          { index: root, label: 'parent' },
          { index: largest, label: 'child' }
        ],
        activeRange: [0, heapSize - 1],
        line: 15,
        message: `${phaseLabel}: sifting down — swapped parent ${valRoot} (index ${root}) with larger child ${valLargest} (index ${largest}).`,
        operationType: 'swap',
        comparisons,
        swaps,
        arrayAccesses: accesses,
        variables: { heapSize, root, largest }
      });

      siftDown(heapSize, largest, phaseLabel);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    siftDown(n, i, 'Build-Heap');
  }

  steps.push({
    array: [...A],
    states: { 0: 'pivot' },
    pointers: [{ index: 0, label: `max=${A[0]}` }],
    activeRange: [0, n - 1],
    line: 5,
    message: `Max-Heap constructed. Maximum element A[0] = ${A[0]} is at the root. Starting extraction phase.`,
    operationType: 'pivot',
    comparisons,
    swaps,
    arrayAccesses: accesses,
    variables: { maxRoot: A[0], phase: 'Extract-Max' }
  });

  for (let i = n - 1; i > 0; i--) {
    const maxVal = A[0];
    const endVal = A[i];
    A[0] = endVal;
    A[i] = maxVal;
    swaps++;
    accesses += 4;

    steps.push({
      array: [...A],
      states: heapStates(i, {
        0: 'swapping',
        [i]: 'sorted'
      }),
      pointers: [
        { index: 0, label: 'new root' },
        { index: i, label: `sorted=${maxVal}` }
      ],
      activeRange: [0, i - 1],
      line: 6,
      message: `Extracted max root ${maxVal} to sorted index ${i}; moved ${endVal} to root A[0].`,
      operationType: 'swap',
      comparisons,
      swaps,
      arrayAccesses: accesses,
      variables: { extractedMax: maxVal, sortedIdx: i, heapSize: i }
    });

    siftDown(i, 0, 'Extract-Max');
  }

  const finalStates: Record<number, ElementState> = {};
  for (let k = 0; k < n; k++) finalStates[k] = 'sorted';
  steps.push({
    array: [...A],
    states: finalStates,
    pointers: [],
    line: 9,
    message: `Heap Sort complete. Total comparisons: ${comparisons}, swaps: ${swaps}.`,
    operationType: 'sorted',
    comparisons,
    swaps,
    arrayAccesses: accesses,
    variables: { n }
  });

  return steps;
}

function generateLinearSearchSteps(A: number[], n: number, target: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;
  const swaps = 0;
  let accesses = 0;

  steps.push({
    array: [...A],
    states: {},
    pointers: [],
    activeRange: [0, n - 1],
    line: 1,
    message: `Initialized Linear Search for target = ${target} across ${n} elements.`,
    operationType: 'init',
    comparisons,
    swaps,
    arrayAccesses: accesses,
    variables: { target, n }
  });

  for (let i = 0; i < n; i++) {
    comparisons++;
    accesses++;

    const states: Record<number, ElementState> = {};
    for (let k = 0; k < i; k++) states[k] = 'eliminated';
    states[i] = 'comparing';

    steps.push({
      array: [...A],
      states,
      pointers: [{ index: i, label: `i=${i}` }],
      activeRange: [i, n - 1],
      line: 3,
      message: `Inspecting index ${i}: comparing A[${i}] = ${A[i]} with target ${target}.`,
      operationType: 'compare',
      comparisons,
      swaps,
      arrayAccesses: accesses,
      variables: { i, 'A[i]': A[i], target }
    });

    if (A[i] === target) {
      const foundStates: Record<number, ElementState> = {};
      for (let k = 0; k < i; k++) foundStates[k] = 'eliminated';
      foundStates[i] = 'found';

      steps.push({
        array: [...A],
        states: foundStates,
        pointers: [{ index: i, label: `found @ ${i}` }],
        line: 4,
        message: `Target ${target} found at index ${i} after ${comparisons} comparison${comparisons === 1 ? '' : 's'}.`,
        operationType: 'found',
        comparisons,
        swaps,
        arrayAccesses: accesses,
        variables: { i, 'A[i]': A[i], target, return: i }
      });
      return steps;
    }
  }

  const allEliminated: Record<number, ElementState> = {};
  for (let k = 0; k < n; k++) allEliminated[k] = 'eliminated';
  steps.push({
    array: [...A],
    states: allEliminated,
    pointers: [],
    line: 7,
    message: `Reached end of array. Target ${target} not found (returns -1).`,
    operationType: 'not-found',
    comparisons,
    swaps,
    arrayAccesses: accesses,
    variables: { target, return: -1 }
  });

  return steps;
}

function generateBinarySearchSteps(A: number[], n: number, target: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;
  const swaps = 0;
  let accesses = 0;

  let low = 0;
  let high = n - 1;

  const buildWindowStates = (l: number, h: number, extra: Record<number, ElementState> = {}) => {
    const s: Record<number, ElementState> = {};
    for (let idx = 0; idx < n; idx++) {
      if (idx < l || idx > h) s[idx] = 'eliminated';
    }
    return { ...s, ...extra };
  };

  steps.push({
    array: [...A],
    states: { [low]: 'bound', [high]: 'bound' },
    pointers: [
      { index: low, label: 'low=0' },
      { index: high, label: `high=${high}` }
    ],
    activeRange: [low, high],
    line: 2,
    message: `Initialized Binary Search for target = ${target} on sorted range A[0..${high}].`,
    operationType: 'init',
    comparisons,
    swaps,
    arrayAccesses: accesses,
    variables: { low, high, target }
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    comparisons++;
    accesses++;

    steps.push({
      array: [...A],
      states: buildWindowStates(low, high, {
        [low]: 'bound',
        [high]: 'bound',
        [mid]: 'comparing'
      }),
      pointers: [
        { index: low, label: 'low' },
        { index: mid, label: `mid=${mid}` },
        { index: high, label: 'high' }
      ],
      activeRange: [low, high],
      line: 5,
      message: `Bisected range [${low}, ${high}] at mid = ${mid}: comparing A[${mid}] = ${A[mid]} with target ${target}.`,
      operationType: 'compare',
      comparisons,
      swaps,
      arrayAccesses: accesses,
      variables: { low, mid, high, 'A[mid]': A[mid], target }
    });

    if (A[mid] === target) {
      steps.push({
        array: [...A],
        states: buildWindowStates(low, high, { [mid]: 'found' }),
        pointers: [{ index: mid, label: `found @ ${mid}` }],
        activeRange: [mid, mid],
        line: 5,
        message: `Target ${target} found at index mid = ${mid} in ${comparisons} comparison${comparisons === 1 ? '' : 's'}.`,
        operationType: 'found',
        comparisons,
        swaps,
        arrayAccesses: accesses,
        variables: { low, mid, high, return: mid }
      });
      return steps;
    }

    comparisons++;
    if (A[mid] < target) {
      const oldLow = low;
      low = mid + 1;
      steps.push({
        array: [...A],
        states: buildWindowStates(low, high, low <= high ? { [low]: 'bound', [high]: 'bound' } : {}),
        pointers: low <= high
          ? [
              { index: low, label: `low=${low}` },
              { index: high, label: `high=${high}` }
            ]
          : [],
        activeRange: low <= high ? [low, high] : undefined,
        line: 7,
        message: `A[${mid}] = ${A[mid]} < ${target}: eliminated left half A[${oldLow}..${mid}], advancing low = ${low}.`,
        operationType: 'bound',
        comparisons,
        swaps,
        arrayAccesses: accesses,
        variables: { low, high, target }
      });
    } else {
      const oldHigh = high;
      high = mid - 1;
      steps.push({
        array: [...A],
        states: buildWindowStates(low, high, low <= high ? { [low]: 'bound', [high]: 'bound' } : {}),
        pointers: low <= high
          ? [
              { index: low, label: `low=${low}` },
              { index: high, label: `high=${high}` }
            ]
          : [],
        activeRange: low <= high ? [low, high] : undefined,
        line: 9,
        message: `A[${mid}] = ${A[mid]} > ${target}: eliminated right half A[${mid}..${oldHigh}], moving high = ${high}.`,
        operationType: 'bound',
        comparisons,
        swaps,
        arrayAccesses: accesses,
        variables: { low, high, target }
      });
    }
  }

  const allEliminated: Record<number, ElementState> = {};
  for (let k = 0; k < n; k++) allEliminated[k] = 'eliminated';
  steps.push({
    array: [...A],
    states: allEliminated,
    pointers: [],
    line: 12,
    message: `Search interval exhausted (low = ${low} > high = ${high}). Target ${target} not in array (returns -1).`,
    operationType: 'not-found',
    comparisons,
    swaps,
    arrayAccesses: accesses,
    variables: { low, high, target, return: -1 }
  });

  return steps;
}

function generateJumpSearchSteps(A: number[], n: number, target: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;
  const swaps = 0;
  let accesses = 0;

  const blockSize = Math.max(1, Math.floor(Math.sqrt(n)));
  let step = blockSize;
  let prev = 0;

  steps.push({
    array: [...A],
    states: { 0: 'bound', [Math.min(step, n) - 1]: 'bound' },
    pointers: [
      { index: 0, label: 'prev=0' },
      { index: Math.min(step, n) - 1, label: `step=${step}` }
    ],
    activeRange: [0, Math.min(step, n) - 1],
    line: 2,
    message: `Initialized Jump Search for target = ${target} with optimal block step √${n} = ${blockSize}.`,
    operationType: 'init',
    comparisons,
    swaps,
    arrayAccesses: accesses,
    variables: { n, blockSize, prev, step, target }
  });

  while (true) {
    const checkIdx = Math.min(step, n) - 1;
    comparisons++;
    accesses++;

    const jumpStates: Record<number, ElementState> = {};
    for (let k = 0; k < prev; k++) jumpStates[k] = 'eliminated';
    jumpStates[prev] = 'bound';
    jumpStates[checkIdx] = 'comparing';

    steps.push({
      array: [...A],
      states: jumpStates,
      pointers: [
        { index: prev, label: `prev=${prev}` },
        { index: checkIdx, label: `bound=${checkIdx}` }
      ],
      activeRange: [prev, checkIdx],
      line: 3,
      message: `Checking block upper bound A[${checkIdx}] = ${A[checkIdx]} against target ${target}.`,
      operationType: 'compare',
      comparisons,
      swaps,
      arrayAccesses: accesses,
      variables: { prev, checkIdx, 'A[checkIdx]': A[checkIdx], target }
    });

    if (A[checkIdx] < target) {
      prev = step;
      step += blockSize;

      if (prev >= n) {
        const allEliminated: Record<number, ElementState> = {};
        for (let k = 0; k < n; k++) allEliminated[k] = 'eliminated';
        steps.push({
          array: [...A],
          states: allEliminated,
          pointers: [],
          line: 5,
          message: `Block jump exceeded array length (prev = ${prev} >= ${n}). Target ${target} not found.`,
          operationType: 'not-found',
          comparisons,
          swaps,
          arrayAccesses: accesses,
          variables: { prev, step, target, return: -1 }
        });
        return steps;
      }

      const nextBound = Math.min(step, n) - 1;
      const nextStates: Record<number, ElementState> = {};
      for (let k = 0; k < prev; k++) nextStates[k] = 'eliminated';
      nextStates[prev] = 'bound';
      nextStates[nextBound] = 'bound';

      steps.push({
        array: [...A],
        states: nextStates,
        pointers: [
          { index: prev, label: `prev=${prev}` },
          { index: nextBound, label: `bound=${nextBound}` }
        ],
        activeRange: [prev, nextBound],
        line: 4,
        message: `A[${checkIdx}] < ${target}: jumped forward to block A[${prev}..${nextBound}].`,
        operationType: 'bound',
        comparisons,
        swaps,
        arrayAccesses: accesses,
        variables: { prev, step, target }
      });
    } else {
      break;
    }
  }

  const blockEnd = Math.min(step, n);
  for (let i = prev; i < blockEnd; i++) {
    comparisons++;
    accesses++;

    const scanStates: Record<number, ElementState> = {};
    for (let k = 0; k < n; k++) {
      if (k < i || k >= blockEnd) scanStates[k] = 'eliminated';
    }
    scanStates[i] = 'comparing';

    steps.push({
      array: [...A],
      states: scanStates,
      pointers: [
        { index: i, label: `i=${i}` },
        { index: blockEnd - 1, label: 'block end' }
      ],
      activeRange: [prev, blockEnd - 1],
      line: 8,
      message: `Linear scan within block [${prev}..${blockEnd - 1}]: comparing A[${i}] = ${A[i]} with target ${target}.`,
      operationType: 'compare',
      comparisons,
      swaps,
      arrayAccesses: accesses,
      variables: { i, 'A[i]': A[i], target, block: `[${prev}..${blockEnd - 1}]` }
    });

    if (A[i] === target) {
      const foundStates: Record<number, ElementState> = {};
      for (let k = 0; k < n; k++) foundStates[k] = 'eliminated';
      foundStates[i] = 'found';

      steps.push({
        array: [...A],
        states: foundStates,
        pointers: [{ index: i, label: `found @ ${i}` }],
        activeRange: [i, i],
        line: 8,
        message: `Target ${target} found at index ${i} inside block [${prev}..${blockEnd - 1}].`,
        operationType: 'found',
        comparisons,
        swaps,
        arrayAccesses: accesses,
        variables: { i, target, return: i }
      });
      return steps;
    }

    if (A[i] > target) {
      break;
    }
  }

  const allEliminated: Record<number, ElementState> = {};
  for (let k = 0; k < n; k++) allEliminated[k] = 'eliminated';
  steps.push({
    array: [...A],
    states: allEliminated,
    pointers: [],
    line: 11,
    message: `Target ${target} not present in candidate block [${prev}..${blockEnd - 1}] (returns -1).`,
    operationType: 'not-found',
    comparisons,
    swaps,
    arrayAccesses: accesses,
    variables: { target, return: -1 }
  });

  return steps;
}

function generateInterpolationSearchSteps(A: number[], n: number, target: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;
  const swaps = 0;
  let accesses = 0;

  let low = 0;
  let high = n - 1;

  const buildWindowStates = (l: number, h: number, extra: Record<number, ElementState> = {}) => {
    const s: Record<number, ElementState> = {};
    for (let idx = 0; idx < n; idx++) {
      if (idx < l || idx > h) s[idx] = 'eliminated';
    }
    return { ...s, ...extra };
  };

  steps.push({
    array: [...A],
    states: { [low]: 'bound', [high]: 'bound' },
    pointers: [
      { index: low, label: `low=0` },
      { index: high, label: `high=${high}` }
    ],
    activeRange: [low, high],
    line: 2,
    message: `Initialized Interpolation Search for target = ${target} across A[0..${high}] ([${A[low]}..${A[high]}]).`,
    operationType: 'init',
    comparisons,
    swaps,
    arrayAccesses: accesses,
    variables: { low, high, 'A[low]': A[low], 'A[high]': A[high], target }
  });

  while (low <= high && target >= A[low] && target <= A[high]) {
    accesses += 2;
    if (low === high) {
      comparisons++;
      accesses++;
      if (A[low] === target) {
        steps.push({
          array: [...A],
          states: buildWindowStates(low, high, { [low]: 'found' }),
          pointers: [{ index: low, label: `found @ ${low}` }],
          activeRange: [low, low],
          line: 4,
          message: `Single-element interval A[${low}] matches target ${target}.`,
          operationType: 'found',
          comparisons,
          swaps,
          arrayAccesses: accesses,
          variables: { low, high, return: low }
        });
        return steps;
      }
      break;
    }

    const denom = A[high] - A[low];
    const pos = denom === 0
      ? low
      : low + Math.floor(((target - A[low]) * (high - low)) / denom);

    comparisons++;
    accesses++;

    steps.push({
      array: [...A],
      states: buildWindowStates(low, high, {
        [low]: 'bound',
        [high]: 'bound',
        [pos]: 'comparing'
      }),
      pointers: [
        { index: low, label: 'low' },
        { index: pos, label: `pos=${pos}` },
        { index: high, label: 'high' }
      ],
      activeRange: [low, high],
      line: 5,
      message: `Interpolated probe pos = ${pos} from range [${low}..${high}] (values ${A[low]}..${A[high]}): A[${pos}] = ${A[pos]}.`,
      operationType: 'compare',
      comparisons,
      swaps,
      arrayAccesses: accesses,
      variables: { low, pos, high, 'A[pos]': A[pos], target }
    });

    if (A[pos] === target) {
      steps.push({
        array: [...A],
        states: buildWindowStates(low, high, { [pos]: 'found' }),
        pointers: [{ index: pos, label: `found @ ${pos}` }],
        activeRange: [pos, pos],
        line: 6,
        message: `Target ${target} matched at interpolated probe index pos = ${pos}.`,
        operationType: 'found',
        comparisons,
        swaps,
        arrayAccesses: accesses,
        variables: { low, pos, high, return: pos }
      });
      return steps;
    }

    comparisons++;
    if (A[pos] < target) {
      low = pos + 1;
      steps.push({
        array: [...A],
        states: buildWindowStates(low, high, low <= high ? { [low]: 'bound', [high]: 'bound' } : {}),
        pointers: low <= high
          ? [
              { index: low, label: `low=${low}` },
              { index: high, label: `high=${high}` }
            ]
          : [],
        activeRange: low <= high ? [low, high] : undefined,
        line: 7,
        message: `A[${pos}] = ${A[pos]} < ${target}: narrowed search interval to [${low}..${high}].`,
        operationType: 'bound',
        comparisons,
        swaps,
        arrayAccesses: accesses,
        variables: { low, high, target }
      });
    } else {
      high = pos - 1;
      steps.push({
        array: [...A],
        states: buildWindowStates(low, high, low <= high ? { [low]: 'bound', [high]: 'bound' } : {}),
        pointers: low <= high
          ? [
              { index: low, label: `low=${low}` },
              { index: high, label: `high=${high}` }
            ]
          : [],
        activeRange: low <= high ? [low, high] : undefined,
        line: 8,
        message: `A[${pos}] = ${A[pos]} > ${target}: narrowed search interval to [${low}..${high}].`,
        operationType: 'bound',
        comparisons,
        swaps,
        arrayAccesses: accesses,
        variables: { low, high, target }
      });
    }
  }

  const allEliminated: Record<number, ElementState> = {};
  for (let k = 0; k < n; k++) allEliminated[k] = 'eliminated';
  steps.push({
    array: [...A],
    states: allEliminated,
    pointers: [],
    line: 10,
    message: `Target ${target} lies outside remaining bounds or interval exhausted (returns -1).`,
    operationType: 'not-found',
    comparisons,
    swaps,
    arrayAccesses: accesses,
    variables: { low, high, target, return: -1 }
  });

  return steps;
}
