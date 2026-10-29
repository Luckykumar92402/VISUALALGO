import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { AlgorithmId, AlgorithmMetadata } from '../types/algorithm';

interface ComplexityScalingChartProps {
  algorithm: AlgorithmMetadata;
  darkMode: boolean;
}

type CaseMode = 'average' | 'best' | 'worst';
type ScaleMode = 'log' | 'linear';

interface ScalingDatum {
  n: number;
  label: string;
  algoOps: number;
  linearRefOps: number;
}

const INPUT_SIZES = [10, 100, 1000];

function estimateOperations(id: AlgorithmId, n: number, mode: CaseMode): number {
  const log2n = Math.log2(n);
  const log2log2n = Math.max(1, Math.log2(log2n));
  const sqrtn = Math.sqrt(n);

  switch (id) {
    case 'bubble-sort':
      if (mode === 'best') return n - 1;
      if (mode === 'average') return Math.round(0.75 * n * (n - 1));
      return n * (n - 1); // comparisons + swaps in worst case
    case 'selection-sort':
      // Always n(n-1)/2 comparisons + up to n-1 swaps
      return Math.round((n * (n - 1)) / 2 + (mode === 'best' ? 0 : n - 1));
    case 'insertion-sort':
      if (mode === 'best') return n - 1;
      if (mode === 'average') return Math.round((n * (n - 1)) / 4);
      return Math.round((n * (n - 1)) / 2);
    case 'merge-sort':
      return Math.round(n * log2n);
    case 'quick-sort':
      if (mode === 'best') return Math.round(n * log2n);
      if (mode === 'average') return Math.round(1.39 * n * log2n);
      return Math.round((n * (n - 1)) / 2);
    case 'heap-sort':
      return Math.round(1.5 * n * log2n);
    case 'linear-search':
      if (mode === 'best') return 1;
      if (mode === 'average') return Math.round(n / 2);
      return n;
    case 'binary-search':
      if (mode === 'best') return 1;
      return Math.ceil(log2n);
    case 'jump-search':
      if (mode === 'best') return 1;
      if (mode === 'average') return Math.round(1.5 * sqrtn);
      return Math.round(2 * sqrtn);
    case 'interpolation-search':
      if (mode === 'best') return 1;
      if (mode === 'average') return Math.max(1, Math.round(log2log2n));
      return n;
  }
}

