/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HelpCircle, Star, TrendingUp, Layers, CheckCircle2 } from 'lucide-react';

export default function PermasalahanView() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-brand-primary to-brand-primary-container p-8 text-white shadow-xl">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12">
          <HelpCircle size={320} />
        </div>
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wider uppercase backdrop-blur-xs">
            Deskripsi Sistem
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Latar Belakang & Analisis Permasalahan
          </h1>
          <p className="mt-4 text-brand-secondary-container text-sm sm:text-base leading-relaxed">
            Sistem Pendukung Keputusan (SPK) ini dirancang secara profesional untuk mempermudah manajemen rantai pasokan (supply chain) dalam mengevaluasi, menyeleksi, dan menentukan supplier terbaik berdasarkan data kinerja riil.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Tujuan Sistem */}
        <div id="tujuan_card" className="rounded-2xl border border-brand-outline-variant bg-white p-6 shadow-xs leading-relaxed">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
            <Star size={24} />
          </div>
          <h3 className="mt-4 font-display text-xl font-bold text-gray-900">
            Tujuan Utama Sistem
          </h3>
          <p className="mt-3 text-sm text-gray-600">
            Dalam dunia bisnis modern, memilih pemasok (supplier) tidak lagi hanya didasarkan pada harga termurah. Perusahaan harus menyeimbangkan berbagai kriteria yang saling bertentangan (multi-criteria), seperti biaya, kualitas produk, ketepatan waktu, dan ketersediaan stok.
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-gray-650">
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 text-brand-primary">
                <CheckCircle2 size={16} />
              </span>
              <span><strong>Meningkatkan Efisiensi:</strong> Memilih supplier dengan lead time pengiriman tercepat guna meminimalkan hambatan produksi.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 text-brand-primary">
                <CheckCircle2 size={16} />
              </span>
              <span><strong>Menjaga Kualitas:</strong> Mengidentifikasi supplier dengan tingkat kecacatan produk (defect rate) terendah.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 text-brand-primary">
                <CheckCircle2 size={16} />
              </span>
              <span><strong>Transparansi Keputusan:</strong> Menyediakan kerangka kerja ilmiah berbasis data konkret menggantikan keputusan intuitif.</span>
            </li>
          </ul>
        </div>

        {/* Metodologi */}
        <div id="metode_card" className="rounded-2xl border border-brand-outline-variant bg-white p-6 shadow-xs leading-relaxed">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
            <TrendingUp size={24} />
          </div>
          <h3 className="mt-4 font-display text-xl font-bold text-gray-900">
            Mengapa AHP & TOPSIS?
          </h3>
          <p className="mt-3 text-sm text-gray-600">
            Integrasi metode <strong>Analytical Hierarchy Process (AHP)</strong> dan <strong>Technique for Order of Preference by Similarity to Ideal Solution (TOPSIS)</strong> merupakan kombinasi hibrida terbaik untuk SPK:
          </p>

          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-dashed border-brand-outline-variant bg-brand-background p-3.5">
              <h4 className="font-display text-sm font-bold text-brand-primary flex items-center gap-1.5">
                <span className="badge inline-block h-2 w-2 rounded-full bg-brand-primary"></span>
                AHP untuk Pembobotan Kriteria
              </h4>
              <p className="mt-1 text-xs text-gray-600">
                AHP menguji konsistensi pemikiran manusia melalui matriks perbandingan berpasangan (pairwise comparison). Hal ini menghasilkan nilai bobot kriteria yang solid dan bebas dari penilaian yang kontradiktif (Consistency Ratio &lt; 0.1).
              </p>
            </div>

            <div className="rounded-xl border border-dashed border-brand-outline-variant bg-brand-background p-3.5">
              <h4 className="font-display text-sm font-bold text-brand-primary flex items-center gap-1.5">
                <span className="badge inline-block h-2 w-2 rounded-full bg-brand-primary"></span>
                TOPSIS untuk Pemeringkatan Alternatif
              </h4>
              <p className="mt-1 text-xs text-gray-600">
                TOPSIS menentukan alternatif yang memiliki jarak terdekat dengan solusi ideal positif (kinerja terbaik) sekaligus jarak terjauh dari solusi ideal negatif (kinerja terburuk) secara cepat dan akurat, ideal untuk memproses banyak data alternatif.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alur Kerja SPK */}
      <div id="flow_card" className="rounded-2xl border border-brand-outline-variant bg-white p-6 shadow-xs">
        <h3 className="font-display text-xl font-bold text-gray-900 flex items-center gap-2">
          <Layers size={22} className="text-brand-primary" />
          Alur Kerja Perhitungan Sistem
        </h3>
        <p className="mt-2 text-sm text-gray-650 leading-relaxed">
          Sistem mengintegrasikan data historis pengadaan dengan penentuan bobot subjektif manajemen secara matematis:
        </p>

        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-brand-background p-4 text-center border border-brand-outline-variant">
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-white text-sm font-bold">1</div>
            <h5 className="mt-3 text-sm font-semibold text-gray-900">Analisis Kinerja Dataset</h5>
            <p className="mt-1 text-xs text-gray-500">Ekstraksi nilai rata-rata harga, cacat, ketersediaan, dan inspeksi dari logistik pemasok.</p>
          </div>

          <div className="rounded-xl bg-brand-background p-4 text-center border border-brand-outline-variant">
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-white text-sm font-bold">2</div>
            <h5 className="mt-3 text-sm font-semibold text-gray-900">Pembobotan Berpasangan</h5>
            <p className="mt-1 text-xs text-gray-500">Mengevaluasi kepentingan relatif kriteria melalui matriks AHP hingga mencapai konsistensi.</p>
          </div>

          <div className="rounded-xl bg-brand-background p-4 text-center border border-brand-outline-variant">
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-white text-sm font-bold">3</div>
            <h5 className="mt-3 text-sm font-semibold text-gray-900">Normalisasi & Jarak</h5>
            <p className="mt-1 text-xs text-gray-500">Matriks keputusan TOPSIS dinormalisasi, dikalikan bobot AHP, lalu solusi ideal diidentifikasi.</p>
          </div>

          <div className="rounded-xl bg-brand-background p-4 text-center border border-brand-outline-variant">
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-white text-sm font-bold">4</div>
            <h5 className="mt-3 text-sm font-semibold text-gray-900">Rekomendasi Terbaik</h5>
            <p className="mt-1 text-xs text-gray-500">Menghitung koefisien kedekatan untuk merangking alternatif supplier dari yang terbaik.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
