/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SupplierMetrics, TOPSISResult } from '../types';
import { Trophy, Award, Medal, Star, Shield, HelpCircle, BarChart3, TrendingUp } from 'lucide-react';

interface RankingViewProps {
  suppliers: SupplierMetrics[];
  topsisResult: TOPSISResult;
}

export default function RankingView({
  suppliers,
  topsisResult,
}: RankingViewProps) {
  // Sort rankings by rank
  const sortedRanks = [...topsisResult.ranking].sort((a, b) => a.rank - b.rank);
  const bestSupplierName = sortedRanks[0]?.supplierName;
  const bestSupplierDetails = suppliers.find(s => s.displayName === bestSupplierName);

  return (
    <div className="space-y-6 animate-fade-in text-gray-700">
      {/* Description Info */}
      <div>
        <h2 className="font-display text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Hasil Pemeringkatan Alternatif Supplier Terbaik
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Berdasarkan hasil kalkulasi AHP-TOPSIS komprehensif, berikut adalah hierarki prioritas supplier terpilih.
        </p>
      </div>

      {/* Podium Top 3 */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Peringkat 2 */}
        {sortedRanks[1] && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between relative overflow-hidden order-2 md:order-1 mt-0 md:mt-4">
            <div className="absolute right-0 top-0 bg-slate-50 border-b border-l border-slate-200 text-slate-700 px-3 py-1.5 rounded-bl-xl font-mono text-xs font-bold flex items-center gap-1">
              <Medal size={14} className="text-slate-500" />
              RANK 2
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Peringkat Kedua</span>
              <h3 className="font-display text-lg font-bold text-gray-800 mt-1">
                {sortedRanks[1].supplierName}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {suppliers.find(s => s.displayName === sortedRanks[1].supplierName)?.address}
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">Skor Preferensi (V)</span>
              <span className="text-sm font-bold font-mono text-slate-700">{sortedRanks[1].score.toFixed(4)}</span>
            </div>
          </div>
        )}

        {/* Peringkat 1 (Best) */}
        {sortedRanks[0] && (
          <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/20 p-6 shadow-md flex flex-col justify-between relative overflow-hidden order-1 md:order-2 ring-4 ring-amber-150-container">
            <div className="absolute right-0 top-0 bg-amber-200 text-amber-900 px-4 py-2 font-mono text-xs font-bold flex items-center gap-1 rounded-bl-2xl">
              <Trophy size={14} />
              TERBAIK
            </div>
            <div className="space-y-2">
              <span className="text-2xs uppercase tracking-widest text-amber-600 font-extrabold flex items-center gap-1">
                <Star size={12} className="fill-amber-500 text-amber-500" />
                PEMENANG UTAMA
              </span>
              <h3 className="font-display text-2xl font-bold text-amber-950">
                {sortedRanks[0].supplierName}
              </h3>
              <p className="text-xs text-amber-800/80">
                {bestSupplierDetails?.address}
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-amber-200/50 flex items-center justify-between">
              <span className="text-xs text-amber-700/80">Skor Preferensi (V)</span>
              <span className="text-xl font-mono font-bold text-amber-600">{sortedRanks[0].score.toFixed(4)}</span>
            </div>
          </div>
        )}

        {/* Peringkat 3 */}
        {sortedRanks[2] && (
          <div className="rounded-2xl border border-amber-100 bg-white p-6 shadow-xs flex flex-col justify-between relative overflow-hidden order-3 md:order-3 mt-0 md:mt-8">
            <div className="absolute right-0 top-0 bg-orange-50 border-b border-l border-orange-100 text-orange-800 px-3 py-1.5 rounded-bl-xl font-mono text-xs font-bold flex items-center gap-1">
              <Medal size={14} className="text-orange-600" />
              RANK 3
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-orange-400 font-bold block">Peringkat Ketiga</span>
              <h3 className="font-display text-lg font-bold text-gray-800 mt-1">
                {sortedRanks[2].supplierName}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {suppliers.find(s => s.displayName === sortedRanks[2].supplierName)?.address}
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">Skor Preferensi (V)</span>
              <span className="text-sm font-bold font-mono text-orange-800">{sortedRanks[2].score.toFixed(4)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Grid of Chart visualizer & Rank Table */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Pure CSS Bar chart representing TOPSIS scores */}
        <div id="chart_card" className="lg:col-span-2 rounded-2xl border border-brand-outline-variant bg-white p-5 shadow-xs">
          <h3 className="font-display font-semibold text-base text-gray-900 mb-6 flex items-center gap-1.5 border-b border-gray-100 pb-3">
            <BarChart3 size={18} className="text-brand-primary" />
            Visualisasi Hasil Preferensi (V)
          </h3>

          <div className="space-y-6">
            {sortedRanks.map((item, idx) => {
              // Convert preference score as percentage out of maximum (usually scores are 0-1)
              const percentScore = item.score * 100;
              
              return (
                <div key={item.supplierName} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-850 flex items-center gap-1">
                      <span className="font-mono text-2xs text-gray-400">#{item.rank}</span>
                      {item.supplierName}
                    </span>
                    <span className="font-mono font-bold text-slate-800">{item.score.toFixed(4)}</span>
                  </div>
                  
                  <div className="relative h-6 w-full rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                    <div
                      className={`h-full rounded-lg transition-all duration-500 ease-out flex items-center pl-2.5 text-[10px] font-bold text-white ${
                        item.rank === 1
                          ? 'bg-linear-to-r from-amber-500 to-amber-600'
                          : item.rank === 2
                          ? 'bg-linear-to-r from-blue-500 to-blue-600'
                          : 'bg-linear-to-r from-slate-400 to-slate-500'
                      }`}
                      style={{ width: `${percentScore}%` }}
                    >
                      {percentScore.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex gap-2.5 rounded-xl bg-slate-50 p-3.5 text-3xs text-gray-500 border border-brand-outline-variant leading-relaxed">
            <TrendingUp size={16} className="text-brand-primary shrink-0 mt-0.5" />
            <span>
              Nilai preferensi (V) yang lebih tinggi menandakan alternatif memiliki keunggulan yang lebih ideal pada seluruh kriteria yang ditetapkan.
            </span>
          </div>
        </div>

        {/* Detailed ranking listing table */}
        <div id="table_card" className="lg:col-span-3 rounded-2xl border border-brand-outline-variant bg-white p-5 overflow-hidden">
          <h3 className="font-display font-semibold text-base text-gray-900 mb-4 flex items-center gap-1.5 border-b border-gray-100 pb-3">
            <Shield size={18} className="text-brand-primary" />
            Daftar Lengkap Skor & Prioritas Pemasok
          </h3>

          <div className="overflow-x-auto rounded-xl border border-brand-outline-variant">
            <table className="w-full text-left text-sm text-gray-600 bg-white">
              <thead className="bg-[#f0f4fc] font-display text-xs text-gray-700 uppercase tracking-wider font-semibold border-b border-brand-outline-variant">
                <tr>
                  <th className="px-4 py-3 text-center">Rank</th>
                  <th className="px-4 py-3">Nama Pemasok</th>
                  <th className="px-4 py-3 text-right">Skor (V)</th>
                  <th className="px-4 py-3 text-right">D+ (Jarak Ideal Positif)</th>
                  <th className="px-4 py-3 text-right">D- (Jarak Ideal Negatif)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedRanks.map((row) => {
                  const sDetails = suppliers.find(s => s.displayName === row.supplierName);
                  const dDetails = topsisResult;
                  const idx = suppliers.findIndex(s => s.displayName === row.supplierName);
                  const dPlus = dDetails.distancePositive[idx];
                  const dMin = dDetails.distanceNegative[idx];

                  return (
                    <tr key={row.supplierName} className="hover:bg-brand-background transition-colors">
                      <td className="px-4 py-3.5 text-center font-mono">
                        <span className={`inline-flex items-center justify-center rounded-full h-6 w-6 text-xs font-black ${
                          row.rank === 1
                            ? 'bg-amber-100 text-amber-800'
                            : row.rank === 2
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {row.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-sans font-semibold text-gray-900">
                        {row.supplierName}
                        {row.rank === 1 && (
                          <span className="ml-1.5 inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[8px] font-extrabold text-amber-800 uppercase tracking-wider">
                            Rekomendasi
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-brand-primary">{row.score.toFixed(4)}</td>
                      <td className="px-4 py-3.5 text-right font-mono text-gray-500">{dPlus?.toFixed(4)}</td>
                      <td className="px-4 py-3.5 text-right font-mono text-gray-500">{dMin?.toFixed(4)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
