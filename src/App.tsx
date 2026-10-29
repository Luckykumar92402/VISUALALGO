/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlgorithmsCatalog } from './components/AlgorithmsCatalog';
import { ArrayCanvas } from './components/ArrayCanvas';
import { CodeAndComplexityPanel } from './components/CodeAndComplexityPanel';
import { CompareWorkspace } from './components/CompareWorkspace';
import { LearnGuide } from './components/LearnGuide';
import {
  ALGORITHMS,
  SEARCHING_ALGORITHMS,
  SORTING_ALGORITHMS,
  generateAlgorithmSteps,
  generatePresetArray,
} from './data/algorithms';
import { ActiveTab, AlgorithmId, ArrayPreset } from './types/algorithm';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('visualizer');

  // Selected Algorithm & Input Configuration
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState<AlgorithmId>('quick-sort');
  const [arraySize, setArraySize] = useState<number>(16);
  const [preset, setPreset] = useState<ArrayPreset>('random');
  const [baseArray, setBaseArray] = useState<number[]>(() =>
    generatePresetArray(16, 'random', false)
  );
  const [searchTarget, setSearchTarget] = useState<number>(42);

  // Custom Input Editor & Validation State
  const [customInputText, setCustomInputText] = useState<string>('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [searchTargetText, setSearchTargetText] = useState<string>('42');

  // Playback Controls State
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(260);

  const selectedAlgorithm = ALGORITHMS[selectedAlgorithmId];
  const isSearching = selectedAlgorithm.category === 'searching';
  const requiresSortedInput =
    selectedAlgorithmId === 'binary-search' ||
    selectedAlgorithmId === 'jump-search' ||
    selectedAlgorithmId === 'interpolation-search';

  // Keep customInputText synced when baseArray changes
  useEffect(() => {
    setCustomInputText(baseArray.join(', '));
  }, [baseArray]);

  useEffect(() => {
    setSearchTargetText(String(searchTarget));
  }, [searchTarget]);

  // Deterministically generate all steps for current algorithm + input
  const steps = useMemo(
    () => generateAlgorithmSteps(selectedAlgorithmId, baseArray, searchTarget),
    [selectedAlgorithmId, baseArray, searchTarget]
  );

  const safeStepIndex = Math.min(currentStepIndex, Math.max(0, steps.length - 1));
  const currentStep = steps[safeStepIndex];
  const maxVal = useMemo(() => Math.max(...baseArray, 1), [baseArray]);

  // Automatic playback timer
  useEffect(() => {
    if (!isPlaying || activeTab !== 'visualizer') return;
    if (safeStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
    }, speedMs);

    return () => window.clearTimeout(timer);
  }, [isPlaying, safeStepIndex, steps.length, speedMs, activeTab]);

  // Select a new algorithm from sidebar or catalog
  const handleSelectAlgorithm = useCallback(
    (id: AlgorithmId) => {
      setIsPlaying(false);
      setCurrentStepIndex(0);
      setInputError(null);
      setSelectedAlgorithmId(id);

      const nextMeta = ALGORITHMS[id];
      const needsSorted =
        id === 'binary-search' || id === 'jump-search' || id === 'interpolation-search';

      setBaseArray((prevArr) => {
        let nextArr = [...prevArr];
        if (needsSorted) {
          nextArr.sort((a, b) => a - b);
        }
        if (nextMeta.category === 'searching' && nextArr.length > 0) {
          const defaultTarget = nextArr[Math.floor(nextArr.length * 0.65)];
          setSearchTarget(defaultTarget);
        }
        return nextArr;
      });
    },
    []
  );

  // Generate new array from toolbar controls
  const handleGenerateArray = useCallback(
    (nextSize: number = arraySize, nextPreset: ArrayPreset = preset) => {
      setIsPlaying(false);
      setCurrentStepIndex(0);
      setInputError(null);
      const nextArr = generatePresetArray(nextSize, nextPreset, requiresSortedInput);
      setBaseArray(nextArr);
      if (isSearching && nextArr.length > 0) {
        const pickIdx = Math.floor(nextArr.length * 0.65);
        setSearchTarget(nextArr[pickIdx]);
      }
    },
    [arraySize, preset, requiresSortedInput, isSearching]
  );

  // Validate and apply custom comma-separated array
  const handleApplyCustomArray = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);

    const rawTokens = customInputText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (rawTokens.length < 3 || rawTokens.length > 48) {
      setInputError('Enter between 3 and 48 comma-separated numbers (e.g. 24, 12, 48, 9, 36).');
      return;
    }

    const parsed: number[] = [];
    for (const token of rawTokens) {
      const num = Number(token);
      if (!Number.isFinite(num) || !Number.isInteger(num) || num < 1 || num > 999) {
        setInputError(`Invalid integer "${token}". Values must be whole numbers between 1 and 999.`);
        return;
      }
      parsed.push(num);
    }

    const finalArray = requiresSortedInput ? [...parsed].sort((a, b) => a - b) : parsed;
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setArraySize(finalArray.length);
    setBaseArray(finalArray);

    if (requiresSortedInput && JSON.stringify(parsed) !== JSON.stringify(finalArray)) {
      setInputError(
        `Note: Input was automatically sorted in ascending order to satisfy ${selectedAlgorithm.name} precondition.`
      );
    }
  };

  // Validate and apply search target
  const handleSearchTargetChange = (raw: string) => {
    setSearchTargetText(raw);
    const num = Number(raw.trim());
    if (raw.trim() !== '' && Number.isInteger(num) && num >= -999 && num <= 9999) {
      setIsPlaying(false);
      setCurrentStepIndex(0);
      setSearchTarget(num);
    }
  };

  // Keyboard shortcuts for natural desktop workflow (Space, Left, Right, R)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'visualizer') return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => {
          if (!prev && safeStepIndex >= steps.length - 1) {
            setCurrentStepIndex(0);
          }
          return !prev;
        });
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, safeStepIndex, steps.length]);

  const handlePlayPause = () => {
    if (!isPlaying && safeStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((p) => !p);
    }
  };

  const handleLoadScenario = (algoId: AlgorithmId, customArr: number[], target?: number) => {
    setIsPlaying(false);
    setInputError(null);
    setSelectedAlgorithmId(algoId);
    setArraySize(customArr.length);
    setBaseArray(customArr);
    if (target !== undefined) {
      setSearchTarget(target);
    }
    setCurrentStepIndex(0);
    setActiveTab('visualizer');
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode
          ? 'dark bg-zinc-950 text-zinc-100'
          : 'bg-zinc-100 text-zinc-900'
      }`}
    >
      {/* Top Bar Contract: 3 Zones separated by gap-8 */}
      <header
        className={`flex items-center justify-between gap-8 px-5 py-2.5 border-b ${
          darkMode
            ? 'bg-zinc-900 border-zinc-800'
            : 'bg-white border-zinc-300'
        }`}
      >
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#visualizer"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('visualizer');
          }}
          className="text-base font-bold tracking-tight font-mono whitespace-nowrap shrink-0"
        >
          AlgoLab
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav className="flex items-center gap-6 text-xs font-medium">
          {(
            [
              { id: 'visualizer', label: 'Visualizer' },
              { id: 'compare', label: 'Compare' },
              { id: 'algorithms', label: 'Algorithms' },
              { id: 'learn', label: 'Learn' },
            ] as const
          ).map((item) => {
            const active = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setIsPlaying(false);
                  setActiveTab(item.id);
                }}
                className={`py-0.5 transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? darkMode
                      ? 'text-zinc-100 underline underline-offset-4 decoration-2'
                      : 'text-zinc-950 underline underline-offset-4 decoration-2'
                    : darkMode
                    ? 'text-zinc-400 hover:text-zinc-100'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action (Theme Toggle) */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setDarkMode((d) => !d)}
            className={`px-3 py-1 text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
              darkMode
                ? 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                : 'border-zinc-300 bg-zinc-50 text-zinc-800 hover:bg-zinc-200/70'
            }`}
          >
            {darkMode ? 'Light Workspace' : 'Dark Workspace'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {activeTab === 'visualizer' && (
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Left Sidebar: Simple Text-Based Navigation List */}
          <aside
            className={`w-full lg:w-56 shrink-0 border-b lg:border-b-0 lg:border-r flex flex-col justify-between ${
              darkMode
                ? 'bg-zinc-900 border-zinc-800'
                : 'bg-white border-zinc-300'
            }`}
          >
            <div className="p-3.5 space-y-5">
              {/* Sorting Group */}
              <div>
                <div
                  className={`px-2 pb-1.5 text-[11px] font-semibold tracking-wide border-b ${
                    darkMode
                      ? 'text-zinc-400 border-zinc-800'
                      : 'text-zinc-500 border-zinc-200'
                  }`}
                >
                  Sorting
                </div>
                <ul className="mt-1.5 space-y-0.5">
                  {SORTING_ALGORITHMS.map((id) => {
                    const algo = ALGORITHMS[id];
                    const isSelected = selectedAlgorithmId === id;
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => handleSelectAlgorithm(id)}
                          className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between transition-colors ${
                            isSelected
                              ? darkMode
                                ? 'bg-zinc-100 text-zinc-950 font-semibold'
                                : 'bg-zinc-900 text-white font-semibold'
                              : darkMode
                              ? 'text-zinc-300 hover:bg-zinc-800'
                              : 'text-zinc-700 hover:bg-zinc-100'
                          }`}
                        >
                          <span className="whitespace-nowrap truncate">{algo.name}</span>
                          <span
                            className={`font-mono text-[10px] ml-2 shrink-0 ${
                              isSelected
                                ? darkMode
                                  ? 'text-zinc-700'
                                  : 'text-zinc-300'
                                : 'text-zinc-500'
                            }`}
                          >
                            {algo.complexity.averageTime}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Searching Group */}
              <div>
                <div
                  className={`px-2 pb-1.5 text-[11px] font-semibold tracking-wide border-b ${
                    darkMode
                      ? 'text-zinc-400 border-zinc-800'
                      : 'text-zinc-500 border-zinc-200'
                  }`}
                >
                  Searching
                </div>
                <ul className="mt-1.5 space-y-0.5">
                  {SEARCHING_ALGORITHMS.map((id) => {
                    const algo = ALGORITHMS[id];
                    const isSelected = selectedAlgorithmId === id;
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => handleSelectAlgorithm(id)}
                          className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between transition-colors ${
                            isSelected
                              ? darkMode
                                ? 'bg-zinc-100 text-zinc-950 font-semibold'
                                : 'bg-zinc-900 text-white font-semibold'
                              : darkMode
                              ? 'text-zinc-300 hover:bg-zinc-800'
                              : 'text-zinc-700 hover:bg-zinc-100'
                          }`}
                        >
                          <span className="whitespace-nowrap truncate">{algo.name}</span>
                          <span
                            className={`font-mono text-[10px] ml-2 shrink-0 ${
                              isSelected
                                ? darkMode
                                  ? 'text-zinc-700'
                                  : 'text-zinc-300'
                                : 'text-zinc-500'
                            }`}
                          >
                            {algo.complexity.averageTime}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Keyboard Shortcuts Reference Footer */}
            <div
              className={`p-3.5 border-t text-[11px] space-y-1 hidden lg:block ${
                darkMode
                  ? 'border-zinc-800 text-zinc-500 bg-zinc-950/30'
                  : 'border-zinc-200 text-zinc-500 bg-zinc-50'
              }`}
            >
              <div className="font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Keyboard Shortcuts
              </div>
              <div className="flex justify-between font-mono">
                <span>Play / Pause</span>
                <span>Space</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>Step Back / Next</span>
                <span>← / →</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>Reset Trace</span>
                <span>R</span>
              </div>
            </div>
          </aside>

          {/* Main Workspace + Right Code/Complexity Panel */}
          <main className="flex-1 p-4 sm:p-5 grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
            {/* Center Visualization Column (7 of 12 cols on desktop) */}
            <div className="xl:col-span-7 flex flex-col gap-3.5">
              {/* Algorithm Title, Short Explanation & Key Insight */}
              <section
                className={`p-4 border ${
                  darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h1 className="text-lg font-semibold tracking-tight">
                    {selectedAlgorithm.name}
                  </h1>
                  <div className="text-xs font-mono text-zinc-500">
                    <span>Time: {selectedAlgorithm.complexity.averageTime}</span>
                    <span aria-hidden="true"> · </span>
                    <span>Space: {selectedAlgorithm.complexity.space}</span>
                    {selectedAlgorithm.complexity.stable !== undefined && (
                      <>
                        <span aria-hidden="true"> · </span>
                        <span>Stable: {selectedAlgorithm.complexity.stable}</span>
                      </>
                    )}
                    {selectedAlgorithm.complexity.precondition && (
                      <>
                        <span aria-hidden="true"> · </span>
                        <span>{selectedAlgorithm.complexity.precondition}</span>
                      </>
                    )}
                  </div>
                </div>
                <p
                  className={`text-xs mt-1.5 leading-relaxed ${
                    darkMode ? 'text-zinc-300' : 'text-zinc-700'
                  }`}
                >
                  {selectedAlgorithm.shortDescription}
                </p>
              </section>

              {/* Input Settings & Array-Generation Toolbar */}
              <section
                className={`p-3.5 border flex flex-col gap-3 text-xs ${
                  darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-1.5">
                      <span className={darkMode ? 'text-zinc-400' : 'text-zinc-600'}>
                        Preset:
                      </span>
                      <select
                        value={preset}
                        onChange={(e) => {
                          const nextP = e.target.value as ArrayPreset;
                          setPreset(nextP);
                          handleGenerateArray(arraySize, nextP);
                        }}
                        className={`px-2 py-1 border font-medium ${
                          darkMode
                            ? 'bg-zinc-950 border-zinc-700 text-zinc-100'
                            : 'bg-white border-zinc-300 text-zinc-900'
                        }`}
                      >
                        <option value="random">Random Values</option>
                        <option value="nearly-sorted">Nearly Sorted</option>
                        <option value="reversed">Reverse Ordered</option>
                        <option value="few-unique">Few Unique Keys</option>
                        <option value="sorted">Sorted Ascending</option>
                      </select>
                    </label>

                    <label className="flex items-center gap-2">
                      <span className={darkMode ? 'text-zinc-400' : 'text-zinc-600'}>
                        Size (n={arraySize}):
                      </span>
                      <input
                        type="range"
                        min={5}
                        max={32}
                        value={arraySize}
                        onChange={(e) => {
                          const nextSize = Number(e.target.value);
                          setArraySize(nextSize);
                          handleGenerateArray(nextSize, preset);
                        }}
                        className="w-24 accent-zinc-800 dark:accent-zinc-200"
                      />
                    </label>

                    {isSearching && (
                      <div className="flex items-center gap-1.5">
                        <label className="flex items-center gap-1.5">
                          <span className={darkMode ? 'text-zinc-400' : 'text-zinc-600'}>
                            Search Target:
                          </span>
                          <input
                            type="number"
                            value={searchTargetText}
                            onChange={(e) => handleSearchTargetChange(e.target.value)}
                            className={`w-16 px-2 py-1 border font-mono tabular-nums ${
                              darkMode
                                ? 'bg-zinc-950 border-zinc-700 text-zinc-100'
                                : 'bg-white border-zinc-300 text-zinc-900'
                            }`}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            if (baseArray.length > 0) {
                              const randVal =
                                baseArray[Math.floor(Math.random() * baseArray.length)];
                              setIsPlaying(false);
                              setCurrentStepIndex(0);
                              setSearchTarget(randVal);
                            }
                          }}
                          className={`px-2 py-1 border text-[11px] whitespace-nowrap shrink-0 ${
                            darkMode
                              ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                              : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'
                          }`}
                          title="Pick a random value guaranteed to exist in the array"
                        >
                          Pick Existing
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleGenerateArray(arraySize, preset)}
                    className={`px-3 py-1 border font-medium transition-colors whitespace-nowrap shrink-0 ${
                      darkMode
                        ? 'border-zinc-700 bg-zinc-800 text-zinc-100 hover:bg-zinc-700'
                        : 'border-zinc-300 bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                    }`}
                  >
                    Generate New Array
                  </button>
                </div>

                {/* Custom Array Input Row */}
                <form
                  onSubmit={handleApplyCustomArray}
                  className={`pt-2.5 border-t flex flex-wrap items-center gap-2 ${
                    darkMode ? 'border-zinc-800' : 'border-zinc-200'
                  }`}
                >
                  <label
                    htmlFor="custom-array-input"
                    className={`shrink-0 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}
                  >
                    Custom Array:
                  </label>
                  <input
                    id="custom-array-input"
                    type="text"
                    value={customInputText}
                    onChange={(e) => setCustomInputText(e.target.value)}
                    placeholder="e.g. 34, 12, 78, 45, 9, 61, 23"
                    className={`flex-1 min-w-[200px] px-2.5 py-1 border font-mono text-xs ${
                      darkMode
                        ? 'bg-zinc-950 border-zinc-700 text-zinc-100'
                        : 'bg-white border-zinc-300 text-zinc-900'
                    }`}
                  />
                  <button
                    type="submit"
                    className={`px-3 py-1 border font-medium transition-colors whitespace-nowrap shrink-0 ${
                      darkMode
                        ? 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                        : 'border-zinc-300 bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                    }`}
                  >
                    Apply Input
                  </button>
                </form>

                {inputError && (
                  <div
                    role="alert"
                    className={`px-3 py-1.5 text-xs border font-mono ${
                      darkMode
                        ? 'bg-amber-950/40 border-amber-800 text-amber-200'
                        : 'bg-amber-50 border-amber-300 text-amber-900'
                    }`}
                  >
                    {inputError}
                  </div>
                )}
              </section>

              {/* Central Array Visualization Canvas */}
              <ArrayCanvas
                step={currentStep}
                maxValue={maxVal}
                darkMode={darkMode}
                isSearchingCategory={isSearching}
                onSelectElementAsTarget={(val) => {
                  setIsPlaying(false);
                  setCurrentStepIndex(0);
                  setSearchTarget(val);
                }}
              />

              {/* Information Strip: Current Operation, Comparisons, Swaps, Accesses, Step Progress */}
              <section
                className={`border divide-y ${
                  darkMode
                    ? 'bg-zinc-900 border-zinc-800 divide-zinc-800'
                    : 'bg-white border-zinc-300 divide-zinc-200'
                }`}
              >
                {/* Live Operation Description Banner */}
                <div className="px-4 py-2.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5 font-mono text-xs">
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-semibold uppercase border ${
                        currentStep.operationType === 'swap' ||
                        currentStep.operationType === 'overwrite'
                          ? darkMode
                            ? 'border-rose-700 bg-rose-950/60 text-rose-300'
                            : 'border-rose-300 bg-rose-50 text-rose-800'
                          : currentStep.operationType === 'compare'
                          ? darkMode
                            ? 'border-amber-700 bg-amber-950/60 text-amber-300'
                            : 'border-amber-300 bg-amber-50 text-amber-800'
                          : currentStep.operationType === 'found' ||
                            currentStep.operationType === 'sorted'
                          ? darkMode
                            ? 'border-emerald-700 bg-emerald-950/60 text-emerald-300'
                            : 'border-emerald-300 bg-emerald-50 text-emerald-800'
                          : darkMode
                          ? 'border-zinc-700 bg-zinc-800 text-zinc-300'
                          : 'border-zinc-300 bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {currentStep.operationType}
                    </span>
                    <span className={darkMode ? 'text-zinc-100' : 'text-zinc-900'}>
                      {currentStep.message}
                    </span>
                  </div>
                </div>

                {/* Telemetry Counter Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-zinc-200 dark:divide-zinc-800 text-xs font-mono tabular-nums">
                  <div className="px-4 py-2 flex items-center justify-between">
                    <span className="text-zinc-500">Step</span>
                    <strong>
                      {safeStepIndex + 1} / {steps.length}
                    </strong>
                  </div>
                  <div className="px-4 py-2 flex items-center justify-between">
                    <span className="text-zinc-500">Comparisons</span>
                    <strong>{currentStep.comparisons}</strong>
                  </div>
                  <div className="px-4 py-2 flex items-center justify-between">
                    <span className="text-zinc-500">
                      {isSearching ? 'Target' : 'Swaps / Writes'}
                    </span>
                    <strong>{isSearching ? searchTarget : currentStep.swaps}</strong>
                  </div>
                  <div className="px-4 py-2 flex items-center justify-between">
                    <span className="text-zinc-500">Array Accesses</span>
                    <strong>{currentStep.arrayAccesses}</strong>
                  </div>
                </div>
              </section>

              {/* Playback Controls Bar Directly Below Visualization */}
              <section
                className={`p-3.5 border flex flex-col gap-3 ${
                  darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
                }`}
              >
                {/* Step Scrubber Slider */}
                <div className="flex items-center gap-3 text-xs font-mono tabular-nums">
                  <span className="text-zinc-500 shrink-0">Timeline:</span>
                  <input
                    type="range"
                    min={0}
                    max={Math.max(0, steps.length - 1)}
                    value={safeStepIndex}
                    onChange={(e) => {
                      setIsPlaying(false);
                      setCurrentStepIndex(Number(e.target.value));
                    }}
                    aria-label="Execution Step Scrubber"
                    className="flex-1 accent-zinc-800 dark:accent-zinc-200"
                  />
                  <span className="w-16 text-right text-zinc-500">
                    {Math.round(((safeStepIndex + 1) / Math.max(1, steps.length)) * 100)}%
                  </span>
                </div>

                {/* Primary Buttons + Speed Control */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePlayPause}
                      className={`px-4 py-1.5 text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 ${
                        darkMode
                          ? 'bg-zinc-100 text-zinc-950 border-zinc-100 hover:bg-zinc-200'
                          : 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800'
                      }`}
                    >
                      {isPlaying
                        ? 'Pause'
                        : safeStepIndex >= steps.length - 1
                        ? 'Replay'
                        : 'Play'}
                    </button>

                    <button
                      type="button"
                      disabled={safeStepIndex <= 0}
                      onClick={() => {
                        setIsPlaying(false);
                        setCurrentStepIndex((prev) => Math.max(0, prev - 1));
                      }}
                      className={`px-3 py-1.5 text-xs font-medium border disabled:opacity-40 transition-colors whitespace-nowrap shrink-0 ${
                        darkMode
                          ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                          : 'border-zinc-300 text-zinc-800 hover:bg-zinc-100'
                      }`}
                    >
                      Previous Step
                    </button>

                    <button
                      type="button"
                      disabled={safeStepIndex >= steps.length - 1}
                      onClick={() => {
                        setIsPlaying(false);
                        setCurrentStepIndex((prev) =>
                          Math.min(steps.length - 1, prev + 1)
                        );
                      }}
                      className={`px-3 py-1.5 text-xs font-medium border disabled:opacity-40 transition-colors whitespace-nowrap shrink-0 ${
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
                        setCurrentStepIndex(0);
                      }}
                      className={`px-3 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                        darkMode
                          ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                          : 'border-zinc-300 text-zinc-800 hover:bg-zinc-100'
                      }`}
                    >
                      Reset
                    </button>
                  </div>

                  {/* Step Interval / Playback Speed Selector */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className={darkMode ? 'text-zinc-400' : 'text-zinc-600'}>
                      Step Delay:
                    </span>
                    <div className="flex items-center border border-zinc-300 dark:border-zinc-700">
                      {[
                        { label: '0.5x', ms: 550 },
                        { label: '1x', ms: 260 },
                        { label: '2x', ms: 120 },
                        { label: '4x', ms: 45 },
                      ].map((sp) => (
                        <button
                          key={sp.label}
                          type="button"
                          onClick={() => setSpeedMs(sp.ms)}
                          className={`px-2 py-1 font-mono text-[11px] transition-colors whitespace-nowrap shrink-0 ${
                            speedMs === sp.ms
                              ? darkMode
                                ? 'bg-zinc-100 text-zinc-950 font-semibold'
                                : 'bg-zinc-900 text-white font-semibold'
                              : darkMode
                              ? 'text-zinc-400 hover:text-zinc-200'
                              : 'text-zinc-600 hover:text-zinc-900'
                          }`}
                        >
                          {sp.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Algorithm Invariants & Notes Strip */}
              <section
                className={`p-4 border text-xs ${
                  darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
                }`}
              >
                <div className="font-semibold mb-1.5">
                  Loop Invariants & Structural Guarantees
                </div>
                <ul
                  className={`space-y-1 list-disc list-inside ${
                    darkMode ? 'text-zinc-400' : 'text-zinc-600'
                  }`}
                >
                  {selectedAlgorithm.invariants.map((inv, idx) => (
                    <li key={idx}>{inv}</li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Right Column: Synchronized Source Code, Complexity Table, and Execution Trace (5 of 12 cols on desktop) */}
            <div className="xl:col-span-5">
              <CodeAndComplexityPanel
                algorithm={selectedAlgorithm}
                currentStep={currentStep}
                steps={steps}
                currentStepIndex={safeStepIndex}
                onJumpToStep={(idx) => {
                  setIsPlaying(false);
                  setCurrentStepIndex(idx);
                }}
                darkMode={darkMode}
              />
            </div>
          </main>
        </div>
      )}

      {activeTab === 'compare' && <CompareWorkspace darkMode={darkMode} />}

      {activeTab === 'algorithms' && (
        <AlgorithmsCatalog
          darkMode={darkMode}
          onSelectAlgorithmForVisualizer={(id) => {
            handleSelectAlgorithm(id);
            setActiveTab('visualizer');
          }}
        />
      )}

      {activeTab === 'learn' && (
        <LearnGuide darkMode={darkMode} onLoadScenario={handleLoadScenario} />
      )}
    </div>
  );
}
