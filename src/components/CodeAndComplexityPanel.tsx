import React from 'react';
import { AlgorithmMetadata, AlgorithmStep } from '../types/algorithm';
import { ComplexityScalingChart } from './ComplexityScalingChart';

interface CodeAndComplexityPanelProps {
  algorithm: AlgorithmMetadata;
  currentStep: AlgorithmStep;
  steps: AlgorithmStep[];
  currentStepIndex: number;
  onJumpToStep: (idx: number) => void;
  darkMode: boolean;
}

export const CodeAndComplexityPanel: React.FC<CodeAndComplexityPanelProps> = ({
  algorithm,
  currentStep,
  steps,
  currentStepIndex,
  onJumpToStep,
  darkMode,
}) => {
  const { codeLines, complexity } = algorithm;

  return (
    <div className="flex flex-col gap-4">
      {/* Synchronized Source Code Panel */}
      <section
        className={`border ${
          darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
        }`}
      >
        <div
          className={`flex items-center justify-between px-3.5 py-2 border-b text-xs font-medium ${
            darkMode
              ? 'border-zinc-800 bg-zinc-950/60 text-zinc-300'
              : 'border-zinc-200 bg-zinc-50 text-zinc-700'
          }`}
        >
          <span>Source Implementation (JavaScript / TypeScript)</span>
          <span className="font-mono text-[11px] text-zinc-500">
            Active Line: {currentStep.line}
          </span>
        </div>

        <div className="py-2 overflow-x-auto font-mono text-xs leading-relaxed">
          {codeLines.map((line) => {
            const isActive = line.lineNumber === currentStep.line;
            return (
              <div
                key={line.lineNumber}
                className={`flex items-center px-3 py-0.5 transition-colors ${
                  isActive
                    ? darkMode
                      ? 'bg-amber-500/15 text-amber-200 font-medium'
                      : 'bg-amber-100/90 text-zinc-950 font-medium'
                    : darkMode
                    ? 'text-zinc-300'
                    : 'text-zinc-800'
                }`}
              >
                <span
                  className={`w-7 shrink-0 select-none text-right pr-3 tabular-nums ${
                    isActive
                      ? darkMode
                        ? 'text-amber-400 font-semibold'
                        : 'text-amber-800 font-semibold'
                      : darkMode
                      ? 'text-zinc-600'
                      : 'text-zinc-400'
                  }`}
                >
                  {line.lineNumber}
                </span>
                <span
                  className="whitespace-pre"
                  style={{ paddingLeft: `${line.indent * 1.15}rem` }}
                >
                  {line.code}
                </span>
              </div>
            );
          })}
        </div>

        {/* Live Local Variables Watch Strip */}
        {currentStep.variables && Object.keys(currentStep.variables).length > 0 && (
          <div
            className={`px-3.5 py-2 border-t flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono ${
              darkMode
                ? 'border-zinc-800 bg-zinc-950/50 text-zinc-300'
                : 'border-zinc-200 bg-zinc-50 text-zinc-700'
            }`}
          >
            <span className="text-[11px] text-zinc-500">LOCALS:</span>
            {Object.entries(currentStep.variables).map(([k, v]) => (
              <span key={k} className="tabular-nums">
                <span className="text-zinc-500">{k}=</span>
                <strong className={darkMode ? 'text-zinc-100' : 'text-zinc-900'}>{v}</strong>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Time & Space Complexity Table + D3 Scaling Chart */}
      <section
        className={`border ${
          darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
        }`}
      >
        <div
          className={`px-3.5 py-2 border-b text-xs font-medium flex items-center justify-between ${
            darkMode
              ? 'border-zinc-800 bg-zinc-950/60 text-zinc-300'
              : 'border-zinc-200 bg-zinc-50 text-zinc-700'
          }`}
        >
          <span>Asymptotic Complexity & Scaling</span>
          <span className="font-mono text-[11px] text-zinc-500">
            {algorithm.category === 'sorting' ? 'Sorting' : 'Searching'}
          </span>
        </div>

        <table className="w-full text-xs border-collapse">
          <tbody>
            <tr className={`border-b ${darkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <td className={`py-2 px-3.5 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Best-Case Time
              </td>
              <td className="py-2 px-3.5 font-mono font-medium text-right tabular-nums">
                {complexity.bestTime}
              </td>
              <td className={`py-2 px-3.5 border-l ${darkMode ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-600'}`}>
                Auxiliary Space
              </td>
              <td className="py-2 px-3.5 font-mono font-medium text-right tabular-nums">
                {complexity.space}
              </td>
            </tr>
            <tr className={`border-b ${darkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <td className={`py-2 px-3.5 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Average-Case Time
              </td>
              <td className="py-2 px-3.5 font-mono font-medium text-right tabular-nums">
                {complexity.averageTime}
              </td>
              <td className={`py-2 px-3.5 border-l ${darkMode ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-600'}`}>
                {complexity.stable !== undefined ? 'Stable Sort' : 'Precondition'}
              </td>
              <td className="py-2 px-3.5 font-mono font-medium text-right">
                {complexity.stable ?? complexity.precondition ?? '—'}
              </td>
            </tr>
            <tr>
              <td className={`py-2 px-3.5 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Worst-Case Time
              </td>
              <td className="py-2 px-3.5 font-mono font-medium text-right tabular-nums">
                {complexity.worstTime}
              </td>
              <td className={`py-2 px-3.5 border-l ${darkMode ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-600'}`}>
                {complexity.inPlace !== undefined ? 'In-Place' : 'Access Pattern'}
              </td>
              <td className="py-2 px-3.5 font-mono font-medium text-right">
                {complexity.inPlace ?? 'Indexed'}
              </td>
            </tr>
          </tbody>
        </table>

        {/* D3 Bar Chart comparing selected algorithm vs O(n) across n = 10, 100, 1000 */}
        <ComplexityScalingChart algorithm={algorithm} darkMode={darkMode} />
      </section>

      {/* Interactive Execution Trace Log (Click any step to jump) */}
      <section
        className={`border ${
          darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
        }`}
      >
        <div
          className={`px-3.5 py-2 border-b text-xs font-medium flex items-center justify-between ${
            darkMode
              ? 'border-zinc-800 bg-zinc-950/60 text-zinc-300'
              : 'border-zinc-200 bg-zinc-50 text-zinc-700'
          }`}
        >
          <span>Execution Trace Log</span>
          <span className="font-mono text-[11px] text-zinc-500">
            Click any row to inspect state
          </span>
        </div>

        <div className="max-h-44 overflow-y-auto divide-y divide-zinc-200 dark:divide-zinc-800 font-mono text-[11px]">
          {steps.map((s, idx) => {
            const isCurrent = idx === currentStepIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onJumpToStep(idx)}
                className={`w-full text-left px-3.5 py-1.5 flex items-start gap-2.5 transition-colors ${
                  isCurrent
                    ? darkMode
                      ? 'bg-zinc-800 text-zinc-100 font-medium'
                      : 'bg-zinc-100 text-zinc-950 font-medium'
                    : darkMode
                    ? 'text-zinc-400 hover:bg-zinc-800/50'
                    : 'text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <span className="w-9 shrink-0 text-zinc-500 tabular-nums">
                  #{idx}
                </span>
                <span className="w-10 shrink-0 text-zinc-500 tabular-nums">
                  L{s.line}
                </span>
                <span className="flex-1 leading-snug">{s.message}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
