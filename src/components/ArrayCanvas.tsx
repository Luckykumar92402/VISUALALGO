import React from 'react';
import { AlgorithmStep, ElementState } from '../types/algorithm';

interface ArrayCanvasProps {
  step: AlgorithmStep;
  maxValue: number;
  darkMode: boolean;
  onSelectElementAsTarget?: (val: number) => void;
  isSearchingCategory?: boolean;
}

interface BarStyleSpec {
  barBg: string;
  barBorder: string;
  textColor: string;
  stateCode: string;
  pattern?: string;
}

function getElementStyle(state: ElementState, darkMode: boolean): BarStyleSpec {
  switch (state) {
    case 'comparing':
      return {
        barBg: darkMode ? 'bg-amber-500/85' : 'bg-amber-500',
        barBorder: darkMode ? 'border-amber-300' : 'border-amber-700',
        textColor: darkMode ? 'text-amber-300 font-semibold' : 'text-amber-800 font-semibold',
        stateCode: 'CMP',
      };
    case 'swapping':
      return {
        barBg: darkMode ? 'bg-rose-500/90' : 'bg-rose-600',
        barBorder: darkMode ? 'border-rose-300' : 'border-rose-800',
        textColor: darkMode ? 'text-rose-300 font-semibold' : 'text-rose-700 font-semibold',
        stateCode: 'SWP',
      };
    case 'pivot':
      return {
        barBg: darkMode ? 'bg-sky-500/85' : 'bg-sky-600',
        barBorder: darkMode ? 'border-sky-300' : 'border-sky-800',
        textColor: darkMode ? 'text-sky-300 font-semibold' : 'text-sky-800 font-semibold',
        stateCode: 'PVT',
      };
    case 'bound':
      return {
        barBg: darkMode ? 'bg-indigo-500/75' : 'bg-indigo-600',
        barBorder: darkMode ? 'border-indigo-300' : 'border-indigo-800',
        textColor: darkMode ? 'text-indigo-300 font-semibold' : 'text-indigo-800 font-semibold',
        stateCode: 'BND',
      };
    case 'sorted':
      return {
        barBg: darkMode ? 'bg-emerald-600/80' : 'bg-emerald-600',
        barBorder: darkMode ? 'border-emerald-400' : 'border-emerald-800',
        textColor: darkMode ? 'text-emerald-300 font-medium' : 'text-emerald-800 font-medium',
        stateCode: 'SRT',
      };
    case 'found':
      return {
        barBg: darkMode ? 'bg-emerald-500' : 'bg-emerald-600',
        barBorder: darkMode ? 'border-emerald-200' : 'border-emerald-900',
        textColor: darkMode ? 'text-emerald-300 font-bold' : 'text-emerald-800 font-bold',
        stateCode: 'HIT',
      };
    case 'eliminated':
      return {
        barBg: darkMode ? 'bg-zinc-800/50' : 'bg-zinc-200/75',
        barBorder: darkMode ? 'border-zinc-700/60 border-dashed' : 'border-zinc-300 border-dashed',
        textColor: darkMode ? 'text-zinc-600' : 'text-zinc-400',
        stateCode: 'OUT',
      };
    default:
      return {
        barBg: darkMode ? 'bg-zinc-600' : 'bg-zinc-700',
        barBorder: darkMode ? 'border-zinc-500' : 'border-zinc-800',
        textColor: darkMode ? 'text-zinc-300' : 'text-zinc-800',
        stateCode: '',
      };
  }
}

