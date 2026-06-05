/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SupplierMetrics, Criteria, TOPSISResult } from '../types';
import { calculateTOPSIS } from '../calculations';
import { Layers, ListTodo, PlusCircle, MinusCircle, BarChart3, HelpCircle, Check, Info } from 'lucide-react';

interface TOPSISViewProps {
  suppliers: SupplierMetrics[];
  criteria: Criteria[];
  topsisResult: TOPSISResult;
}

export default function TOPSISView({
  suppliers,
  criteria,
  topsisResult,
}: TOPSISViewProps) {
  const [activeStepTab, setActiveStepTab] = useState<'step1' | 'step2' | 'step3' | 'step4'>('step1');

  // Format monetary numbers
  const formatMoney = (val: number) => {
    return val.toFixed(4);
  };

  return (
    <div className="space-y-6 animate-fade-in text-gray-700">
      {/* Description Info */}
      <div>
        <h2 className="font-display text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Perhitungan Matematika Metode TOPSIS
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Lacak setiap pilar kalkulasi TOPSIS dari matriks keputusan rata-rata, normalisasi terbobot, batas ideal, hingga kedekatan alternatif.
        </p>
      </div>

      {/* Step Tabs Control Bar */}
      <div className="scrollbar-hide flex gap-1 overflow-x-auto rounded-2xl bg-gray-100 p-1 border border-brand-outline-variant">
        <button
          onClick={() => setActiveStepTab('step1')}
          className={`flex-1 shrink-0 rounded-xl px-4 py-2.5 text-xs font-semibold transition cursor-pointer text-center ${
            activeStepTab === 'step1'
              ? 'bg-white text-brand-primary shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          1. Matriks Keputusan (X)
        </button>

        <button
          onClick={() => setActiveStepTab('step2')}
          className={`flex-1 shrink-0 rounded-xl px-4 py-2.5 text-xs font-semibold transition cursor-pointer text-center ${
            activeStepTab === 'step2'
              ? 'bg-white text-brand-primary shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          2. Normalisasi Terbobot (Y)
        </button>

        <button
          onClick={() => setActiveStepTab('step3')}
          className={`flex-1 shrink-0 rounded-xl px-4 py-2.5 text-xs font-semibold transition cursor-pointer text-center ${
            activeStepTab === 'step3'
              ? 'bg-white text-brand-primary shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          3. Solusi Ideal (A+ / A-)
        </button>

        <button
          onClick={() => setActiveStepTab('step4')}
          className={`flex-1 shrink-0 rounded-xl px-4 py-2.5 text-xs font-semibold transition cursor-pointer text-center ${
            activeStepTab === 'step4'
              ? 'bg-white text-brand-primary shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          4. Jarak Ideal (D+ / D-) & V
        </button>
      </div>

      {/* STEP 1: INITIAL DECISION MATRIX (X) */}
      {activeStepTab === 'step1' && (
        <div className="space-y-4 animate-fade-in">
          <div className="rounded-2xl border border-brand-outline-variant bg-white p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-gray-900 mb-1 flex items-center gap-1.5">
                  <ListTodo size={20} className="text-brand-primary" />
                  Matriks Keputusan Awal (X<sub>5x5</sub>)
                </h3>
                <p className="text-xs text-gray-450 font-medium">
                  Merupakan tabulasi agregat nilai metric untuk kelima supplier alternatif langsung dari data historis orisinil.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-brand-outline-variant">
              <table className="w-full border-collapse text-left text-sm text-gray-650 bg-white">
                <thead className="bg-[#f0f4fc] font-display text-xs text-gray-700 uppercase tracking-wider font-semibold border-b border-brand-outline-variant">
                  <tr>
                    <th className="px-4 py-3">Nama Supplier (Alternatif)</th>
                    <th className="px-4 py-3 text-right">C1 (Harga)</th>
                    <th className="px-4 py-3 text-right">C2 (Kualitas - %)</th>
                    <th className="px-4 py-3 text-right">C3 (Lead Time - Hari)</th>
                    <th className="px-4 py-3 text-right">C4 (Ketersediaan - %)</th>
                    <th className="px-4 py-3 text-right">C5 (Inspeksi - %)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono">
                  {suppliers.map((s, idx) => (
                    <tr key={s.supplierName} className="hover:bg-brand-background transition-colors font-sans">
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {s.displayName} <span className="text-2xs text-gray-400 font-mono">({s.supplierName})</span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-gray-700">{formatMoney(s.price)}</td>
                      <td className="px-4 py-3 text-right font-mono text-gray-700">{s.qualityScore.toFixed(2)}%</td>
                      <td className="px-4 py-3 text-right font-mono text-gray-700">{s.leadTime.toFixed(1)} Hari</td>
                      <td className="px-4 py-3 text-right font-mono text-gray-700">{s.availability.toFixed(1)}%</td>
                      <td className="px-4 py-3 text-right font-mono text-gray-700">{s.inspectionPassRate.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex gap-2 rounded-xl bg-blue-50 p-3.5 text-xs text-brand-primary border border-blue-200 font-medium">
              <Info size={16} className="shrink-0 mt-0.5" />
              <span>
                <strong>Keterangan:</strong> Nilai di atas diperoleh dengan menghitung rata-rata dari seluruh baris logistik pengadaan untuk masing-masing supplier pada dataset.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: WEIGHTED NORMALIZED DECISION MATRIX (Y) */}
      {activeStepTab === 'step2' && (
        <div className="space-y-4 animate-fade-in">
          <div className="rounded-2xl border border-brand-outline-variant bg-white p-5">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900 mb-1 flex items-center gap-1.5">
                <Layers size={20} className="text-brand-primary" />
                Matriks Normalisasi Terbobot (Y<sub>5x5</sub>)
              </h3>
              <p className="text-xs text-gray-450 mb-4 font-medium">
                Matriks normalisasi vektor diperluas (Y) dengan mengalikan masing-masing sel r<sub>ij</sub> dengan bobot kriteria (w<sub>j</sub>) AHP.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-brand-outline-variant mb-4">
              <table className="w-full border-collapse text-left text-sm text-gray-650 bg-white">
                <thead className="bg-[#f0f4fc] font-display text-xs text-gray-700 uppercase tracking-wider font-semibold border-b border-brand-outline-variant">
                  <tr>
                    <th className="px-4 py-3">Alternatif (Pemasok)</th>
                    {criteria.map(c => (
                      <th key={c.id} className="px-4 py-3 text-right">
                        {c.id} <span className="text-[10px] text-gray-400 block font-normal">w = {(c.weight * 100).toFixed(1)}%</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono">
                  {suppliers.map((s, idx) => (
                    <tr key={s.supplierName} className="hover:bg-brand-background transition-colors font-sans">
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {s.displayName}
                      </td>
                      {topsisResult.weightedMatrix[idx].map((val, cIdx) => (
                        <td key={cIdx} className="px-4 py-3 text-right font-mono font-medium text-brand-primary">
                          {val.toFixed(4)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl text-3xs text-gray-500 space-y-2 leading-relaxed border border-brand-outline-variant font-medium">
              <h5 className="font-bold text-gray-700 text-xs">Rumus Operasi:</h5>
              <p className="font-sans">
                1. Normalisasi: <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200">r<sub>ij</sub> = x<sub>ij</sub> / &radic;&sum;(x<sub>ij</sub><sup>2</sup>)</span>
              </p>
              <p className="font-sans">
                2. Normalisasi Terbobot: <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200">y<sub>ij</sub> = r<sub>ij</sub> &times; w<sub>j</sub></span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: IDEAL BOUNDARY SOLUTIONS (A+ and A-) */}
      {activeStepTab === 'step3' && (
        <div className="space-y-4 animate-fade-in text-gray-700">
          <div className="rounded-2xl border border-brand-outline-variant bg-white p-5">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900 mb-1 flex items-center gap-1.5">
                <PlusCircle size={20} className="text-emerald-500" />
                Penentuan Solusi Ideal Positif (A<sup>+</sup>) & Negatif (A<sup>-</sup>)
              </h3>
              <p className="text-xs text-gray-450 mb-4 font-medium">
                Solusi ideal dirumuskan dengan mengambil nilai optimum maksimum (untuk kriteria tipe beneficio) atau nilai minimum (untuk kriteria tipe cost) pada matriks Y.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-brand-outline-variant">
              <table className="w-full border-collapse text-left text-sm text-gray-650 bg-white">
                <thead className="bg-[#f0f4fc] font-display text-xs text-gray-700 uppercase tracking-wider font-semibold border-b border-brand-outline-variant">
                  <tr>
                    <th className="px-4 py-3">Solusi Ideal</th>
                    {criteria.map(c => (
                      <th key={c.id} className="px-4 py-3 text-right">
                        {c.id} ({c.name})
                        <span className={`block text-[10px] font-bold ${
                          c.type === 'benefit' ? 'text-green-600' : 'text-rose-600'
                        }`}>
                          {c.type.toUpperCase()}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono">
                  {/* Positive Ideal (A+) */}
                  <tr className="bg-emerald-50/50">
                    <td className="px-4 py-3.5 font-sans font-bold text-emerald-800 flex items-center gap-1">
                      <PlusCircle size={14} className="text-emerald-600" />
                      Solusi Ideal Positif (A<sup>+</sup>)
                    </td>
                    {topsisResult.idealPositive.map((val, idx) => (
                      <td key={idx} className="px-4 py-3.5 text-right font-bold text-emerald-700">
                        {val.toFixed(4)}
                      </td>
                    ))}
                  </tr>

                  {/* Negative Ideal (A-) */}
                  <tr className="bg-rose-50/50">
                    <td className="px-4 py-3.5 font-sans font-bold text-rose-800 flex items-center gap-1 font-semibold">
                      <MinusCircle size={14} className="text-rose-600" />
                      Solusi Ideal Negatif (A<sup>-</sup>)
                    </td>
                    {topsisResult.idealNegative.map((val, idx) => (
                      <td key={idx} className="px-4 py-3.5 text-right font-bold text-rose-700">
                        {val.toFixed(4)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-orange-50 text-xs text-orange-850 border border-orange-200 flex gap-2 font-medium">
              <HelpCircle size={18} className="shrink-0 mt-0.5" />
              <span>
                <strong>Aturan Batasan:</strong> 
                <span className="block mt-1">
                  💡 Kriteria <strong>BENEFIT</strong>: nilai ideal positif (A+) mengambil yang terbesar (max), ideal negatif (A-) yang terkecil (min).
                </span>
                <span className="block">
                  💡 Kriteria <strong>COST</strong>: nilai ideal positif (A+) mengambil yang terkecil (min), ideal negatif (A-) yang terbesar (max).
                </span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: DISTANCES (D+ and D-) AND PREFERENCE COEFFICIENT (V) */}
      {activeStepTab === 'step4' && (
        <div className="space-y-4 animate-fade-in">
          <div className="rounded-2xl border border-brand-outline-variant bg-white p-5">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900 mb-1 flex items-center gap-1.5">
                <BarChart3 size={20} className="text-brand-primary" />
                Jarak Alternatif dari Solusi Ideal & Skor Preferensi Akhir (V)
              </h3>
              <p className="text-xs text-gray-450 mb-4 font-medium">
                Jarak Euclidean masing-masing alternatif ke solusi positif (D+), negatif (D-), serta rasio kedekatan relatif (V) yang menentukan pemeringkatan.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-brand-outline-variant mb-4">
              <table className="w-full border-collapse text-left text-sm text-gray-650 bg-white">
                <thead className="bg-[#f0f4fc] font-display text-xs text-gray-700 uppercase tracking-wider font-semibold border-b border-brand-outline-variant">
                  <tr>
                    <th className="px-4 py-3">Nama Supplier (Alternatif)</th>
                    <th className="px-4 py-3 text-right">Jarak Solusi Positif (D<sup>+</sup>)</th>
                    <th className="px-4 py-3 text-right">Jarak Solusi Negatif (D<sup>-</sup>)</th>
                    <th className="px-4 py-3 text-right">Skor Preferensi (V)</th>
                    <th className="px-4 py-3 text-center">Status Peringkat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono">
                  {suppliers.map((s, idx) => {
                    const dPlus = topsisResult.distancePositive[idx];
                    const dMin = topsisResult.distanceNegative[idx];
                    const v = topsisResult.preferences[idx];
                    
                    // Display actual rank calculated
                    const curRank = topsisResult.ranking.find(r => r.supplierName === s.displayName)?.rank || 1;

                    return (
                      <tr key={s.supplierName} className="hover:bg-brand-background transition-colors font-sans">
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          {s.displayName}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-gray-750">{dPlus.toFixed(4)}</td>
                        <td className="px-4 py-3 text-right font-mono text-gray-750">{dMin.toFixed(4)}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-brand-primary">
                          {v.toFixed(4)}
                        </td>
                        <td className="px-4 py-3 text-center font-sans">
                          <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-bold leading-none ${
                            curRank === 1
                              ? 'bg-amber-100 text-amber-800'
                              : curRank === 2
                              ? 'bg-slate-100 text-slate-800'
                              : 'bg-orange-100 text-orange-850'
                          }`}>
                            Peringkat {curRank}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-3xs text-gray-500 space-y-2.5 leading-relaxed border border-brand-outline-variant font-medium">
              <h5 className="font-bold text-gray-700 text-xs">Rumus & Penafsiran Jarak:</h5>
              <p className="font-sans">
                🔵 Jarak Positif: <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200">D<sub>i</sub><sup>+</sup> = &radic;&sum;(y<sub>ij</sub> - A<sub>j</sub><sup>+</sup>)<sup>2</sup></span> (Semakin kecil semakin dekat dengan performa terbaik)
              </p>
              <p className="font-sans">
                🔴 Jarak Negatif: <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200">D<sub>i</sub><sup>-</sup> = &radic;&sum;(y<sub>ij</sub> - A<sub>j</sub><sup>-</sup>)<sup>2</sup></span> (Semakin besar semakin jauh dari performa terburuk)
              </p>
              <p className="font-sans">
                🌟 Koefisien Kedekatan Rantai (Preferensi): <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200">V<sub>i</sub> = D<sub>i</sub><sup>-</sup> / (D<sub>i</sub><sup>+</sup> + D<sub>i</sub><sup>-</sup>)</span>. Nilai preferensi berkisar di antara 0 s/d 1. Nilai mendekati 1 mendefinisikan alternatif yang paling ideal.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
