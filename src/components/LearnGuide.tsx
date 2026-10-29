import React, { useState } from 'react';
import { AlgorithmId } from '../types/algorithm';

interface LearnGuideProps {
  darkMode: boolean;
  onLoadScenario: (algo: AlgorithmId, customArr: number[], target?: number) => void;
}

export const LearnGuide: React.FC<LearnGuideProps> = ({ darkMode, onLoadScenario }) => {
  const [nVal, setNVal] = useState<number>(16);

  const log2N = Math.max(1, Math.round(Math.log2(nVal) * 10) / 10);
  const sqrtN = Math.round(Math.sqrt(nVal) * 10) / 10;
  const nLogN = Math.round(nVal * Math.log2(nVal));
  const nSquared = nVal * nVal;

  return (
    <div className="p-5 max-w-[1440px] mx-auto flex flex-col gap-6">
      {/* Header */}
      <div
        className={`p-4 border ${
          darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
        }`}
      >
        <h1 className="text-lg font-semibold tracking-tight">
          Algorithm Analysis & Interactive Lab Exercises
        </h1>
        <p className={`text-xs mt-0.5 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
          Core principles of asymptotic growth, loop invariants, sorting stability, and hands-on lab scenarios you can load directly into the visualizer.
        </p>
      </div>

      {/* Interactive Operation Scaling Calculator */}
      <section
        className={`p-5 border ${
          darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-sm font-semibold">
              01. Asymptotic Growth Calculator (Input Size n = {nVal})
            </h2>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Adjust array length n to inspect how operation counts diverge across complexity classes.
            </p>
          </div>

          <label className="flex items-center gap-3 text-xs font-mono">
            <span>Input Size n = {nVal}:</span>
            <input
              type="range"
              min={4}
              max={64}
              value={nVal}
              onChange={(e) => setNVal(Number(e.target.value))}
              className="w-40 accent-zinc-800 dark:accent-zinc-200"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4 font-mono text-xs tabular-nums">
          <div className={`p-3 border ${darkMode ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-zinc-50'}`}>
            <div className="text-zinc-500">O(log₂ n) — Binary Search</div>
            <div className="text-lg font-semibold mt-1">~{log2N} ops</div>
          </div>
          <div className={`p-3 border ${darkMode ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-zinc-50'}`}>
            <div className="text-zinc-500">O(√n) — Jump Search</div>
            <div className="text-lg font-semibold mt-1">~{sqrtN} ops</div>
          </div>
          <div className={`p-3 border ${darkMode ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-zinc-50'}`}>
            <div className="text-zinc-500">O(n) — Linear Scan</div>
            <div className="text-lg font-semibold mt-1">{nVal} ops</div>
          </div>
          <div className={`p-3 border ${darkMode ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-zinc-50'}`}>
            <div className="text-zinc-500">O(n log₂ n) — Merge/Heap</div>
            <div className="text-lg font-semibold mt-1">{nLogN} ops</div>
          </div>
          <div className={`p-3 border ${darkMode ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-zinc-50'}`}>
            <div className="text-zinc-500">O(n²) — Quadratic Sort</div>
            <div className="text-lg font-semibold mt-1">{nSquared} ops</div>
          </div>
        </div>
      </section>

      {/* Guided Lab Scenarios (Click to Load into Visualizer) */}
      <section
        className={`p-5 border ${
          darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
        }`}
      >
        <h2 className="text-sm font-semibold">
          02. Interactive Classroom Lab Scenarios
        </h2>
        <p className={`text-xs mt-0.5 mb-4 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
          Load these curated test vectors directly into the main workspace to observe best-case and pathological worst-case behaviors firsthand.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 border flex flex-col justify-between gap-3 ${darkMode ? 'border-zinc-800 bg-zinc-950/40' : 'border-zinc-200 bg-zinc-50'}`}>
            <div>
              <h3 className="text-xs font-semibold">
                Scenario A: Insertion Sort on Nearly-Sorted Data — O(n) Adaptive Behavior
              </h3>
              <p className={`text-xs mt-1 leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                When only two adjacent pairs are inverted, Insertion Sort shifts at most 2 elements and finishes in near-linear time.
              </p>
              <div className="mt-2 font-mono text-[11px] text-zinc-500">
                Input: [10, 18, 14, 24, 30, 38, 34, 46, 52, 60]
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={() =>
                  onLoadScenario('insertion-sort', [10, 18, 14, 24, 30, 38, 34, 46, 52, 60])
                }
                className={`px-3 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                  darkMode
                    ? 'bg-zinc-100 text-zinc-950 border-zinc-100 hover:bg-zinc-200'
                    : 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800'
                }`}
              >
                Load Scenario in Visualizer
              </button>
            </div>
          </div>

          <div className={`p-4 border flex flex-col justify-between gap-3 ${darkMode ? 'border-zinc-800 bg-zinc-950/40' : 'border-zinc-200 bg-zinc-50'}`}>
            <div>
              <h3 className="text-xs font-semibold">
                Scenario B: Quick Sort Pathological O(n²) Pivot on Sorted Input
              </h3>
              <p className={`text-xs mt-1 leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                With Lomuto partitioning (selecting A[high] as pivot), an already-sorted array produces maximally unbalanced partitions of size n-1 and 0.
              </p>
              <div className="mt-2 font-mono text-[11px] text-zinc-500">
                Input: [12, 20, 28, 36, 44, 52, 60, 68, 76]
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={() =>
                  onLoadScenario('quick-sort', [12, 20, 28, 36, 44, 52, 60, 68, 76])
                }
                className={`px-3 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                  darkMode
                    ? 'bg-zinc-100 text-zinc-950 border-zinc-100 hover:bg-zinc-200'
                    : 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800'
                }`}
              >
                Load Scenario in Visualizer
              </button>
            </div>
          </div>

          <div className={`p-4 border flex flex-col justify-between gap-3 ${darkMode ? 'border-zinc-800 bg-zinc-950/40' : 'border-zinc-200 bg-zinc-50'}`}>
            <div>
              <h3 className="text-xs font-semibold">
                Scenario C: Selection Sort Minimizing Memory Writes on Reversed Input
              </h3>
              <p className={`text-xs mt-1 leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Observe how Selection Sort performs O(n²) comparisons but executes only ⌊n/2⌋ swaps to reverse a descending array.
              </p>
              <div className="mt-2 font-mono text-[11px] text-zinc-500">
                Input: [88, 76, 64, 52, 40, 28, 16, 10]
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={() =>
                  onLoadScenario('selection-sort', [88, 76, 64, 52, 40, 28, 16, 10])
                }
                className={`px-3 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                  darkMode
                    ? 'bg-zinc-100 text-zinc-950 border-zinc-100 hover:bg-zinc-200'
                    : 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800'
                }`}
              >
                Load Scenario in Visualizer
              </button>
            </div>
          </div>

          <div className={`p-4 border flex flex-col justify-between gap-3 ${darkMode ? 'border-zinc-800 bg-zinc-950/40' : 'border-zinc-200 bg-zinc-50'}`}>
            <div>
              <h3 className="text-xs font-semibold">
                Scenario D: Interpolation Search Single-Probe Lookup on Uniform Keys
              </h3>
              <p className={`text-xs mt-1 leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                On evenly spaced keys (step = 10), linear interpolation computes the exact target index on the very first probe.
              </p>
              <div className="mt-2 font-mono text-[11px] text-zinc-500">
                Input: [10, 20, 30, 40, 50, 60, 70, 80, 90], Target: 70
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={() =>
                  onLoadScenario(
                    'interpolation-search',
                    [10, 20, 30, 40, 50, 60, 70, 80, 90],
                    70
                  )
                }
                className={`px-3 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                  darkMode
                    ? 'bg-zinc-100 text-zinc-950 border-zinc-100 hover:bg-zinc-200'
                    : 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800'
                }`}
              >
                Load Scenario in Visualizer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Concepts Reference */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div
          className={`p-4 border ${
            darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
          }`}
        >
          <h3 className="font-semibold text-sm mb-2">Loop Invariants</h3>
          <p className={`leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
            A loop invariant is a predicate over program state that holds true before the loop begins (Initialization), remains true after each iteration (Maintenance), and combines with the loop termination condition to prove correctness (Termination).
          </p>
        </div>

        <div
          className={`p-4 border ${
            darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
          }`}
        >
          <h3 className="font-semibold text-sm mb-2">Sorting Stability</h3>
          <p className={`leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
            A sorting algorithm is stable if elements with equal sort keys appear in the same relative order in the output as they did in the input. Bubble Sort, Insertion Sort, and Merge Sort are stable; standard Selection Sort, Quick Sort, and Heap Sort are not.
          </p>
        </div>

        <div
          className={`p-4 border ${
            darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
          }`}
        >
          <h3 className="font-semibold text-sm mb-2">In-Place vs Auxiliary Memory</h3>
          <p className={`leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
            In-place algorithms transform the input data structure using only O(1) or O(log n) stack frames for recursion. Merge Sort allocates O(n) auxiliary buffer elements during the merge step to preserve stability and worst-case O(n log n) speed.
          </p>
        </div>
      </div>
    </div>
  );
};
