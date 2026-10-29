import React, { useEffect, useMemo, useState } from 'react';
import {
  ALGORITHMS,
  SEARCHING_ALGORITHMS,
  SORTING_ALGORITHMS,
  generateAlgorithmSteps,
  generatePresetArray,
} from '../data/algorithms';
import { AlgorithmCategory, AlgorithmId, ArrayPreset } from '../types/algorithm';
import { ArrayCanvas } from './ArrayCanvas';

interface CompareWorkspaceProps {
  darkMode: boolean;
}

export const CompareWorkspace: React.FC<CompareWorkspaceProps> = ({ darkMode }) => {
  const [category, setCategory] = useState<AlgorithmCategory>('sorting');
  const [leftAlgo, setLeftAlgo] = useState<AlgorithmId>('quick-sort');
  const [rightAlgo, setRightAlgo] = useState<AlgorithmId>('insertion-sort');
  const [preset, setPreset] = useState<ArrayPreset>('random');
  const [size, setSize] = useState<number>(14);
  const [baseArray, setBaseArray] = useState<number[]>(() =>
    generatePresetArray(14, 'random', false)
  );
  const [searchTarget, setSearchTarget] = useState<number>(42);

  const [stepIdx, setStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(220);

  const availableAlgorithms = category === 'sorting' ? SORTING_ALGORITHMS : SEARCHING_ALGORITHMS;

  const handleCategorySwitch = (newCat: AlgorithmCategory) => {
    setIsPlaying(false);
    setCategory(newCat);
    setStepIdx(0);
    if (newCat === 'sorting') {
      setLeftAlgo('quick-sort');
      setRightAlgo('insertion-sort');
      const nextArr = generatePresetArray(size, preset, false);
      setBaseArray(nextArr);
    } else {
      setLeftAlgo('binary-search');
      setRightAlgo('linear-search');
      const nextArr = generatePresetArray(size, preset, true);
      setBaseArray(nextArr);
      setSearchTarget(nextArr[Math.floor(nextArr.length * 0.65)] ?? 42);
    }
  };

  const regenerateSharedInput = (nextSize = size, nextPreset = preset) => {
    setIsPlaying(false);
    setStepIdx(0);
    const sortedReq = category === 'searching';
    const nextArr = generatePresetArray(nextSize, nextPreset, sortedReq);
    setBaseArray(nextArr);
    if (sortedReq && nextArr.length > 0) {
      setSearchTarget(nextArr[Math.floor(nextArr.length * 0.65)]);
    }
  };

  const leftSteps = useMemo(
    () => generateAlgorithmSteps(leftAlgo, baseArray, searchTarget),
    [leftAlgo, baseArray, searchTarget]
  );

  const rightSteps = useMemo(
    () => generateAlgorithmSteps(rightAlgo, baseArray, searchTarget),
    [rightAlgo, baseArray, searchTarget]
  );

  const maxSteps = Math.max(leftSteps.length, rightSteps.length);
  const maxVal = useMemo(() => Math.max(...baseArray, 1), [baseArray]);

  useEffect(() => {
    if (!isPlaying) return;
    if (stepIdx >= maxSteps - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setStepIdx((prev) => Math.min(maxSteps - 1, prev + 1));
    }, speedMs);
    return () => window.clearTimeout(timer);
  }, [isPlaying, stepIdx, maxSteps, speedMs]);

  const currentLeftStep = leftSteps[Math.min(stepIdx, leftSteps.length - 1)];
  const currentRightStep = rightSteps[Math.min(stepIdx, rightSteps.length - 1)];
  const leftMeta = ALGORITHMS[leftAlgo];
  const rightMeta = ALGORITHMS[rightAlgo];

  const finalLeft = leftSteps[leftSteps.length - 1];
  const finalRight = rightSteps[rightSteps.length - 1];

  return (
    <div className="p-5 max-w-[1440px] mx-auto flex flex-col gap-5">
      {/* Header & Shared Configuration Toolbar */}
      <div
        className={`p-4 border flex flex-col gap-4 ${
          darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Side-by-Side Algorithm Comparison
            </h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Execute two algorithms lock-step on the exact same initial dataset to observe empirical comparison, swap, and step counts.
            </p>
          </div>

          <div className="flex items-center gap-1 p-0.5 border border-zinc-300 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => handleCategorySwitch('sorting')}
              className={`px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                category === 'sorting'
                  ? darkMode
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'bg-zinc-900 text-white'
                  : darkMode
                  ? 'text-zinc-400 hover:text-zinc-200'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Sorting Algorithms
            </button>
            <button
              type="button"
              onClick={() => handleCategorySwitch('searching')}
              className={`px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                category === 'searching'
                  ? darkMode
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'bg-zinc-900 text-white'
                  : darkMode
                  ? 'text-zinc-400 hover:text-zinc-200'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Searching Algorithms
            </button>
          </div>
        </div>

        {/* Controls Strip */}
        <div
          className={`pt-3 border-t flex flex-wrap items-center justify-between gap-4 text-xs ${
            darkMode ? 'border-zinc-800' : 'border-zinc-200'
          }`}
        >
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1.5">
              <span className={darkMode ? 'text-zinc-400' : 'text-zinc-600'}>Left:</span>
              <select
                value={leftAlgo}
                onChange={(e) => {
                  setIsPlaying(false);
                  setStepIdx(0);
                  setLeftAlgo(e.target.value as AlgorithmId);
                }}
                className={`px-2.5 py-1 border font-medium ${
                  darkMode
                    ? 'bg-zinc-950 border-zinc-700 text-zinc-100'
                    : 'bg-white border-zinc-300 text-zinc-900'
                }`}
              >
                {availableAlgorithms.map((id) => (
                  <option key={id} value={id}>
                    {ALGORITHMS[id].name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-1.5">
              <span className={darkMode ? 'text-zinc-400' : 'text-zinc-600'}>Right:</span>
              <select
                value={rightAlgo}
                onChange={(e) => {
                  setIsPlaying(false);
                  setStepIdx(0);
                  setRightAlgo(e.target.value as AlgorithmId);
                }}
                className={`px-2.5 py-1 border font-medium ${
                  darkMode
                    ? 'bg-zinc-950 border-zinc-700 text-zinc-100'
                    : 'bg-white border-zinc-300 text-zinc-900'
                }`}
              >
                {availableAlgorithms.map((id) => (
                  <option key={id} value={id}>
                    {ALGORITHMS[id].name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-1.5">
              <span className={darkMode ? 'text-zinc-400' : 'text-zinc-600'}>Distribution:</span>
              <select
                value={preset}
                onChange={(e) => {
                  const nextP = e.target.value as ArrayPreset;
                  setPreset(nextP);
                  regenerateSharedInput(size, nextP);
                }}
                className={`px-2.5 py-1 border ${
                  darkMode
                    ? 'bg-zinc-950 border-zinc-700 text-zinc-100'
                    : 'bg-white border-zinc-300 text-zinc-900'
                }`}
              >
                <option value="random">Uniform Random</option>
                <option value="nearly-sorted">Nearly Sorted</option>
                <option value="reversed">Reverse Ordered</option>
                <option value="few-unique">Few Unique Keys</option>
              </select>
            </label>

            <label className="flex items-center gap-2">
              <span className={darkMode ? 'text-zinc-400' : 'text-zinc-600'}>
                Size (n={size}):
              </span>
              <input
                type="range"
                min={6}
                max={24}
                value={size}
                onChange={(e) => {
                  const nextS = Number(e.target.value);
                  setSize(nextS);
                  regenerateSharedInput(nextS, preset);
                }}
                className="w-24 accent-zinc-800 dark:accent-zinc-200"
              />
            </label>

            {category === 'searching' && (
              <label className="flex items-center gap-1.5">
                <span className={darkMode ? 'text-zinc-400' : 'text-zinc-600'}>Target:</span>
                <input
                  type="number"
                  value={searchTarget}
                  onChange={(e) => {
                    setIsPlaying(false);
                    setStepIdx(0);
                    setSearchTarget(Number(e.target.value));
                  }}
                  className={`w-16 px-2 py-1 border font-mono tabular-nums ${
                    darkMode
                      ? 'bg-zinc-950 border-zinc-700 text-zinc-100'
                      : 'bg-white border-zinc-300 text-zinc-900'
                  }`}
                />
              </label>
            )}

            <button
              type="button"
              onClick={() => regenerateSharedInput(size, preset)}
              className={`px-3 py-1 border font-medium transition-colors whitespace-nowrap shrink-0 ${
                darkMode
                  ? 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                  : 'border-zinc-300 bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
              }`}
            >
              New Shared Input
            </button>
          </div>

          {/* Synchronized Playback Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className={`px-3.5 py-1 font-medium border transition-colors whitespace-nowrap shrink-0 ${
                darkMode
                  ? 'bg-zinc-100 text-zinc-950 border-zinc-100 hover:bg-zinc-200'
                  : 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800'
              }`}
            >
              {isPlaying ? 'Pause' : stepIdx >= maxSteps - 1 ? 'Replay' : 'Play Both'}
            </button>
            <button
              type="button"
              disabled={stepIdx <= 0}
              onClick={() => {
                setIsPlaying(false);
                setStepIdx((s) => Math.max(0, s - 1));
              }}
              className={`px-2.5 py-1 border disabled:opacity-40 whitespace-nowrap shrink-0 ${
                darkMode
                  ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                  : 'border-zinc-300 text-zinc-800 hover:bg-zinc-100'
              }`}
            >
              Previous Step
            </button>
            <button
              type="button"
              disabled={stepIdx >= maxSteps - 1}
              onClick={() => {
                setIsPlaying(false);
                setStepIdx((s) => Math.min(maxSteps - 1, s + 1));
              }}
              className={`px-2.5 py-1 border disabled:opacity-40 whitespace-nowrap shrink-0 ${
                darkMode
                  ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                  : 'border-zinc-300 text-zinc-800 hover:bg-zinc-100'
              }`}
            >
              Next Step
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setStepIdx(0);
              }}
              className={`px-2.5 py-1 border whitespace-nowrap shrink-0 ${
                darkMode
                  ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                  : 'border-zinc-300 text-zinc-800 hover:bg-zinc-100'
              }`}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Dual Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {/* Left Algorithm Card */}
        <div className="flex flex-col gap-3">
          <div
            className={`px-4 py-3 border flex items-center justify-between ${
              darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
            }`}
          >
            <div>
              <h2 className="text-sm font-semibold">{leftMeta.name}</h2>
              <p className="text-xs font-mono text-zinc-500">
                Avg: {leftMeta.complexity.averageTime} · Worst: {leftMeta.complexity.worstTime} · Space: {leftMeta.complexity.space}
              </p>
            </div>
            <div className="text-right font-mono text-xs tabular-nums">
              <div>
                Step{' '}
                <strong>
                  {Math.min(stepIdx + 1, leftSteps.length)} / {leftSteps.length}
                </strong>
              </div>
              <div className="text-zinc-500">
                {stepIdx >= leftSteps.length - 1 ? 'Completed' : 'Running'}
              </div>
            </div>
          </div>

          <ArrayCanvas
            step={currentLeftStep}
            maxValue={maxVal}
            darkMode={darkMode}
            isSearchingCategory={category === 'searching'}
          />

          <div
            className={`px-4 py-2.5 border text-xs font-mono flex flex-wrap items-center justify-between gap-2 ${
              darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
            }`}
          >
            <span>
              Comparisons: <strong>{currentLeftStep.comparisons}</strong> (Total: {finalLeft.comparisons})
            </span>
            <span>
              {category === 'sorting' ? 'Swaps/Writes' : 'Probes'}:{' '}
              <strong>{currentLeftStep.swaps}</strong> (Total: {finalLeft.swaps})
            </span>
            <span>
              Array Accesses: <strong>{currentLeftStep.arrayAccesses}</strong>
            </span>
          </div>

          <div
            className={`px-4 py-2 border text-xs font-mono ${
              darkMode
                ? 'bg-zinc-950 border-zinc-800 text-zinc-300'
                : 'bg-zinc-50 border-zinc-300 text-zinc-800'
            }`}
          >
            {currentLeftStep.message}
          </div>
        </div>

        {/* Right Algorithm Card */}
        <div className="flex flex-col gap-3">
          <div
            className={`px-4 py-3 border flex items-center justify-between ${
              darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
            }`}
          >
            <div>
              <h2 className="text-sm font-semibold">{rightMeta.name}</h2>
              <p className="text-xs font-mono text-zinc-500">
                Avg: {rightMeta.complexity.averageTime} · Worst: {rightMeta.complexity.worstTime} · Space: {rightMeta.complexity.space}
              </p>
            </div>
            <div className="text-right font-mono text-xs tabular-nums">
              <div>
                Step{' '}
                <strong>
                  {Math.min(stepIdx + 1, rightSteps.length)} / {rightSteps.length}
                </strong>
              </div>
              <div className="text-zinc-500">
                {stepIdx >= rightSteps.length - 1 ? 'Completed' : 'Running'}
              </div>
            </div>
          </div>

          <ArrayCanvas
            step={currentRightStep}
            maxValue={maxVal}
            darkMode={darkMode}
            isSearchingCategory={category === 'searching'}
          />

          <div
            className={`px-4 py-2.5 border text-xs font-mono flex flex-wrap items-center justify-between gap-2 ${
              darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
            }`}
          >
            <span>
              Comparisons: <strong>{currentRightStep.comparisons}</strong> (Total: {finalRight.comparisons})
            </span>
            <span>
              {category === 'sorting' ? 'Swaps/Writes' : 'Probes'}:{' '}
              <strong>{currentRightStep.swaps}</strong> (Total: {finalRight.swaps})
            </span>
            <span>
              Array Accesses: <strong>{currentRightStep.arrayAccesses}</strong>
            </span>
          </div>

          <div
            className={`px-4 py-2 border text-xs font-mono ${
              darkMode
                ? 'bg-zinc-950 border-zinc-800 text-zinc-300'
                : 'bg-zinc-50 border-zinc-300 text-zinc-800'
            }`}
          >
            {currentRightStep.message}
          </div>
        </div>
      </div>

      {/* Empirical Summary Table */}
      <div
        className={`border ${
          darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
        }`}
      >
        <div
          className={`px-4 py-2 border-b text-xs font-medium ${
            darkMode
              ? 'border-zinc-800 bg-zinc-950/60 text-zinc-300'
              : 'border-zinc-200 bg-zinc-50 text-zinc-700'
          }`}
        >
          Empirical Benchmark Summary on Current Input (n = {baseArray.length}, distribution = {preset})
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse font-mono tabular-nums">
            <thead>
              <tr
                className={`border-b text-left ${
                  darkMode ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-600'
                }`}
              >
                <th className="py-2 px-4 font-sans font-medium">Algorithm</th>
                <th className="py-2 px-4 font-sans font-medium">Total Steps</th>
                <th className="py-2 px-4 font-sans font-medium">Total Comparisons</th>
                <th className="py-2 px-4 font-sans font-medium">Swaps / Writes</th>
                <th className="py-2 px-4 font-sans font-medium">Array Accesses</th>
                <th className="py-2 px-4 font-sans font-medium">Worst-Case Bound</th>
              </tr>
            </thead>
            <tbody>
              <tr className={`border-b ${darkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
                <td className="py-2 px-4 font-sans font-medium">{leftMeta.name}</td>
                <td className="py-2 px-4">{leftSteps.length}</td>
                <td className="py-2 px-4">{finalLeft.comparisons}</td>
                <td className="py-2 px-4">{finalLeft.swaps}</td>
                <td className="py-2 px-4">{finalLeft.arrayAccesses}</td>
                <td className="py-2 px-4">{leftMeta.complexity.worstTime}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-sans font-medium">{rightMeta.name}</td>
                <td className="py-2 px-4">{rightSteps.length}</td>
                <td className="py-2 px-4">{finalRight.comparisons}</td>
                <td className="py-2 px-4">{finalRight.swaps}</td>
                <td className="py-2 px-4">{finalRight.arrayAccesses}</td>
                <td className="py-2 px-4">{rightMeta.complexity.worstTime}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