function formatCompactNumber(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 10_000) return `${Math.round(val / 1_000)}k`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(1)}k`;
  return String(val);
}

export const ComplexityScalingChart: React.FC<ComplexityScalingChartProps> = ({
  algorithm,
  darkMode,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [caseMode, setCaseMode] = useState<CaseMode>('average');
  const [scaleMode, setScaleMode] = useState<ScaleMode>('log');

  const data: ScalingDatum[] = useMemo(() => {
    return INPUT_SIZES.map((n) => ({
      n,
      label: `n = ${n.toLocaleString()}`,
      algoOps: Math.max(1, estimateOperations(algorithm.id, n, caseMode)),
      linearRefOps: n,
    }));
  }, [algorithm.id, caseMode]);

  const activeComplexityNotation =
    caseMode === 'best'
      ? algorithm.complexity.bestTime
      : caseMode === 'average'
      ? algorithm.complexity.averageTime
      : algorithm.complexity.worstTime;

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const width = 460;
    const height = 168;
    const margin = { top: 22, right: 16, bottom: 26, left: 48 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const maxOps = Math.max(
      1000,
      d3.max(data, (d) => Math.max(d.algoOps, d.linearRefOps)) || 1000
    );

    const x0 = d3
      .scaleBand<string>()
      .domain(data.map((d) => d.label))
      .rangeRound([0, innerWidth])
      .paddingInner(0.32)
      .paddingOuter(0.16);

    const x1 = d3
      .scaleBand<string>()
      .domain(['algo', 'linear'])
      .rangeRound([0, x0.bandwidth()])
      .padding(0.14);

    const y =
      scaleMode === 'log'
        ? d3
            .scaleLog()
            .base(10)
            .domain([1, Math.max(1000, maxOps * 1.6)])
            .range([innerHeight, 0])
            .clamp(true)
        : d3
            .scaleLinear()
            .domain([0, maxOps * 1.18])
            .range([innerHeight, 0]);

    const gridColor = darkMode ? '#27272a' : '#e4e4e7';
    const axisTextColor = darkMode ? '#a1a1aa' : '#52525b';
    const algoBarFill = darkMode ? '#e4e4e7' : '#18181b';
    const algoBarStroke = darkMode ? '#fafafa' : '#09090b';
    const refBarFill = darkMode ? '#3f3f46' : '#d4d4d8';
    const refBarStroke = darkMode ? '#71717a' : '#71717a';

    // Horizontal Y grid lines
    const yTickValues: number[] =
      scaleMode === 'log'
        ? [1, 10, 100, 1000, 10000, 100000, 1000000].filter(
            (v) => v <= maxOps * 1.6
          )
        : y.ticks(4);

    g.append('g')
      .selectAll('line')
      .data(yTickValues)
      .join('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', (d) => y(d))
      .attr('y2', (d) => y(d))
      .attr('stroke', gridColor)
      .attr('stroke-dasharray', (d, idx) => (idx === 0 ? 'none' : '2,2'));

    // Y-axis labels
    const yAxis = d3
      .axisLeft(y)
      .tickValues(yTickValues)
      .tickSize(0)
      .tickPadding(6)
      .tickFormat((d) => formatCompactNumber(Number(d)));

    const yAxisG = g.append('g').call(yAxis);
    yAxisG.select('.domain').remove();
    yAxisG
      .selectAll('text')
      .attr('fill', axisTextColor)
      .attr('font-family', 'IBM Plex Mono, monospace')
      .attr('font-size', '10px');

    // X-axis baseline & labels
    const xAxis = d3.axisBottom(x0).tickSize(0).tickPadding(8);
    const xAxisG = g
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    xAxisG
      .select('.domain')
      .attr('stroke', darkMode ? '#52525b' : '#a1a1aa');
    xAxisG
      .selectAll('text')
      .attr('fill', darkMode ? '#e4e4e7' : '#18181b')
      .attr('font-family', 'IBM Plex Mono, monospace')
      .attr('font-size', '10px')
      .attr('font-weight', '500');

    // Grouped bars per input size n
    const groups = g
      .selectAll('.size-group')
      .data(data)
      .join('g')
      .attr('class', 'size-group')
      .attr('transform', (d) => `translate(${x0(d.label) || 0},0)`);

    // Selected Algorithm Bar
    groups
      .append('rect')
      .attr('x', () => x1('algo') || 0)
      .attr('y', (d) => y(d.algoOps))
      .attr('width', x1.bandwidth())
      .attr('height', (d) => Math.max(2, innerHeight - y(d.algoOps)))
      .attr('fill', algoBarFill)
      .attr('stroke', algoBarStroke)
      .attr('stroke-width', 1);

    // O(n) Linear Reference Bar
    groups
      .append('rect')
      .attr('x', () => x1('linear') || 0)
      .attr('y', (d) => y(d.linearRefOps))
      .attr('width', x1.bandwidth())
      .attr('height', (d) => Math.max(2, innerHeight - y(d.linearRefOps)))
      .attr('fill', refBarFill)
      .attr('stroke', refBarStroke)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2,1');

    // Numeric Value Label above Selected Algorithm Bar
    groups
      .append('text')
      .attr('x', () => (x1('algo') || 0) + x1.bandwidth() / 2)
      .attr('y', (d) => Math.max(10, y(d.algoOps) - 4))
      .attr('text-anchor', 'middle')
      .attr('fill', darkMode ? '#f4f4f5' : '#18181b')
      .attr('font-family', 'IBM Plex Mono, monospace')
      .attr('font-size', '9.5px')
      .attr('font-weight', '600')
      .text((d) => formatCompactNumber(d.algoOps));

    // Numeric Value Label above O(n) Reference Bar
    groups
      .append('text')
      .attr('x', () => (x1('linear') || 0) + x1.bandwidth() / 2)
      .attr('y', (d) => Math.max(10, y(d.linearRefOps) - 4))
      .attr('text-anchor', 'middle')
      .attr('fill', axisTextColor)
      .attr('font-family', 'IBM Plex Mono, monospace')
      .attr('font-size', '9px')
      .text((d) => formatCompactNumber(d.linearRefOps));
  }, [data, darkMode, scaleMode]);

  return (
    <div
      className={`border-t ${
        darkMode ? 'border-zinc-800 bg-zinc-950/30' : 'border-zinc-200 bg-zinc-50/60'
      }`}
    >
      {/* Header & Controls */}
      <div className="px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium ${
              darkMode ? 'text-zinc-300' : 'text-zinc-700'
            }`}
          >
            Scaling vs. O(n) Reference
          </span>
          <span className="font-mono text-[11px] text-zinc-500">
            ({activeComplexityNotation})
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          {/* Case Selector */}
          <div className="flex items-center border border-zinc-300 dark:border-zinc-700">
            {(['best', 'average', 'worst'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setCaseMode(mode)}
                className={`px-2 py-0.5 capitalize transition-colors whitespace-nowrap shrink-0 ${
                  caseMode === mode
                    ? darkMode
                      ? 'bg-zinc-100 text-zinc-950 font-medium'
                      : 'bg-zinc-900 text-white font-medium'
                    : darkMode
                    ? 'text-zinc-400 hover:text-zinc-200'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {mode === 'average' ? 'Avg' : mode}
              </button>
            ))}
          </div>

          {/* Y-Scale Toggle (Log vs Linear) */}
          <div className="flex items-center border border-zinc-300 dark:border-zinc-700 font-mono">
            {(['log', 'linear'] as const).map((sc) => (
              <button
                key={sc}
                type="button"
                onClick={() => setScaleMode(sc)}
                className={`px-1.5 py-0.5 uppercase text-[10px] transition-colors whitespace-nowrap shrink-0 ${
                  scaleMode === sc
                    ? darkMode
                      ? 'bg-zinc-100 text-zinc-950 font-semibold'
                      : 'bg-zinc-900 text-white font-semibold'
                    : darkMode
                    ? 'text-zinc-400 hover:text-zinc-200'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
                title={
                  sc === 'log'
                    ? 'Log10 Y-axis scale to inspect orders of magnitude (10 to 1,000,000 ops)'
                    : 'Linear Y-axis scale to inspect absolute growth steepness'
                }
              >
                {sc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* D3 Bar Chart Canvas */}
      <div className="px-3.5 pt-2 pb-2.5">
        <svg
          ref={svgRef}
          className="w-full h-40 overflow-visible select-none"
          role="img"
          aria-label={`D3 bar chart comparing ${algorithm.name} operation scaling against O(n) across 10, 100, and 1000 items`}
        />

        {/* Legend & Exact Numeric Readout Strip */}
        <div
          className={`mt-1 pt-2 border-t flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono ${
            darkMode
              ? 'border-zinc-800/80 text-zinc-400'
              : 'border-zinc-200 text-zinc-600'
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span
                className={`inline-block w-2.5 h-2.5 border ${
                  darkMode
                    ? 'bg-zinc-200 border-zinc-50'
                    : 'bg-zinc-900 border-zinc-950'
                }`}
              />
              <span>
                {algorithm.name} ({activeComplexityNotation})
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className={`inline-block w-2.5 h-2.5 border border-dashed ${
                  darkMode
                    ? 'bg-zinc-700 border-zinc-400'
                    : 'bg-zinc-300 border-zinc-600'
                }`}
              />
              <span>O(n) Baseline</span>
            </span>
          </div>

          <span className="text-zinc-500 tabular-nums">
            n=1,000: {data[2].algoOps.toLocaleString()} ops
          </span>
        </div>
      </div>
    </div>
  );
};
