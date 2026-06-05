/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Criteria } from './types';
import { parseDataset, getSupplierMetrics } from './dataset';
import { calculateAHP, calculateTOPSIS, getDefaultPairwiseMatrix } from './calculations';

// Impor Views
import DashboardView from './components/DashboardView';
import PermasalahanView from './components/PermasalahanView';
import DatasetView from './components/DatasetView';
import KriteriaBobotView from './components/KriteriaBobotView';
import AHPView from './components/AHPView';
import TOPSISView from './components/TOPSISView';
import RankingView from './components/RankingView';
import RekomendasiView from './components/RekomendasiView';

// Icons
import {
  Menu,
  X,
  LayoutDashboard,
  HelpCircle,
  Database,
  Sliders,
  Calculator,
  Layers,
  Award,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';

const DEFAULT_CRITERIA: Criteria[] = [
  { id: 'C1', name: 'Harga Penawaran', type: 'cost', weight: 0.20, description: 'Rata-rata harga satuan penawaran supplier' },
  { id: 'C2', name: 'Kualitas Berkelanjutan', type: 'benefit', weight: 0.35, description: 'Rasio kualitas material bebas defek' },
  { id: 'C3', name: 'Ketepatan Pengiriman', type: 'cost', weight: 0.15, description: 'Rata-rata keterlambatan pengiriman logistik' },
  { id: 'C4', name: 'Ketersediaan Stok', type: 'benefit', weight: 0.10, description: 'Rasio kesiapan cadangan kuantitas stok' },
  { id: 'C5', name: 'Akurasi Pengadaan', type: 'benefit', weight: 0.20, description: 'Rasio kelulusan inspeksi visual kemasan' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isManualOverride, setIsManualOverride] = useState<boolean>(false);
  
  // State for AHP Pairwise comparison matrix
  const [pairwiseMatrix, setPairwiseMatrix] = useState<number[][]>(() => getDefaultPairwiseMatrix());
  
  // State for editable criteria attributes (benefit/cost, and weights when overridden)
  const [criteria, setCriteria] = useState<Criteria[]>(() => DEFAULT_CRITERIA);

  // 1. Memoized Parse raw dataset rows & supplier statistics aggregates
  const datasetRows = useMemo(() => parseDataset(), []);
  const supplierMetrics = useMemo(() => getSupplierMetrics(datasetRows), [datasetRows]);

  // 2. Memoized AHP calculations
  const ahpResult = useMemo(() => calculateAHP(pairwiseMatrix), [pairwiseMatrix]);

  // 3. Resolve weights either from AHP result or manual weights
  const resolvedCriteria = useMemo(() => {
    if (isManualOverride) {
      return criteria;
    }
    // Sync with AHP weights computed
    return criteria.map((c, idx) => ({
      ...c,
      weight: ahpResult.weights[idx]
    }));
  }, [criteria, isManualOverride, ahpResult.weights]);

  // 4. Calculate final TOPSIS based on resolved weights
  const topsisResult = useMemo(() => {
    return calculateTOPSIS(supplierMetrics, resolvedCriteria);
  }, [supplierMetrics, resolvedCriteria]);

  // Handler to enforce AHP sync in criteria tab
  const handleSyncWithAHP = () => {
    setCriteria(prev => 
      prev.map((c, idx) => ({
        ...c,
        weight: ahpResult.weights[idx]
      }))
    );
  };

  // Handler to reset AHP matrix to default
  const handleResetAHPMatrix = () => {
    setPairwiseMatrix(getDefaultPairwiseMatrix());
  };

  // Map of menus with beautiful icons
  const menus = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'permasalahan', name: 'Permasalahan', icon: HelpCircle },
    { id: 'dataset', name: 'Dataset', icon: Database },
    { id: 'kriteria', name: 'Kriteria & Bobot', icon: Sliders },
    { id: 'ahp', name: 'Perhitungan AHP', icon: Calculator },
    { id: 'topsis', name: 'Perhitungan TOPSIS', icon: Layers },
    { id: 'ranking', name: 'Ranking Supplier', icon: Award },
    { id: 'rekomendasi', name: 'Rekomendasi', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-brand-background flex flex-col md:flex-row font-sans text-gray-800 antialiased selection:bg-brand-secondary-container">
      
      {/* Mobile Top App Bar */}
      <header className="md:hidden bg-brand-primary p-4 text-white flex items-center justify-between shadow-md sticky top-0 z-50 print:hidden">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">
            SPK
          </div>
          <span className="font-display font-medium text-sm tracking-wide">SPK Supplier Terbaik</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-sm hover:bg-white/10 active:bg-white/20 transition cursor-pointer"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 bg-linear-to-b from-[#0a1a3a] to-[#041026] text-slate-100 w-64 p-5 z-40 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        print:hidden shrink-0 shadow-2xl md:shadow-none
      `}>
        {/* Brand Logo */}
        <div className="hidden md:flex items-center gap-3 pb-6 border-b border-white/10 mb-6">
          <div className="h-9 w-9 rounded-xl bg-linear-to-br from-brand-primary-container to-brand-primary flex items-center justify-center font-black text-sm text-white shadow-lg shadow-brand-primary/20">
            SPK
          </div>
          <div>
            <h1 className="font-display font-bold text-sm tracking-wider text-white">SPK Supplier</h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">AHP - TOPSIS</p>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="space-y-1.5">
          {menus.map((m) => {
            const IconComponent = m.icon;
            const isActive = activeTab === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setActiveTab(m.id);
                  setSidebarOpen(false);
                }}
                className={`w-full rounded-xl px-4 py-3 text-xs font-semibold flex items-center gap-3.5 transition duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <IconComponent size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span>{m.name}</span>
                {isActive && <ChevronRight size={12} className="ml-auto" />}
              </button>
            );
          })}
        </nav>

        {/* Help footer */}
        <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-white/5 border border-white/10 text-[10px] text-slate-400 space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-slate-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            AHP & TOPSIS Engine Live
          </p>
          <p>Kategori: Multi-Criteria Decision Analysis.</p>
        </div>
      </aside>

      {/* Backdrop for mobile navigation */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/45 z-30 md:hidden print:hidden"
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-5 sm:p-8 md:p-10 max-w-[1300px] w-full mx-auto pb-24 print:p-0 print:pb-0">
        
        {/* Main tabs routing content */}
        {activeTab === 'dashboard' && (
          <DashboardView
            suppliers={supplierMetrics}
            criteria={resolvedCriteria}
            topsisResult={topsisResult}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'permasalahan' && (
          <PermasalahanView />
        )}

        {activeTab === 'dataset' && (
          <DatasetView />
        )}

        {activeTab === 'kriteria' && (
          <KriteriaBobotView
            criteria={resolvedCriteria}
            setCriteria={setCriteria}
            ahpWeights={ahpResult.weights}
            isManualOverride={isManualOverride}
            setIsManualOverride={setIsManualOverride}
            syncWithAHP={handleSyncWithAHP}
          />
        )}

        {activeTab === 'ahp' && (
          <AHPView
            criteria={resolvedCriteria}
            ahpResult={ahpResult}
            setPairwiseMatrix={setPairwiseMatrix}
            resetAHPMatrix={handleResetAHPMatrix}
          />
        )}

        {activeTab === 'topsis' && (
          <TOPSISView
            suppliers={supplierMetrics}
            criteria={resolvedCriteria}
            topsisResult={topsisResult}
          />
        )}

        {activeTab === 'ranking' && (
          <RankingView
            suppliers={supplierMetrics}
            topsisResult={topsisResult}
          />
        )}

        {activeTab === 'rekomendasi' && (
          <RekomendasiView
            suppliers={supplierMetrics}
            topsisResult={topsisResult}
            criteria={resolvedCriteria}
          />
        )}

      </main>

    </div>
  );
}
