import React, { useState } from 'react';
import { ALGORITHMS, SEARCHING_ALGORITHMS, SORTING_ALGORITHMS } from '../data/algorithms';
import { AlgorithmId } from '../types/algorithm';

interface AlgorithmsCatalogProps {
  darkMode: boolean;
  onSelectAlgorithmForVisualizer: (id: AlgorithmId) => void;
}

export const AlgorithmsCatalog: React.FC<AlgorithmsCatalogProps> = ({
  darkMode,
  onSelectAlgorithmForVisualizer,
}) => {
  const [filter, setFilter] = useState<'all' | 'sorting' | 'searching'>('all');

  const sortingList = SORTING_ALGORITHMS.map((id) => ALGORITHMS[id]);
  const searchingList = SEARCHING_ALGORITHMS.map((id) => ALGORITHMS[id]);

  const displayedList =
    filter === 'all'
      ? [...sortingList, ...searchingList]
      : filter === 'sorting'
      ? sortingList
      : searchingList;

  return (
    <div className="p-5 max-w-[1440px] mx-auto flex flex-col gap-6">
      {/* Header & Filter Bar */}
      <div
        className={`p-4 border flex flex-wrap items-center justify-between gap-4 ${
          darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
        }`}
      >
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            Algorithm Reference & Complexity Matrix
          </h1>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Asymptotic time and space bounds, loop invariants, stability guarantees, and practical engineering trade-offs.
          </p>
        </div>

        <div className="flex items-center gap-1 p-0.5 border border-zinc-300 dark:border-zinc-700">
          {(['all', 'sorting', 'searching'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                filter === tab
                  ? darkMode
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'bg-zinc-900 text-white'
                  : darkMode
                  ? 'text-zinc-400 hover:text-zinc-200'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {tab === 'all' ? 'All (10)' : tab === 'sorting' ? 'Sorting (6)' : 'Searching (4)'}
            </button>
          ))}
        </div>
      </div>

      {/* Master Complexity Comparison Table */}
      <div
        className={`border ${
          darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
        }`}
      >
        <div
          className={`px-4 py-2.5 border-b text-xs font-medium ${
            darkMode
              ? 'border-zinc-800 bg-zinc-950/60 text-zinc-300'
              : 'border-zinc-200 bg-zinc-50 text-zinc-700'
          }`}
        >
          Asymptotic Complexity Summary Table
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr
                className={`border-b text-left ${
                  darkMode ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-600'
                }`}
              >
                <th className="py-2.5 px-4 font-medium">Algorithm</th>
                <th className="py-2.5 px-4 font-medium">Category</th>
                <th className="py-2.5 px-4 font-medium">Best Time</th>
                <th className="py-2.5 px-4 font-medium">Average Time</th>
                <th className="py-2.5 px-4 font-medium">Worst Time</th>
                <th className="py-2.5 px-4 font-medium">Aux Space</th>
                <th className="py-2.5 px-4 font-medium">Properties / Preconditions</th>
                <th className="py-2.5 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {displayedList.map((algo) => (
                <tr
                  key={algo.id}
                  className={
                    darkMode ? 'hover:bg-zinc-800/40' : 'hover:bg-zinc-50'
                  }
                >
                  <td className="py-2.5 px-4 font-medium">{algo.name}</td>
                  <td className="py-2.5 px-4 text-zinc-500 capitalize">
                    {algo.category}
                  </td>
                  <td className="py-2.5 px-4 font-mono tabular-nums">
                    {algo.complexity.bestTime}
                  </td>
                  <td className="py-2.5 px-4 font-mono tabular-nums">
                    {algo.complexity.averageTime}
                  </td>
                  <td className="py-2.5 px-4 font-mono tabular-nums">
                    {algo.complexity.worstTime}
                  </td>
                  <td className="py-2.5 px-4 font-mono tabular-nums">
                    {algo.complexity.space}
                  </td>
                  <td className="py-2.5 px-4 text-zinc-500">
                    {algo.category === 'sorting'
                      ? `Stable: ${algo.complexity.stable} · In-Place: ${algo.complexity.inPlace}`
                      : algo.complexity.precondition}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onSelectAlgorithmForVisualizer(algo.id)}
                      className={`px-2.5 py-1 text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                        darkMode
                          ? 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                          : 'border-zinc-300 bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                      }`}
                    >
                      Open in Visualizer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Specification List */}
      <div className="flex flex-col gap-4">
        {displayedList.map((algo, index) => (
          <article
            key={algo.id}
            className={`p-5 border ${
              darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h2 className="text-base font-semibold">
                  {String(index + 1).padStart(2, '0')}. {algo.name}
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Category: {algo.category === 'sorting' ? 'Comparison Sorting' : 'Array Searching'} · Worst-Case Time: <span className="font-mono">{algo.complexity.worstTime}</span> · Space: <span className="font-mono">{algo.complexity.space}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectAlgorithmForVisualizer(algo.id)}
                className={`px-3 py-1 text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                  darkMode
                    ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                    : 'border-zinc-300 text-zinc-800 hover:bg-zinc-100'
                }`}
              >
                Step Through {algo.name}
              </button>
            </div>

            <p className={`text-sm mt-3 leading-relaxed ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
              {algo.shortDescription}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-xs">
              <div>
                <h3 className="font-semibold mb-1.5">Loop & Structural Invariants</h3>
                <ul className={`space-y-1 list-disc list-inside ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {algo.invariants.map((inv, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {inv}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-1.5">Practical Use Cases</h3>
                <ul className={`space-y-1 list-disc list-inside ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {algo.whenToUse.map((use, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {use}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-1.5">Engineering Trade-offs</h3>
                <ul className={`space-y-1 list-disc list-inside ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {algo.limitations.map((lim, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {lim}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
