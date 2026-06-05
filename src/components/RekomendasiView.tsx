/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SupplierMetrics, TOPSISResult, Criteria } from '../types';
import { ShieldCheck, Printer, CheckCircle2, Award, Calendar, AlertCircle, FileText, Landmark, Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface RekomendasiViewProps {
  suppliers: SupplierMetrics[];
  topsisResult: TOPSISResult;
  criteria: Criteria[];
}

export default function RekomendasiView({
  suppliers,
  topsisResult,
  criteria,
}: RekomendasiViewProps) {
  // Find winner
  const sortedRanks = [...topsisResult.ranking].sort((a, b) => a.rank - b.rank);
  const winnerName = sortedRanks[0]?.supplierName;
  const winnerMetrics = suppliers.find(s => s.displayName === winnerName);

  if (!winnerMetrics) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-800">
        <AlertCircle size={32} className="mx-auto mb-2 text-rose-500" />
        No supplier data found to calculate recommendations.
      </div>
    );
  }

  // Calculate averages for comparison
  const averages = {
    price: suppliers.reduce((sum, s) => sum + s.price, 0) / suppliers.length,
    quality: suppliers.reduce((sum, s) => sum + s.qualityScore, 0) / suppliers.length,
    leadTime: suppliers.reduce((sum, s) => sum + s.leadTime, 0) / suppliers.length,
    availability: suppliers.reduce((sum, s) => sum + s.availability, 0) / suppliers.length,
    inspection: suppliers.reduce((sum, s) => sum + s.inspectionPassRate, 0) / suppliers.length,
  };

  // Compute percentages & differences
  const comparePrice = ((averages.price - winnerMetrics.price) / averages.price) * 100;
  const compareQuality = winnerMetrics.qualityScore - averages.quality;
  const compareLead = averages.leadTime - winnerMetrics.leadTime; // positive is good
  const compareAvail = winnerMetrics.availability - averages.availability;

  // Dynamically analyze top supplier advantages
  const strengthsList: string[] = [];
  if (winnerMetrics.price < averages.price) {
    const savings = ((averages.price - winnerMetrics.price) / averages.price) * 100;
    strengthsList.push(`efisiensi harga sebesar ${winnerMetrics.price.toFixed(4)} (lebih hemat ${savings.toFixed(1)}% dibanding rata-rata pasokan ${averages.price.toFixed(4)})`);
  }
  if (winnerMetrics.qualityScore > averages.quality) {
    const qualDiff = winnerMetrics.qualityScore - averages.quality;
    strengthsList.push(`skor kualitas rata-rata sebesar ${winnerMetrics.qualityScore.toFixed(2)}% (melampaui rata-rata industri yang sebesar ${averages.quality.toFixed(2)}% dengan selisih +${qualDiff.toFixed(1)}%)`);
  }
  if (winnerMetrics.leadTime < averages.leadTime) {
    const ltDiff = averages.leadTime - winnerMetrics.leadTime;
    strengthsList.push(`kecepatan waktu kirim (lead time) rata-rata ${winnerMetrics.leadTime.toFixed(1)} hari (lebih cepat ${ltDiff.toFixed(1)} hari dibandingkan rerata pasar sebesar ${averages.leadTime.toFixed(1)} hari)`);
  }
  if (winnerMetrics.availability > averages.availability) {
    const avDiff = winnerMetrics.availability - averages.availability;
    strengthsList.push(`rasio ketahanan ketersediaan produk (availability) sebesar ${winnerMetrics.availability.toFixed(1)}% (lebih tinggi +${avDiff.toFixed(1)}% di atas rerata ${averages.availability.toFixed(1)}%)`);
  }
  if (winnerMetrics.inspectionPassRate > averages.inspection) {
    const insDiff = winnerMetrics.inspectionPassRate - averages.inspection;
    strengthsList.push(`tingkat kelulusan inspeksi pengadaan yang sangat ketat sebesar ${winnerMetrics.inspectionPassRate.toFixed(1)}% (lebih tinggi +${insDiff.toFixed(1)}% dari rata-rata ${averages.inspection.toFixed(1)}%)`);
  }

  const generatedAnalysis = strengthsList.length > 0
    ? `Keunggulan utama dari supplier terpilih meliputi: ${strengthsList.join(', dan ')}.`
    : `Pemasok ini menunjukkan kinerja yang merata, konsisten, dan stabil di setiap lini operasional pengadaan dibandingkan rata-rata supplier alternatif lainnya.`;

  const [isDownloading, setIsDownloading] = useState(false);

  const replaceOklchInCss = (cssText: string): string => {
    return cssText.replace(/oklch\(([^)]+)\)/g, (match, p1) => {
      try {
        const parts = p1.trim().replace(/\s*\/\s*/g, ' ').split(/\s+/);
        if (parts.length < 3) return 'transparent';

        let l = parts[0].endsWith('%') ? parseFloat(parts[0]) / 100 : parseFloat(parts[0]);
        let c = parts[1].endsWith('%') ? (parseFloat(parts[1]) / 100) * 0.4 : parseFloat(parts[1]);
        let h = parseFloat(parts[2].replace('deg', ''));
        if (isNaN(h)) h = 0;

        let a = 1;
        if (parts.length >= 4) {
          const aPart = parts[3];
          a = aPart.endsWith('%') ? parseFloat(aPart) / 100 : parseFloat(aPart);
        }

        if (isNaN(l)) l = 0.5;
        if (isNaN(c)) c = 0;

        // Polar coordinates (c, h) to Cartesian (a_, b_)
        const rad = (h * Math.PI) / 180;
        const a_ = c * Math.cos(rad);
        const b_ = c * Math.sin(rad);

        // OKLAB to LMS
        const l_ = l + 0.3963377774 * a_ + 0.2158037573 * b_;
        const m_ = l - 0.1055613458 * a_ - 0.0638541728 * b_;
        const s_ = l - 0.0894841775 * a_ - 1.2914855480 * b_;

        // Cube LMS to linear LMS
        const l3 = l_ * l_ * l_;
        const m3 = m_ * m_ * m_;
        const s3 = s_ * s_ * s_;

        // Linear LMS to linear RGB
        let r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
        let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
        let b = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

        // Gamma correction to sRGB
        const fn = (x: number) => {
          if (isNaN(x) || x <= 0) return 0;
          return x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
        };
        
        let r_s = Math.round(Math.max(0, Math.min(1, fn(r))) * 255);
        let g_s = Math.round(Math.max(0, Math.min(1, fn(g))) * 255);
        let b_s = Math.round(Math.max(0, Math.min(1, fn(b))) * 255);

        if (a === 1) {
          return `rgb(${r_s}, ${g_s}, ${b_s})`;
        } else {
          return `rgba(${r_s}, ${g_s}, ${b_s}, ${a})`;
        }
      } catch (e) {
        console.warn('Error converting OKLCH color:', e);
        return 'transparent';
      }
    });
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('print_report');
    if (!element) return;

    setIsDownloading(true);
    try {
      // Small delay to ensure any layout classes resolve
      await new Promise((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(element, {
        scale: 2, // Double resolution for ultra-sharp vector rendering
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // Replace OKLCH colors inside cloned stylesheets
          const styles = clonedDoc.getElementsByTagName('style');
          for (let i = 0; i < styles.length; i++) {
            try {
              styles[i].innerHTML = replaceOklchInCss(styles[i].innerHTML);
            } catch (e) {
              console.warn('Error rewriting oklch styles:', e);
            }
          }

          // Replace OKLCH colors inside cloned inline style attributes
          const allElements = clonedDoc.getElementsByTagName('*');
          for (let i = 0; i < allElements.length; i++) {
            const el = allElements[i] as HTMLElement;
            if (el.style && el.style.cssText && el.style.cssText.includes('oklch')) {
              try {
                el.style.cssText = replaceOklchInCss(el.style.cssText);
              } catch (e) {
                console.warn('Error rewriting inline style:', e);
              }
            }
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const margin = 10; // A4 standard border margin
      const contentWidth = pdfWidth - (margin * 2);
      
      const imgWidthPx = canvas.width;
      const imgHeightPx = canvas.height;
      
      const ratio = imgWidthPx / contentWidth;
      const imgHeightMm = imgHeightPx / ratio;

      if (imgHeightMm <= pdfHeight - (margin * 2)) {
        // Single page styling
        const yOffset = (pdfHeight - imgHeightMm) / 2;
        pdf.addImage(imgData, 'PNG', margin, yOffset, contentWidth, imgHeightMm);
      } else {
        // Spans multiple pages
        let position = margin;
        let remainingHeight = imgHeightMm;
        
        pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeightMm);
        remainingHeight -= (pdfHeight - (margin * 2));
        position -= (pdfHeight - (margin * 2));
        
        while (remainingHeight > 0) {
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeightMm);
          remainingHeight -= (pdfHeight - (margin * 2));
          position -= (pdfHeight - (margin * 2));
        }
      }

      pdf.save(`Laporan_Rekomendasi_Supplier_REC-${winnerMetrics.phoneCode || '00'}.pdf`);
    } catch (error) {
      console.error('Terjadi kesalahan saat mengunduh PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatMoney = (val: number) => {
    return val.toFixed(4);
  };

  return (
    <div className="space-y-6 animate-fade-in text-gray-700">
      {/* Title block with single action button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <h2 className="font-display text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-650 bg-clip-text text-transparent">
            Laporan Rekomendasi Resmi Pemilihan Supplier
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Unduh laporan keputusan resmi hasil analisis integrasi algoritma AHP dan TOPSIS dalam bentuk file PDF.
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-primary/95 transition cursor-pointer disabled:opacity-60"
          >
            {isDownloading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Membuat PDF...
              </>
            ) : (
              <>
                <Download size={15} />
                Cetak Laporan PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Print Ready Document Card */}
      <div id="print_report" className="rounded-3xl border border-brand-outline-variant bg-white p-8 sm:p-12 shadow-sm relative overflow-hidden print:border-0 print:p-0 print:shadow-none font-sans">
        
        {/* Top Header Watermark */}
        <div className="absolute top-0 right-0 h-40 w-40 bg-linear-to-bl from-brand-primary/5 to-transparent rounded-bl-full pointer-events-none"></div>
        
        {/* Document Header */}
        <div className="border-b-2 border-brand-primary pb-6 flex flex-col md:flex-row md:justify-between gap-4">
          <div className="space-y-1">
            <span className="flex items-center gap-2 text-brand-primary font-bold tracking-wider text-xs">
              <Landmark size={18} />
              SISTEM PENDUKUNG KEPUTUSAN (SPK)
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-950">
              LAPORAN REKOMENDASI SUPPLIER
            </h1>
            <p className="text-xs text-gray-500 font-semibold font-mono">Nomor Laporan: REC-2026-00{(sortedRanks[0]?.rank || 1)}</p>
          </div>
          
          <div className="text-left md:text-right text-xs text-gray-600 self-start md:self-end font-medium space-y-1">
            <p className="flex items-center md:justify-end gap-1 font-semibold text-gray-800">
              <Calendar size={13} className="text-brand-primary" /> 
              Tanggal Keputusan: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p>Platform: <span className="font-bold text-brand-primary">SPK Supplier Terbaik</span></p>
          </div>
        </div>

        {/* Supplier Terpilih Showcase Section */}
        <div className="my-8 bg-slate-50 rounded-2xl p-6 border border-brand-outline-variant">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wider block text-center mb-3">
            SUPPLIER TERPILIH RECOMMENDATION SUCCESS
          </span>
          
          <div className="grid md:grid-cols-3 gap-4 items-center text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="p-2 space-y-1 md:col-span-1.5 text-center md:text-left">
              <span className="text-3xs uppercase tracking-widest font-extrabold text-gray-500 block">Nama Supplier Terbaik</span>
              <h2 className="font-display text-xl sm:text-2xl font-black text-brand-primary">
                {winnerMetrics.displayName}
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                {winnerMetrics.address}
              </p>
            </div>

            <div className="p-2 text-center">
              <span className="text-3xs uppercase tracking-widest font-extrabold text-gray-500 block">Nilai Preferensi (V)</span>
              <span className="text-2xl font-black text-brand-primary font-mono block mt-1">
                {sortedRanks[0]?.score.toFixed(4)}
              </span>
            </div>

            <div className="p-2 text-center">
              <span className="text-3xs uppercase tracking-widest font-extrabold text-gray-500 block">Pemeringkatan</span>
              <span className="text-xl font-bold text-amber-600 block mt-1.5 font-mono">
                Peringkat: 1
              </span>
            </div>
          </div>
        </div>

        {/* Content Justification */}
        <div className="space-y-6">
          <div className="bg-slate-50 border-l-4 border-brand-primary p-4 rounded-r-xl">
            <h4 className="font-display font-bold text-xs text-gray-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <FileText size={15} className="text-brand-primary" />
              JUSTIFIKASI EVALUASI KINERJA
            </h4>
            <div className="text-xs text-gray-700 leading-relaxed font-medium space-y-2">
              <p>
                Berdasarkan evaluasi multi-kriteria menggunakan metode AHP dan TOPSIS, supplier ini memperoleh nilai preferensi tertinggi sebesar <strong>{sortedRanks[0]?.score.toFixed(4)}</strong> dibandingkan alternatif lainnya sehingga direkomendasikan sebagai supplier terbaik. Supplier <strong>{winnerMetrics.displayName}</strong> menunjukkan kehandalan optimal di seluruh kriteria bobot yang disyaratkan oleh manajemen pengadaan.
              </p>
              <p>
                {generatedAnalysis}
              </p>
            </div>
          </div>

          {/* Analysis of Criteria */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-xs text-gray-900 uppercase tracking-wider border-b pb-1.5 flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-brand-primary" />
              ANALISIS KRITERIA UTAMA
            </h4>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* C1: Cost/Price */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-3xs">
                <div className="flex justify-between items-center">
                  <h5 className="font-display text-xs font-bold text-gray-900">1. Efisiensi Biaya</h5>
                  <span className="text-[10px] bg-green-50 text-green-700 font-bold px-1.5 py-0.5 rounded-full">
                    {comparePrice > 0 ? `${comparePrice.toFixed(1)}% Lebih Hemat` : `Sesuai Target`}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2 rounded-lg font-mono text-gray-600">
                  <div>
                    <span className="text-3xs text-gray-400 block font-sans">Skor {winnerMetrics.displayName}</span>
                    <strong className="text-gray-800">{formatMoney(winnerMetrics.price)}</strong>
                  </div>
                  <div>
                    <span className="text-3xs text-gray-400 block font-sans">Rata-rata Seluruh Supplier</span>
                    <strong className="text-gray-800">{formatMoney(averages.price)}</strong>
                  </div>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Supplier memiliki biaya rata-rata lebih rendah dibandingkan rata-rata supplier lainnya sehingga memberikan keuntungan dari sisi efisiensi biaya.
                </p>
              </div>

              {/* C2: Quality */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-3xs">
                <div className="flex justify-between items-center">
                  <h5 className="font-display text-xs font-bold text-gray-900">2. Kualitas Mutu</h5>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded-full">
                    Defect {(winnerMetrics.defectRate * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2 rounded-lg font-mono text-gray-600">
                  <div>
                    <span className="text-3xs text-gray-400 block font-sans">Kurasi Kualitas Terpilih</span>
                    <strong className="text-gray-800">{winnerMetrics.qualityScore.toFixed(2)}%</strong>
                  </div>
                  <div>
                    <span className="text-3xs text-gray-400 block font-sans">Rata-rata Kualitas</span>
                    <strong className="text-gray-800">{averages.quality.toFixed(2)}%</strong>
                  </div>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Supplier menunjukkan kualitas yang lebih baik dibandingkan rata-rata alternatif lainnya berdasarkan tingkat defect yang lebih rendah.
                </p>
              </div>

              {/* C3: Lead Time */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-3xs">
                <div className="flex justify-between items-center">
                  <h5 className="font-display text-xs font-bold text-gray-900">3. Lead Time</h5>
                  <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded-full">
                    {winnerMetrics.leadTime.toFixed(1)} Hari
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2 rounded-lg font-mono text-gray-600">
                  <div>
                    <span className="text-3xs text-gray-400 block font-sans">Waktu Terpilih</span>
                    <strong className="text-gray-800">{winnerMetrics.leadTime.toFixed(1)} Hari</strong>
                  </div>
                  <div>
                    <span className="text-3xs text-gray-400 block font-sans">Rata-rata Lead Time</span>
                    <strong className="text-gray-800">{averages.leadTime.toFixed(1)} Hari</strong>
                  </div>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Supplier memiliki waktu pemenuhan yang lebih cepat dibandingkan rata-rata supplier lainnya sehingga meningkatkan efisiensi rantai pasok.
                </p>
              </div>

              {/* C4: Availability */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-3xs">
                <div className="flex justify-between items-center">
                  <h5 className="font-display text-xs font-bold text-gray-900">4. Ketersediaan Produk</h5>
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded-full">
                    Stok {winnerMetrics.availability.toFixed(1)}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2 rounded-lg font-mono text-gray-600">
                  <div>
                    <span className="text-3xs text-gray-400 block font-sans">Ketersediaan Terpilih</span>
                    <strong className="text-gray-800">{winnerMetrics.availability.toFixed(1)}%</strong>
                  </div>
                  <div>
                    <span className="text-3xs text-gray-400 block font-sans">Rata-rata Stok</span>
                    <strong className="text-gray-800">{averages.availability.toFixed(1)}%</strong>
                  </div>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Supplier memiliki tingkat ketersediaan produk yang baik sehingga mampu mendukung kontinuitas operasional perusahaan.
                </p>
              </div>
            </div>
          </div>

          {/* TOPSIS Summary Table */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs text-gray-900 uppercase tracking-wider border-b pb-1.5">
              RINGKASAN HASIL TOPSIS
            </h4>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-[#f8fafc] border-b border-gray-200 text-gray-600 font-semibold text-[11px] uppercase">
                  <tr>
                    <th className="px-4 py-3 text-center w-24">Ranking</th>
                    <th className="px-4 py-3">Supplier</th>
                    <th className="px-4 py-3 text-right font-mono">Nilai Preferensi (V)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedRanks.map((item, idx) => {
                    const mappedName = suppliers.find(s => s.supplierName === item.supplierName || s.displayName === item.supplierName)?.displayName || item.supplierName;
                    const isWinner = idx === 0;
                    return (
                      <tr key={idx} className={isWinner ? 'bg-brand-primary/5 font-semibold text-brand-primary' : 'hover:bg-gray-50'}>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full text-2xs ${isWinner ? 'bg-amber-100 text-amber-800 font-extrabold' : 'bg-gray-100 text-gray-600'}`}>
                            {idx + 1}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">{mappedName}</td>
                        <td className="px-4 py-2.5 text-right font-mono font-bold text-gray-900">{item.score.toFixed(4)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Recommendation Message */}
          <div className="p-4 bg-slate-50 border border-brand-outline-variant rounded-xl leading-relaxed">
            <h4 className="font-display font-bold text-xs text-gray-900 uppercase tracking-wider mb-1">
              REKOMENDASI SISTEM
            </h4>
            <p className="text-xs text-gray-700 leading-relaxed font-semibold">
              Berdasarkan hasil evaluasi seluruh kriteria menggunakan metode AHP dan TOPSIS, supplier yang direkomendasikan secara otomatis oleh sistem kepada komite pengadaan adalah <span className="text-brand-primary text-sm font-black">{winnerMetrics.displayName}</span> karena memperoleh nilai preferensi tertinggi yaitu sebesar <strong>{sortedRanks[0]?.score.toFixed(4)}</strong> (Rerata skor seluruh supplier: {(topsisResult.preferences.reduce((a, b) => a + b, 0) / topsisResult.preferences.length).toFixed(4)}). {strengthsList.length > 0 ? `Pemasok ini terpilih didukung oleh performa absolut superior terutama pada: ${strengthsList[0].split(' sebesar ')[0]}.` : ''} Keputusan ini sepenuhnya didasari integritas data rantai pasok aktual serta konsistensi bobot matriks perbandingan berpasangan.
            </p>
          </div>

          {/* Signature Row */}
          <div className="pt-8 border-t border-dashed border-gray-200 grid grid-cols-3 gap-6 text-center text-[10px] text-gray-600">
            <div className="space-y-12">
              <p className="font-semibold text-gray-500">Dihasilkan oleh:</p>
              <div>
                <p className="font-bold text-gray-900">SPK Supplier Terbaik</p>
                <p className="text-[9px] text-gray-400">Modul AHP-TOPSIS Engine</p>
              </div>
            </div>

            <div className="space-y-12">
              <p className="font-semibold text-gray-500">Diverifikasi oleh:</p>
              <div>
                <p className="font-bold text-gray-900">Sistem Evaluasi Supplier</p>
                <p className="text-[9px] text-gray-400">Validasi Algoritma Berpasangan</p>
              </div>
            </div>

            <div className="space-y-12">
              <p className="font-semibold text-gray-500">Disahkan oleh:</p>
              <div>
                <p className="font-bold text-gray-900">Manajer Supply Chain</p>
                <p className="text-[9px] text-gray-400">Otoritas Pengadaan Pusat</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
