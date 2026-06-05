/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Criteria, AHPResult } from '../types';
import { calculateAHP } from '../calculations';
import { ArrowRight, HelpCircle, CheckCircle2, AlertTriangle, RefreshCw, Layers } from 'lucide-react';

interface AHPViewProps {
  criteria: Criteria[];
  ahpResult: AHPResult;
  setPairwiseMatrix: (matrix: number[][]) => void;
  resetAHPMatrix: () => void;
}

// 10 pairs indices in 5x5 matrix
const AHP_PAIRS = [
  { i: 0, j: 1, label: 'Harga (C1) vs Kualitas (C2)' },
  { i: 0, j: 2, label: 'Harga (C1) vs Pengiriman (C3)' },
  { i: 0, j: 3, label: 'Harga (C1) vs Ketersediaan (C4)' },
  { i: 0, j: 4, label: 'Harga (C1) vs Inspeksi (C5)' },
  { i: 1, j: 2, label: 'Kualitas (C2) vs Pengiriman (C3)' },
  { i: 1, j: 3, label: 'Kualitas (C2) vs Ketersediaan (C4)' },
  { i: 1, j: 4, label: 'Kualitas (C2) vs Inspeksi (C5)' },
  { i: 2, j: 3, label: 'Pengiriman (C3) vs Ketersediaan (C4)' },
  { i: 2, j: 4, label: 'Pengiriman (C3) vs Inspeksi (C5)' },
  { i: 3, j: 4, label: 'Ketersediaan (C4) vs Inspeksi (C5)' },
];

