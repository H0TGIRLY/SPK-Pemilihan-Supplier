/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { DatasetRow } from '../types';
import { parseDataset, supplierNameMap } from '../dataset';
import { Search, Database, Truck, Percent, PackageOpen, LayoutGrid, FileSpreadsheet } from 'lucide-react';

export default function DatasetView() {
  const [search, setSearch] = useState('');
  const [productTypeFilter, setProductTypeFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Fully parse the raw dataset
  const dataset: DatasetRow[] = useMemo(() => parseDataset(), []);

  // Filtered dataset
  const filteredDataset = useMemo(() => {
    return dataset.filter((row) => {
      const matchSearch = row.sku.toLowerCase().includes(search.toLowerCase()) ||
        row.location.toLowerCase().includes(search.toLowerCase()) ||
        row.inspectionResults.toLowerCase().includes(search.toLowerCase()) ||
        row.shippingCarrier.toLowerCase().includes(search.toLowerCase());

      const matchProductType = productTypeFilter === 'all' || row.productType === productTypeFilter;
      const matchSupplier = supplierFilter === 'all' || row.supplierName === supplierFilter;

      return matchSearch && matchProductType && matchSupplier;
    });
  }, [dataset, search, productTypeFilter, supplierFilter]);

  // Statistics
  const stats = useMemo(() => {
    const totalLines = dataset.length;
    const suppliers = new Set(dataset.map(d => d.supplierName));
    const avgDefect = dataset.reduce((a, b) => a + b.defectRate, 0) / totalLines;
    const avgLead = dataset.reduce((a, b) => a + b.leadTime, 0) / totalLines;

    return {
      totalLines,
      uniqueSuppliers: suppliers.size,
      avgDefect: parseFloat((avgDefect * 100).toFixed(2)),
      avgLead: parseFloat(avgLead.toFixed(1)),
    };
  }, [dataset]);

  // Pagination
  const paginatedRows = useMemo(() => {
    const startIdx = (currentPage - 1) * rowsPerPage;
    return filteredDataset.slice(startIdx, startIdx + rowsPerPage);
  }, [filteredDataset, currentPage]);

  const totalPages = Math.ceil(filteredDataset.length / rowsPerPage) || 1;

  // Render product types lists for dropdown
  const productTypes = useMemo(() => {
    return Array.from(new Set(dataset.map((d) => d.productType)));
  }, [dataset]);

  // Render supplier lists
  const supplierRawNames = useMemo(() => {
    return Array.from(new Set(dataset.map((d) => d.supplierName))).sort();
  }, [dataset]);

  const handlePageChange = (p: number) => {
    if (p >= 1 && p <= totalPages) {
      setCurrentPage(p);
    }
  };

  // Helper formatting numbers with thousands separators
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="space-y-6 animate-fade-in text-gray-700">
      {/* Header Info */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dataset Kinerja Logistik Pemasok
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Data mentah historis pengadaan komparatif (100 transaksi riil) yang direkam dari sistem rantai pasok global.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 border border-green-200 self-start sm:self-auto">
          <Database size={16} />
          <span>Database Aktif (Original Terbuka)</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-brand-outline-variant bg-white p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold block">Total Baris Transaksi</span>
            <span className="text-2xl font-bold font-display text-gray-800">{stats.totalLines}</span>
          </div>
        </div>

        <div className="rounded-xl border border-brand-outline-variant bg-white p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-orange-50 text-orange-600">
            <LayoutGrid size={24} />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold block">Jumlah Supplier Terpilih</span>
            <span className="text-2xl font-bold font-display text-gray-800">{stats.uniqueSuppliers}</span>
          </div>
        </div>

        <div className="rounded-xl border border-brand-outline-variant bg-white p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
            <Truck size={24} />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold block">Rata-rata Lead Time</span>
            <span className="text-2xl font-bold font-display text-gray-800">{stats.avgLead} Hari</span>
          </div>
        </div>

        <div className="rounded-xl border border-brand-outline-variant bg-white p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-rose-50 text-rose-600">
            <Percent size={24} />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold block">Rata-rata Rasio Defek</span>
            <span className="text-2xl font-bold font-display text-gray-800">{stats.avgDefect}%</span>
          </div>
        </div>
      </div>

      {/* Search and Filters panel */}
      <div className="rounded-2xl border border-brand-outline-variant bg-white p-5 shadow-xs">
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Search box */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Cari SKU, carrier, lokasi..."
              className="w-full rounded-xl border border-brand-outline px-3 py-2 pl-10 text-sm focus:border-brand-primary focus:outline-hidden"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Product Type Filter */}
          <div>
            <select
              value={productTypeFilter}
              onChange={(e) => {
                setProductTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-brand-outline px-3 py-2 text-sm focus:border-brand-primary focus:outline-hidden"
            >
              <option value="all">Semua Tipe Produk</option>
              {productTypes.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Supplier Filter */}
          <div>
            <select
              value={supplierFilter}
              onChange={(e) => {
                setSupplierFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-brand-outline px-3 py-2 text-sm focus:border-brand-primary focus:outline-hidden"
            >
              <option value="all">Semua Supplier</option>
              {supplierRawNames.map(s => {
                const map = supplierNameMap[s];
                return (
                  <option key={s} value={s}>
                    {map ? `${map.displayName} (${s})` : s}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Dataset Table render */}
        <div className="mt-6 overflow-x-auto rounded-xl border border-brand-outline-variant">
          <table className="w-full border-collapse text-left text-sm text-gray-650">
            <thead className="bg-[#f0f4fc] font-display text-xs text-gray-700 uppercase tracking-wider font-semibold border-b border-brand-outline-variant">
              <tr>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Pemasok</th>
                <th className="px-4 py-3 text-right">Harga Utama</th>
                <th className="px-4 py-3 text-right">Lead Time (Hari)</th>
                <th className="px-4 py-3 text-right">Defek / Cacat (%)</th>
                <th className="px-4 py-3 text-right">Ketersediaan (%)</th>
                <th className="px-4 py-3">Inspeksi</th>
                <th className="px-4 py-3">Tipe Produk</th>
                <th className="px-4 py-3">Lokasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {paginatedRows.length > 0 ? (
                paginatedRows.map((row) => {
                  const displaySupplierName = supplierNameMap[row.supplierName]?.displayName || row.supplierName;
                  let defectVal = row.defectRate;
                  if (defectVal > 1) defectVal = defectVal / 100;

                  return (
                    <tr key={row.sku} className="hover:bg-brand-background transition-colors duration-150">
                      <td className="px-4 py-3 font-mono font-medium text-brand-primary">{row.sku}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900">{displaySupplierName}</div>
                        <div className="text-2xs text-gray-400 uppercase tracking-widest">{row.supplierName}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono">{formatNumber(row.price)}</td>
                      <td className="px-4 py-3 text-right font-mono font-semibold">{row.leadTime}</td>
                      <td className="px-4 py-3 text-right font-mono text-amber-700">{(defectVal * 100).toFixed(2)}%</td>
                      <td className="px-4 py-3 text-right font-mono text-green-700">{row.availability}%</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          row.inspectionResults.toLowerCase() === 'pass'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : row.inspectionResults.toLowerCase() === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {row.inspectionResults}
                        </span>
                      </td>
                      <td className="px-4 py-3 capitalize">{row.productType}</td>
                      <td className="px-4 py-3 font-medium text-gray-650">{row.location}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                    <Database size={40} className="mx-auto mb-3 opacity-30" />
                    Tidak ada baris data yang cocok dengan kriteria filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {filteredDataset.length > 0 && (
          <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row text-xs">
            <div className="text-gray-505">
              Menampilkan <span className="font-semibold text-gray-800">{Math.min(filteredDataset.length, (currentPage - 1) * rowsPerPage + 1)}</span>
              {' - '}
              <span className="font-semibold text-gray-800">{Math.min(filteredDataset.length, currentPage * rowsPerPage)}</span> dari{' '}
              <span className="font-semibold text-gray-800">{filteredDataset.length}</span> transaksi terfilter
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-brand-outline-variant bg-white px-3 py-1.5 font-medium hover:bg-gray-50 disabled:opacity-40"
              >
                Sebelumnya
              </button>
              
              {/* Limited pages */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pNum = i + 1;
                // Center pagination if many pages
                if (currentPage > 3 && totalPages > 5) {
                  pNum = currentPage - 2 + i;
                  if (pNum + (4 - i) > totalPages) {
                    pNum = totalPages - 4 + i;
                  }
                }
                return (
                  <button
                    key={pNum}
                    onClick={() => handlePageChange(pNum)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      currentPage === pNum
                        ? 'bg-brand-primary text-white'
                        : 'border border-brand-outline-variant bg-white hover:bg-gray-50'
                    }`}
                  >
                    {pNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-brand-outline-variant bg-white px-3 py-1.5 font-medium hover:bg-gray-50 disabled:opacity-40"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