export const ArrayCanvas: React.FC<ArrayCanvasProps> = ({
  step,
  maxValue,
  darkMode,
  onSelectElementAsTarget,
  isSearchingCategory = false,
}) => {
  const { array, states, pointers, activeRange } = step;
  const n = array.length;
  const safeMax = Math.max(maxValue, ...array, 1);
  const compactMode = n > 24;

  // Group pointers by index so multiple pointers on one element stack cleanly
  const pointersByIndex: Record<number, string[]> = {};
  for (const p of pointers) {
    if (!pointersByIndex[p.index]) pointersByIndex[p.index] = [];
    pointersByIndex[p.index].push(p.label);
  }

  return (
    <div
      className={`flex flex-col justify-between select-none border ${
        darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
      }`}
    >
      {/* Top Legend & Active Range Indicator Bar */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 px-4 py-2 border-b text-xs ${
          darkMode ? 'border-zinc-800 bg-zinc-950/60 text-zinc-400' : 'border-zinc-200 bg-zinc-50 text-zinc-600'
        }`}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="font-mono text-[11px] font-medium text-zinc-500">STATE LEGEND:</span>
          <div className="flex items-center gap-1.5">
            <span className={`inline-block w-2.5 h-2.5 border ${darkMode ? 'bg-zinc-600 border-zinc-500' : 'bg-zinc-700 border-zinc-800'}`} />
            <span>Default</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 bg-amber-500 border border-amber-700" />
            <span>Compare (CMP)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 bg-rose-600 border border-rose-800" />
            <span>Swap / Write (SWP)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 bg-sky-600 border border-sky-800" />
            <span>Pivot / Key (PVT)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 bg-emerald-600 border border-emerald-800" />
            <span>{isSearchingCategory ? 'Found (HIT)' : 'Sorted (SRT)'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`inline-block w-2.5 h-2.5 border border-dashed ${darkMode ? 'bg-zinc-800 border-zinc-600' : 'bg-zinc-200 border-zinc-400'}`} />
            <span>Inactive / Eliminated</span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          {activeRange && (
            <span>
              Active Window: <strong className={darkMode ? 'text-zinc-200' : 'text-zinc-900'}>A[{activeRange[0]}..{activeRange[1]}]</strong>
            </span>
          )}
          {isSearchingCategory && onSelectElementAsTarget && (
            <span className={darkMode ? 'text-zinc-500' : 'text-zinc-500'}>
              Click any bar to set search target
            </span>
          )}
        </div>
      </div>

      {/* Main Proportional Bar Stage */}
      <div className="relative px-5 pt-7 pb-3">
        {/* Horizontal reference grid lines (25%, 50%, 75%, 100%) */}
        <div className="relative h-64 sm:h-72 w-full flex items-end">
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
            {[100, 75, 50, 25, 0].map((pct) => (
              <div
                key={pct}
                className={`w-full border-b ${
                  pct === 0
                    ? darkMode
                      ? 'border-zinc-700'
                      : 'border-zinc-400'
                    : darkMode
                    ? 'border-zinc-800/70 border-dashed'
                    : 'border-zinc-200 border-dashed'
                } flex items-center`}
              >
                <span
                  className={`font-mono text-[10px] -mt-4 pr-1 select-none ${
                    darkMode ? 'text-zinc-600' : 'text-zinc-400'
                  }`}
                >
                  {pct === 0 ? '0' : Math.round((safeMax * pct) / 100)}
                </span>
              </div>
            ))}
          </div>

          {/* Bars Container */}
          <div className="relative z-10 w-full h-full pl-7 flex items-end gap-1 sm:gap-1.5">
            {array.map((value, idx) => {
              const state: ElementState = states[idx] || 'default';
              const style = getElementStyle(state, darkMode);
              const heightPct = Math.max(6, Math.round((value / safeMax) * 100));
              const inActiveWindow =
                !activeRange || (idx >= activeRange[0] && idx <= activeRange[1]);

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (isSearchingCategory && onSelectElementAsTarget) {
                      onSelectElementAsTarget(value);
                    }
                  }}
                  title={`A[${idx}] = ${value}${style.stateCode ? ` (${style.stateCode})` : ''}`}
                  className={`group flex-1 h-full flex flex-col justify-end items-center ${
                    isSearchingCategory && onSelectElementAsTarget ? 'cursor-pointer' : ''
                  }`}
                >
                  {/* State Tag + Numeric Value Above Bar */}
                  <div className="mb-1 flex flex-col items-center leading-none">
                    {!compactMode && style.stateCode && (
                      <span
                        className={`font-mono text-[9px] tracking-tight mb-0.5 ${style.textColor}`}
                      >
                        {style.stateCode}
                      </span>
                    )}
                    <span
                      className={`font-mono tabular-nums ${
                        compactMode ? 'text-[10px]' : 'text-xs'
                      } ${style.textColor}`}
                    >
                      {value}
                    </span>
                  </div>

                  {/* Bar Column */}
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full border transition-transform duration-150 ${style.barBg} ${
                      style.barBorder
                    } ${
                      state === 'comparing' || state === 'swapping' || state === 'found'
                        ? '-translate-y-0.5'
                        : ''
                    } ${!inActiveWindow && state === 'default' ? 'opacity-45' : ''}`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Array Index Row & Active Pointers Row */}
        <div className="w-full pl-7 pt-2">
          {/* Index Row */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {array.map((_, idx) => {
              const state: ElementState = states[idx] || 'default';
              const isHighlighted = state !== 'default' && state !== 'eliminated';
              return (
                <div key={idx} className="flex-1 text-center">
                  <span
                    className={`font-mono tabular-nums ${
                      compactMode ? 'text-[9px]' : 'text-[11px]'
                    } ${
                      isHighlighted
                        ? darkMode
                          ? 'text-zinc-100 font-semibold'
                          : 'text-zinc-900 font-semibold'
                        : darkMode
                        ? 'text-zinc-500'
                        : 'text-zinc-500'
                    }`}
                  >
                    {idx}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Pointer Callouts Row (Fixed height so layout never jumps during playback) */}
          <div className="flex items-start gap-1 sm:gap-1.5 min-h-[26px] mt-1">
            {array.map((_, idx) => {
              const labels = pointersByIndex[idx];
              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  {labels && labels.length > 0 && (
                    <div className="flex flex-col items-center">
                      <span
                        className={`font-mono text-[10px] leading-none ${
                          darkMode ? 'text-zinc-300' : 'text-zinc-800'
                        }`}
                      >
                        ↑
                      </span>
                      <span
                        className={`font-mono text-[10px] font-medium leading-tight whitespace-nowrap px-1 ${
                          darkMode
                            ? 'text-zinc-100 bg-zinc-800 border border-zinc-700'
                            : 'text-zinc-900 bg-zinc-100 border border-zinc-300'
                        }`}
                      >
                        {labels.join('/')}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Aux Memory Tape Representation (Exact Array Cell Strip) */}
      <div
        className={`px-4 py-2 border-t flex items-center gap-2 overflow-x-auto ${
          darkMode ? 'border-zinc-800 bg-zinc-950/40' : 'border-zinc-200 bg-zinc-50'
        }`}
      >
        <span
          className={`font-mono text-[11px] shrink-0 ${
            darkMode ? 'text-zinc-500' : 'text-zinc-500'
          }`}
        >
          A[0..{n - 1}]:
        </span>
        <div className="flex items-center">
          {array.map((val, idx) => {
            const state = states[idx] || 'default';
            let cellStyle = darkMode
              ? 'border-zinc-700 bg-zinc-900 text-zinc-300'
              : 'border-zinc-300 bg-white text-zinc-800';
            if (state === 'comparing') {
              cellStyle = darkMode
                ? 'border-amber-500 bg-amber-950/60 text-amber-200 font-semibold'
                : 'border-amber-600 bg-amber-50 text-amber-900 font-semibold';
            } else if (state === 'swapping') {
              cellStyle = darkMode
                ? 'border-rose-500 bg-rose-950/60 text-rose-200 font-semibold'
                : 'border-rose-600 bg-rose-50 text-rose-900 font-semibold';
            } else if (state === 'pivot') {
              cellStyle = darkMode
                ? 'border-sky-500 bg-sky-950/60 text-sky-200 font-semibold'
                : 'border-sky-600 bg-sky-50 text-sky-900 font-semibold';
            } else if (state === 'sorted' || state === 'found') {
              cellStyle = darkMode
                ? 'border-emerald-600 bg-emerald-950/50 text-emerald-300'
                : 'border-emerald-600 bg-emerald-50 text-emerald-900';
            } else if (state === 'eliminated') {
              cellStyle = darkMode
                ? 'border-zinc-800 bg-zinc-950 text-zinc-600'
                : 'border-zinc-200 bg-zinc-100 text-zinc-400';
            }

            return (
              <div
                key={idx}
                className={`px-1.5 py-0.5 text-[11px] font-mono tabular-nums border -ml-[1px] first:ml-0 ${cellStyle}`}
              >
                {val}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
