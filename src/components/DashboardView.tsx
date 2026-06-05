/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SupplierMetrics, TOPSISResult, Criteria } from '../types';
import { LayoutGrid, Users, Trophy, Percent, ChevronRight, BarChart3, Database, ShieldAlert, Sliders } from 'lucide-react';

interface DashboardViewProps {
  suppliers: SupplierMetrics[];
  criteria: Criteria[];
  topsisResult: TOPSISResult;
  setActiveTab: (tab: string) => void;
}

export default function DashboardView({
  suppliers,
  criteria,
  topsisResult,
  setActiveTab,
}: DashboardViewProps) {
  const winnerName = topsisResult.ranking[0]?.supplierName;
  const winnerMetrics = suppliers.find(s => s.displayName === winnerName);
  const highestScore = topsisResult.ranking[0]?.score || 0;

  return (
    <div className="space-y-6 animate-fade-in text-gray-700">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-brand-primary to-brand-primary-container p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-8 translate-y-8">
          <Trophy size={200} />
        </div>
        <div className="relative max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wider uppercase backdrop-blur-xs">
            Sistem Pendukung Keputusan (SPK)
          </span>
          <h1 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
            Pemilihan Supplier Terbaik Berbasis AHP-TOPSIS
          </h1>
          <p className="mt-2 text-brand-secondary-container text-xs sm:text-sm leading-relaxed">
            Selamat datang di Platform Evaluasi Pemasok Mandiri. Lakukan optimasi bobot prioritas AHP dan pemeringkatan TOPSIS instan berbasis data riil rantai pasok.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Suppliers */}
        <div className="rounded-2xl border border-brand-outline-variant bg-white p-5 flex items-center justify-between">
          <div>
            <span className="text-2xs font-bold text-gray-400 uppercase tracking-wider block">Total Supplier</span>
            <span className="text-2xl font-black font-display text-gray-800 mt-1 block">{suppliers.length}</span>
            <button
              onClick={() => setActiveTab('dataset')}
              className="text-3xs text-brand-primary font-bold inline-flex items-center gap-0.5 mt-2 hover:underline cursor-pointer"
            >
              Lihat Dataset <ChevronRight size={10} />
            </button>
          </div>
          <div className="p-3.5 rounded-xl bg-blue-50 text-brand-primary">
            <Users size={24} />
          </div>
        </div>

        {/* Total Criteria */}
        <div className="rounded-2xl border border-brand-outline-variant bg-white p-5 flex items-center justify-between">
          <div>
            <span className="text-2xs font-bold text-gray-400 uppercase tracking-wider block">Total Kriteria</span>
            <span className="text-2xl font-black font-display text-gray-800 mt-1 block">{criteria.length}</span>
            <button
              onClick={() => setActiveTab('kriteria')}
              className="text-3xs text-brand-primary font-bold inline-flex items-center gap-0.5 mt-2 hover:underline cursor-pointer"
            >
              Atur Kriteria <ChevronRight size={10} />
            </button>
          </div>
          <div className="p-3.5 rounded-xl bg-indigo-50 text-indigo-600">
            <LayoutGrid size={24} />
          </div>
        </div>

        {/* Best Supplier */}
        <div className="rounded-2xl border border-brand-outline-variant bg-white p-5 flex items-center justify-between">
          <div>
            <span className="text-2xs font-bold text-gray-400 uppercase tracking-wider block">Supplier Terbaik</span>
            <span className="text-sm font-extrabold text-amber-600 truncate max-w-[155px] mt-2 block">
              {winnerName || 'Calculated...'}
            </span>
            <button
              onClick={() => setActiveTab('rekomendasi')}
              className="text-3xs text-brand-primary font-bold inline-flex items-center gap-0.5 mt-2 hover:underline cursor-pointer"
            >
              Rekomendasi <ChevronRight size={10} />
            </button>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-50 text-amber-500">
            <Trophy size={24} />
          </div>
        </div>

        {/* Highest Preference Value */}
        <div className="rounded-2xl border border-brand-outline-variant bg-white p-5 flex items-center justify-between">
          <div>
            <span className="text-2xs font-bold text-gray-400 uppercase tracking-wider block">Preferensi Tertinggi (V)</span>
            <span className="text-2xl font-black font-display text-gray-800 mt-1 block">{highestScore.toFixed(4)}</span>
            <button
              onClick={() => setActiveTab('ranking')}
              className="text-3xs text-brand-primary font-bold inline-flex items-center gap-0.5 mt-2 hover:underline cursor-pointer"
            >
              Lihat Ranking <ChevronRight size={10} />
            </button>
          </div>
          <div className="p-3.5 rounded-xl bg-teal-50 text-teal-600">
            <Percent size={24} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        
        {/* Left column: workflow diagram list */}
        <div id="workflow_card" className="lg:col-span-2 rounded-2xl border border-brand-outline-variant bg-white p-5 shadow-xs">
          <h3 className="font-display font-semibold text-base text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-1.5">
            <Sliders size={18} className="text-brand-primary" />
            Alur Pengolahan AHP-TOPSIS
          </h3>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-brand-primary text-2xs font-bold font-mono">1</div>
              <div>
                <h5 className="text-xs font-semibold text-gray-800">Uji Konsistensi AHP</h5>
                <p className="text-3xs text-gray-400 mt-0.5">Membandingkan kepentingan kriteria berpasangan untuk meminimalkan inkonsistensi keputusan logistik (CR &lt; 0.10).</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-brand-primary text-2xs font-bold font-mono">2</div>
              <div>
                <h5 className="text-xs font-semibold text-gray-800">Normalisasi Kinerja TOPSIS</h5>
                <p className="text-3xs text-gray-400 mt-0.5">Memformulasikan matriks performa kuantitatif 5 supplier agar sepadan dihitung dalam desimal yang seragam.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-brand-primary text-2xs font-bold font-mono">3</div>
              <div>
                <h5 className="text-xs font-semibold text-gray-800">Estimasi Jarak Euclidean</h5>
                <p className="text-3xs text-gray-400 mt-0.5">Mengukur rentang jarak setiap pemasok ke solusi ideal paling baik (A+) dan jarak dari ideal cacat (A-).</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-brand-primary text-2xs font-bold font-mono">4</div>
              <div>
                <h5 className="text-xs font-semibold text-gray-800">Pemeringkatan Preferensi (V)</h5>
                <p className="text-3xs text-gray-400 mt-0.5">Hasil rasio kedekatan (0 s/d 1) diperingkatkan secara otomatis untuk memenangkan supplier terbaik secara empiris.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: leaderboard standings table */}
        <div id="standings_card" className="lg:col-span-3 rounded-2xl border border-brand-outline-variant bg-white p-5 overflow-hidden shadow-xs">
          <h3 className="font-display font-semibold text-base text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-1.5">
            <Trophy size={18} className="text-brand-primary" />
            Top Supplier Leaderboard (Actual Rank)
          </h3>

          <div className="overflow-x-auto rounded-xl border border-brand-outline-variant">
            <table className="w-full text-left text-xs text-gray-655 bg-white">
              <thead className="bg-[#f0f4fc] font-display text-[10px] text-gray-500 uppercase tracking-wider font-semibold border-b border-brand-outline-variant">
                <tr>
                  <th className="px-3 py-2 text-center">Rank</th>
                  <th className="px-3 py-2">Nama Supplier</th>
                  <th className="px-3 py-2 text-right">Skor Preferensi (V)</th>
                  <th className="px-3 py-2 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topsisResult.ranking.map((row) => (
                  <tr key={row.supplierName} className="hover:bg-brand-background transition-colors duration-100">
                    <td className="px-3 py-2.5 text-center font-mono">
                      <span className={`inline-flex items-center justify-center rounded-full h-5 w-5 text-2xs font-bold ${
                        row.rank === 1
                          ? 'bg-amber-100 text-amber-800'
                          : row.rank === 2
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {row.rank}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-sans font-semibold text-gray-850">
                      {row.supplierName}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono font-bold text-brand-primary">{row.score.toFixed(4)}</td>
                    <td className="px-3 py-2.5 text-center">
                      <button
                        onClick={() => setActiveTab('ranking')}
                        className="rounded-lg bg-gray-50 hover:bg-slate-100 px-2 py-1 text-4xs font-bold text-gray-600 transition border border-gray-200 cursor-pointer"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