export default function AHPView({
  criteria,
  ahpResult,
  setPairwiseMatrix,
  resetAHPMatrix,
}: AHPViewProps) {
  // Local state to keep track of slider inputs for the 10 pairs
  // Value range: -8 to 8
  // -8 means right criteria is overwhelmingly more important (9)
  // 0 means equally important (1)
  // 8 means left criteria is overwhelmingly more important (9)
  const getSliderValue = (i: number, j: number): number => {
    const val = ahpResult.pairwiseMatrix[i][j];
    if (val >= 1) {
      return Math.round(val - 1);
    } else {
      return Math.round(-( (1 / val) - 1 ));
    }
  };

  const handlePairSliderChange = (i: number, j: number, sliderVal: number) => {
    const newMatrix = ahpResult.pairwiseMatrix.map((row) => [...row]);
    let matrixVal = 1;
    if (sliderVal >= 0) {
      matrixVal = sliderVal + 1;
    } else {
      matrixVal = 1 / (Math.abs(sliderVal) + 1);
    }

    newMatrix[i][j] = matrixVal;
    newMatrix[j][i] = 1 / matrixVal; // symmetric

    setPairwiseMatrix(newMatrix);
  };

  const getIntensityLabel = (sliderVal: number, leftName: string, rightName: string) => {
    const absVal = Math.abs(sliderVal) + 1;
    let description = '';
    
    switch (absVal) {
      case 1: description = 'Sama Penting (Equally Important)'; break;
      case 2: description = 'Mendekati Sedikit Lebih Penting'; break;
      case 3: description = 'Sedikit Lebih Penting (Slightly Favored)'; break;
      case 4: description = 'Mendekati Lebih Penting'; break;
      case 5: description = 'Cukup Lebih Penting (Strongly Favored)'; break;
      case 6: description = 'Mendekati Sangat Penting'; break;
      case 7: description = 'Sangat Penting (Very Strongly Favored)'; break;
      case 8: description = 'Mendekati Mutlak Penting'; break;
      case 9: description = 'Mutlak Lebih Penting (Extremely Favored)'; break;
    }

    if (sliderVal === 0) {
      return <span className="text-gray-500 text-xs font-semibold">{description}</span>;
    } else if (sliderVal > 0) {
      return (
        <span className="text-brand-primary text-xs font-semibold">
          {description}: <strong>{leftName}</strong> lebih dominan ({absVal}x)
        </span>
      );
    } else {
      return (
        <span className="text-indigo-600 text-xs font-semibold">
          {description}: <strong>{rightName}</strong> lebih dominan ({absVal}x)
        </span>
      );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-gray-700">
      {/* Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Perhitungan Metode AHP (Analytical Hierarchy Process)
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Hitung bobot kepentingan kriteria lewat evaluasi perbandingan berpasangan (pairwise comparison) sesuai skala keputusan Thomas L. Saaty.
          </p>
        </div>
        <button
          onClick={resetAHPMatrix}
          className="inline-flex items-center gap-1.5 rounded-xl border border-brand-outline bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw size={14} />
          Reset Matriks Default
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Interactive Sliders (left-hand side) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-brand-outline-variant bg-white p-5">
            <h3 className="font-display font-semibold text-lg text-gray-900 mb-1">
              Evaluator Komparasi Berpasangan
            </h3>
            <p className="text-xs text-gray-400 mb-6 font-medium">
              Geser slider ke kiri atau ke kanan untuk menentukan derajat kepentingan relatif di antara kedua kriteria.
            </p>

            <div className="space-y-5">
              {AHP_PAIRS.map(({ i, j, label }) => {
                const leftCriteria = criteria[i];
                const rightCriteria = criteria[j];
                const sliderVal = getSliderValue(i, j);

                return (
                  <div key={`${i}-${j}`} className="rounded-xl border border-gray-150 p-4 space-y-2 bg-stretch-card">
                    <div className="flex justify-between text-xs font-bold text-gray-800">
                      <span className="text-brand-primary">{leftCriteria.id} - {leftCriteria.name}</span>
                      <span className="text-indigo-600">{rightCriteria.id} - {rightCriteria.name}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Left helper label */}
                      <span className="text-2xs font-bold font-mono text-gray-400">9</span>
                      <input
                        type="range"
                        min="-8"
                        max="8"
                        step="1"
                        value={sliderVal}
                        className="h-1.5 w-full cursor-pointer accent-brand-primary rounded-lg bg-gray-200"
                        onChange={(e) => handlePairSliderChange(i, j, parseInt(e.target.value))}
                      />
                      <span className="text-2xs font-bold font-mono text-gray-400">9</span>
                    </div>

                    <div className="text-center">
                      {getIntensityLabel(sliderVal, leftCriteria.name, rightCriteria.name)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Math Matrix & Consistency status (right-hand side) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Consistency check box */}
          <div className={`rounded-2xl border p-5 ${
            ahpResult.isConsistent 
              ? 'bg-green-50/70 border-green-200 text-green-950' 
              : 'bg-red-50/70 border-red-200 text-red-950'
          }`}>
            <div className="flex items-start gap-3">
              {ahpResult.isConsistent ? (
                <CheckCircle2 size={24} className="text-green-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle size={24} className="text-red-500 shrink-0 mt-0.5" />
              )}
              <div>
                <h3 className="font-display font-bold text-lg">
                  Rasio Konsistensi: {ahpResult.isConsistent ? 'KONSISTEN' : 'TIDAK KONSISTEN'}
                </h3>
                <p className="text-xs mt-1 text-gray-600 leading-relaxed font-medium">
                  Aturan Saaty mensyaratkan <strong>Consistency Ratio (CR) &lt; 0.10</strong> (10%) agar perbandingan dianggap logis dan dapat diandalkan sebagai basis pengambilan keputusan.
                </p>
                
                {/* Micro Stats */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="rounded-lg bg-white/60 p-2 border border-black/5">
                    <span className="text-2xs text-gray-500 block font-sans">Eigen Max (λ max)</span>
                    <span className="text-sm font-bold">{ahpResult.lambdaMax}</span>
                  </div>
                  <div className="rounded-lg bg-white/60 p-2 border border-black/5">
                    <span className="text-2xs text-gray-500 block font-sans">Consistency Index (CI)</span>
                    <span className="text-sm font-bold">{ahpResult.ci}</span>
                  </div>
                  <div className="rounded-lg bg-white/60 p-2 border border-black/5 col-span-2 flex justify-between items-center">
                    <span className="text-2xs text-gray-500 font-sans">Consistency Ratio (CR)</span>
                    <span className={`text-sm font-bold ${ahpResult.isConsistent ? 'text-green-700' : 'text-red-700'}`}>
                      {(ahpResult.cr * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>

                {!ahpResult.isConsistent && (
                  <div className="mt-3.5 text-3xs text-red-700 flex gap-1 font-semibold leading-relaxed">
                    <span>⚠️</span>
                    <span>Pemberitahuan: Silakan sesuaikan slider slider agar perbandingan berpasangan lebih searah atau kurasi kembali penilaian yang kontradiktif.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table representing the 5x5 Matrix */}
          <div className="rounded-2xl border border-brand-outline-variant bg-white p-5 overflow-hidden">
            <h3 className="font-display font-bold text-sm text-gray-900 mb-3 flex items-center gap-1">
              <Layers size={16} className="text-brand-primary" />
              Matriks Keputusan AHP (A<sub>5x5</sub>)
            </h3>
            
            <div className="overflow-x-auto rounded-xl border border-brand-outline-variant">
              <table className="w-full text-center text-xs font-mono text-gray-600 bg-white">
                <thead className="bg-[#f0f4fc] font-semibold border-b border-brand-outline-variant text-[10px] text-gray-500 uppercase font-sans">
                  <tr>
                    <th className="px-2 py-2 text-left bg-gray-50 font-semibold font-sans">Krit</th>
                    <th className="px-1 py-2">C1</th>
                    <th className="px-1 py-2">C2</th>
                    <th className="px-1 py-2">C3</th>
                    <th className="px-1 py-2">C4</th>
                    <th className="px-1 py-2">C5</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ahpResult.pairwiseMatrix.map((row, idx) => (
                    <tr key={idx} className="hover:bg-brand-background">
                      <td className="px-2 py-2 text-left font-bold text-gray-800 font-sans bg-gray-50 border-r border-brand-outline-variant">
                        C{idx + 1}
                      </td>
                      {row.map((val, cellIdx) => (
                        <td key={cellIdx} className="px-1 py-2 text-2xs text-gray-700">
                          {val >= 1 ? val.toFixed(1) : `1/${(1 / val).toFixed(0)}`}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Normalized weights output vector */}
          <div className="rounded-2xl border border-brand-outline-variant bg-white p-5">
            <h3 className="font-display font-bold text-sm text-gray-900 mb-4 flex items-center gap-1">
              🧬 Vektor Prioritas Bobot (Eigen Weight)
            </h3>

            <div className="space-y-3">
              {ahpResult.weights.map((w, idx) => {
                const c = criteria[idx];
                return (
                  <div key={c.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-gray-800">{c.id} - {c.name}</span>
                      <span className="font-mono font-bold text-brand-primary">{(w * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand-primary"
                        style={{ width: `${w * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
