/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Criteria } from '../types';
import { Settings, RefreshCw, HelpCircle, Check, Info, ShieldAlert } from 'lucide-react';

interface KriteriaBobotViewProps {
  criteria: Criteria[];
  setCriteria: React.Dispatch<React.SetStateAction<Criteria[]>>;
  ahpWeights: number[];
  isManualOverride: boolean;
  setIsManualOverride: (val: boolean) => void;
  syncWithAHP: () => void;
}

export default function KriteriaBobotView({
  criteria,
  setCriteria,
  ahpWeights,
  isManualOverride,
  setIsManualOverride,
  syncWithAHP,
}: KriteriaBobotViewProps) {
  const [editingWeights, setEditingWeights] = useState<Record<string, string>>(
    criteria.reduce((acc, c) => ({ ...acc, [c.id]: (c.weight * 100).toFixed(1) }), {})
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Toggle criterion type
  const handleToggleType = (id: string) => {
    setCriteria(prev => 
      prev.map(c => 
        c.id === id ? { ...c, type: c.type === 'benefit' ? 'cost' : 'benefit' } : c
      )
    );
  };

  // Handle weight change for manual override
  const handleWeightChange = (id: string, value: string) => {
    setEditingWeights(prev => ({ ...prev, [id]: value }));
    setErrorMsg(null);
  };

  // Persist manual weights
  const handleApplyManualWeights = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse values
    const parsed: Record<string, number> = {};
    let sum = 0;
    
    for (const c of criteria) {
      const val = parseFloat(editingWeights[c.id]);
      if (isNaN(val) || val < 0 || val > 100) {
        setErrorMsg(`Bobot ${c.id} harus merupakan angka desimal positif antara 0% s/d 100%`);
        return;
      }
      parsed[c.id] = val / 100;
      sum += val / 100;
    }

    // Check sum is close to 1.0
    if (Math.abs(sum - 1.0) > 0.005) {
      setErrorMsg(`Kumulasi bobot harus 100% (Total saat ini: ${(sum * 100).toFixed(1)}%). Atur ulang persentase agar pas.`);
      return;
    }

    // Apply
    setCriteria(prev => 
      prev.map(c => ({
        ...c,
        weight: parsed[c.id]
      }))
    );
    setIsManualOverride(true);
    setErrorMsg(null);
  };

  // Restore AHP Sync
  const handleEnableAHPSync = () => {
    setIsManualOverride(false);
    syncWithAHP();
    // Update local inputs
    const updatedInputs: Record<string, string> = {};
    criteria.forEach((c, idx) => {
      updatedInputs[c.id] = (ahpWeights[idx] * 100).toFixed(1);
    });
    setEditingWeights(updatedInputs);
    setErrorMsg(null);
  };

  const currentTotal = criteria.reduce((sum, c) => sum + c.weight, 0);

  return (
    <div className="space-y-6 animate-fade-in text-gray-700">
      {/* Description Info */}
      <div>
        <h2 className="font-display text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Manajemen Kriteria & Pembobotan Keputusan
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Atur kriteria benefit (semakin besar semakin baik) atau cost (semakin kecil semakin baik), serta kelola nilai bobot prioritas.
        </p>
      </div>

      {/* Control panel for sync type */}
      <div className="rounded-2xl border border-brand-outline-variant bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isManualOverride ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
              <Settings size={22} className={isManualOverride ? 'animate-none' : 'animate-spin-slow'} />
            </div>
            <div>
              <h4 className="font-display font-bold text-gray-900">
                Mode Pembobotan Saat Ini: {isManualOverride ? 'Kustom Manual Override (User)' : 'Sinkronisasi Otomatis Matriks AHP'}
              </h4>
              <p className="text-xs text-gray-500">
                {isManualOverride 
                  ? 'Anda sedang mengedit bobot secara manual. Nilai ini tidak terpengaruh oleh matriks komparasi AHP.' 
                  : 'Bobot diturunkan langsung dari perhitungan nilai prioritas eigen vektor perbandingan berpasangan.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {isManualOverride && (
              <button
                onClick={handleEnableAHPSync}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-primary px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-brand-primary/90 transition"
              >
                <RefreshCw size={14} />
                Kembalikan Sinkronisasi AHP
              </button>
            )}
            {!isManualOverride && (
              <button
                onClick={() => setIsManualOverride(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-brand-outline bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Ubah Bobot Secara Manual
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Criteria Table List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-brand-outline-variant bg-white overflow-hidden p-5">
            <h3 className="font-display font-bold text-lg text-gray-900 mb-4">
              Konfigurasi Parameter Kriteria
            </h3>

            <div className="overflow-x-auto rounded-xl border border-brand-outline-variant">
              <table className="w-full border-collapse text-left text-sm text-gray-600">
                <thead className="bg-[#f0f4fc] font-display text-xs text-gray-700 uppercase tracking-wider font-semibold border-b border-brand-outline-variant">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Nama Kriteria</th>
                    <th className="px-4 py-3 text-center">Tipe Kriteria</th>
                    <th className="px-4 py-3 text-right">Nilai Bobot</th>
                    <th className="px-4 py-3">Parameter Dasar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {criteria.map((c) => (
                    <tr key={c.id} className="hover:bg-brand-background transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-brand-primary">{c.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900">{c.name}</div>
                        <div className="text-2xs text-gray-400 font-mono mt-0.5">{c.description}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          title="Klik untuk mengubah tipe kriteria"
                          onClick={() => handleToggleType(c.id)}
                          className={`inline-flex items-center rounded-xl px-3 py-1 text-xs font-semibold transition cursor-pointer border ${
                            c.type === 'benefit'
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {c.type === 'benefit' ? 'BENEFIT (Keuntungan)' : 'COST (Biaya)'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-gray-800">
                        {(c.weight * 100).toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-2xs text-gray-500">
                        {c.id === 'C1' && 'Avg Price dari Dataset'}
                        {c.id === 'C2' && 'Avg Quality Score (Defek & Hasil)'}
                        {c.id === 'C3' && 'Avg Lead Time Hari'}
                        {c.id === 'C4' && 'Avg Stock Ketersediaan %'}
                        {c.id === 'C5' && 'Avg Inspection Pass Rate %'}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-brand-surface-low font-semibold border-t border-brand-outline-variant">
                    <td colSpan={3} className="px-4 py-3 text-right">Kumulasi Bobot:</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-brand-primary">
                      {(currentTotal * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-xs text-brand-primary font-medium">
                      {Math.abs(currentTotal - 1.0) < 0.005 ? (
                        <span className="flex items-center gap-1 text-green-750">
                          <Check size={14} /> Stabil (Pas 100%)
                        </span>
                      ) : (
                        <span className="text-rose-600">Terbuka / Tidak Balance</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex gap-2.5 rounded-xl bg-blue-50 p-3.5 text-xs text-brand-primary border border-blue-200 leading-relaxed font-medium">
              <Info size={16} className="shrink-0 mt-0.5" />
              <span>
                <strong>Petunjuk:</strong> Anda dapat mengganti kriteria tipe dari <strong>BENEFIT</strong> ke <strong>COST</strong> (atau sebaliknya) secara instan dengan mengklik tombol berwarna di kolom Tipe Kriteria. Perubahan ini akan segera mengubah hasil optimasi Solusi Ideal pada metode TOPSIS!
              </span>
            </div>
          </div>
        </div>

        {/* Manual Weight Editor overlay */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-brand-outline-variant bg-white p-5 shadow-xs">
            <h3 className="font-display font-bold text-lg text-gray-900 mb-2 flex items-center gap-1.5">
              <Settings size={18} className="text-amber-500" />
              Sesuaikan Bobot
            </h3>
            <p className="text-2xs text-gray-500 mb-4">
              {isManualOverride 
                ? 'Atur porsi persentase kriteria di bawah secara langsung. Pastikan jumlah total persis 100.0%.'
                : 'Beralih ke mode Override Manual untuk mengetik bobot satu per satu.'}
            </p>

            <form onSubmit={handleApplyManualWeights} className="space-y-3">
              {criteria.map((c) => (
                <div key={c.id}>
                  <label className="text-xs font-semibold text-gray-700 flex justify-between mb-1">
                    <span>{c.id} - {c.name}</span>
                    <span className="font-mono text-gray-400">({c.type})</span>
                  </label>
                  <div className="relative rounded-xl border border-brand-outline focus-within:border-brand-primary transition">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      className="w-full border-0 bg-transparent px-3 py-2 text-sm focus:outline-hidden text-right pr-8 font-mono disabled:bg-gray-150 disabled:cursor-not-allowed"
                      value={editingWeights[c.id]}
                      disabled={!isManualOverride}
                      onChange={(e) => handleWeightChange(c.id, e.target.value)}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-xs text-gray-400 font-mono">%</span>
                    </div>
                  </div>
                </div>
              ))}

              {errorMsg && (
                <div className="rounded-xl bg-red-50 p-3 text-2xs text-red-700 border border-red-200 flex items-start gap-1.5 font-medium">
                  <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {isManualOverride ? (
                <button
                  type="submit"
                  className="w-full rounded-xl bg-amber-500 py-2.5 text-xs font-semibold text-white hover:bg-amber-600 transition shadow-md cursor-pointer"
                >
                  Terapkan Bobot Baru
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsManualOverride(true)}
                  className="w-full rounded-xl border border-dashed border-gray-300 bg-gray-50/50 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  Aktifkan Mode Manual
                </button>
              )}
            </form>
          </div>

          <div className="rounded-2xl border border-brand-outline-variant bg-slate-50 p-5">
            <h4 className="font-display font-semibold text-sm text-gray-900 flex items-center gap-1 text-slate-700">
              <HelpCircle size={16} />
              Definisi Kriteria SPK
            </h4>
            <div className="mt-3 space-y-2.5 text-2xs text-gray-500 leading-relaxed">
              <p>📌 <strong>C1 (Harga Penawaran):</strong> Rata-rata harga produk yang ditawarkan supplier. Default: Cost (Semakin murah semakin disukai perusahaan).</p>
              <p>📌 <strong>C2 (Kualitas Berkelanjutan):</strong> Rasio kelulusan mutu (gabungan defect rate & pending rate). Default: Benefit.</p>
              <p>📌 <strong>C3 (Ketepatan Pengiriman):</strong> Lead time logistik rata-rata dalam satuan hari. Default: Cost.</p>
              <p>📌 <strong>C4 (Ketersediaan Stok):</strong> Rasio cadangan stok yang siap dikirim seketika. Default: Benefit.</p>
              <p>📌 <strong>C5 (Akurasi Pengadaan):</strong> Tingkat kelulusan inspeksi visual kemasan luar. Default: Benefit.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
