import React, { useState } from 'react';
import { X, QrCode, Check, UtensilsCrossed, ShoppingBag, Smartphone, Sparkles, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function QrTableModal() {
  const { isQrModalOpen, setIsQrModalOpen, tableNumber, setTableNumber, orderType, setOrderType } = useCart();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('select'); // 'select' | 'qr-view' | 'scan'
  const [selectedTable, setSelectedTable] = useState(tableNumber.replace(/\D/g, '') || '4');
  const [isScanning, setIsScanning] = useState(false);

  if (!isQrModalOpen) return null;

  const tables = Array.from({ length: 15 }, (_, i) => i + 1);

  const handleSelectTable = (num) => {
    const tableStr = `Table ${num}`;
    setTableNumber(tableStr);
    setSelectedTable(String(num));
    addToast(`You are now seated at Table #${num}`, 'success');
    setIsQrModalOpen(false);
  };

  const handleSelectTakeaway = () => {
    setTableNumber('Takeaway');
    addToast(`Order mode switched to Takeaway`, 'info');
    setIsQrModalOpen(false);
  };

  const handleSimulateScan = (num) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      handleSelectTable(num);
    }, 1200);
  };

  // Simulated SVG QR Code pattern
  const qrUrl = `${window.location.origin}${window.location.pathname}?table=${selectedTable}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl shadow-warm-xl p-6 sm:p-8 text-stone-100 overflow-hidden">
        
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-white">Dine-in Table Experience</h3>
              <p className="text-xs text-stone-400">Scan at table or manually select your seat</p>
            </div>
          </div>
          <button
            onClick={() => setIsQrModalOpen(false)}
            className="w-9 h-9 rounded-full bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-stone-800/80 p-1 my-5 border border-stone-700/50 relative z-10">
          <button
            onClick={() => setActiveTab('select')}
            className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              activeTab === 'select'
                ? 'bg-amber-600 text-white shadow-sm font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Select Table
          </button>
          <button
            onClick={() => setActiveTab('qr-view')}
            className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              activeTab === 'qr-view'
                ? 'bg-amber-600 text-white shadow-sm font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Table QR Code
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              activeTab === 'scan'
                ? 'bg-amber-600 text-white shadow-sm font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Scan QR
          </button>
        </div>

        {/* Tab 1: Table Grid Selector */}
        {activeTab === 'select' && (
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Choose your dine-in table number:</span>
              <span className="text-amber-400 font-medium">Currently: {tableNumber}</span>
            </div>

            <div className="grid grid-cols-5 gap-2.5 sm:gap-3">
              {tables.map((num) => {
                const isSelected = tableNumber === `Table ${num}`;
                return (
                  <button
                    key={num}
                    onClick={() => handleSelectTable(num)}
                    className={`h-14 rounded-2xl flex flex-col items-center justify-center text-sm font-bold transition-all border ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-400 shadow-md scale-105 ring-2 ring-amber-400/30'
                        : 'bg-stone-800/80 text-stone-300 border-stone-700/60 hover:bg-stone-700/80 hover:border-amber-500/50 hover:text-white'
                    }`}
                  >
                    <span className="text-[10px] text-stone-400 font-normal">Table</span>
                    <span>#{num}</span>
                  </button>
                );
              })}
            </div>

            {/* Takeaway Option */}
            <div className="pt-2">
              <button
                onClick={handleSelectTakeaway}
                className={`w-full py-3 px-4 rounded-2xl flex items-center justify-center gap-2.5 text-sm font-semibold border transition-all ${
                  tableNumber === 'Takeaway'
                    ? 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-400/30'
                    : 'bg-stone-800/90 text-stone-300 border-stone-700/80 hover:bg-stone-700 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span>Switch to Takeaway Order</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Table QR Code Visual Display */}
        {activeTab === 'qr-view' && (
          <div className="space-y-4 text-center relative z-10 py-2">
            <p className="text-xs text-stone-400">
              This simulated QR code is placed on Table #{selectedTable}. Diners scan it with their phone camera to instantly order without downloading an app or logging in.
            </p>

            <div className="inline-block p-4 bg-white rounded-3xl shadow-xl border-4 border-amber-500/20">
              <div className="w-48 h-48 mx-auto bg-stone-900 rounded-2xl p-3 flex flex-col items-center justify-between text-white">
                <div className="flex justify-between w-full">
                  <div className="w-10 h-10 border-4 border-amber-400 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-amber-400 rounded-sm" />
                  </div>
                  <div className="w-10 h-10 border-4 border-amber-400 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-amber-400 rounded-sm" />
                  </div>
                </div>

                <div className="my-auto text-center">
                  <div className="font-serif text-lg font-extrabold text-amber-300">
                    AromaCraft
                  </div>
                  <div className="text-[11px] font-bold text-white bg-amber-600/80 px-2 py-0.5 rounded-full mt-1">
                    TABLE #{selectedTable}
                  </div>
                </div>

                <div className="flex justify-between w-full">
                  <div className="w-10 h-10 border-4 border-amber-400 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-amber-400 rounded-sm" />
                  </div>
                  <div className="w-10 h-10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-stone-400">Preview QR for:</span>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="bg-stone-800 border border-stone-700 text-amber-300 text-xs font-semibold rounded-lg px-2 py-1 focus:outline-none focus:border-amber-500"
              >
                {tables.map((t) => (
                  <option key={t} value={t}>
                    Table #{t}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleSelectTable(Number(selectedTable))}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-xl text-sm transition-colors"
            >
              Set as My Table (#{selectedTable})
            </button>
          </div>
        )}

        {/* Tab 3: Simulate QR Scanner */}
        {activeTab === 'scan' && (
          <div className="space-y-4 text-center relative z-10 py-2">
            <div className="relative w-full h-56 bg-stone-950 rounded-2xl border-2 border-dashed border-amber-500/50 flex flex-col items-center justify-center overflow-hidden">
              {/* Scanner laser effect */}
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#fbbf24] animate-pulse" />
              
              <div className="w-32 h-32 border-2 border-amber-400 rounded-xl relative flex items-center justify-center">
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-amber-300" />
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-amber-300" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-amber-300" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-amber-300" />
                <Smartphone className="w-10 h-10 text-stone-500" />
              </div>

              <div className="mt-4 text-xs text-stone-400">
                {isScanning ? (
                  <span className="flex items-center gap-2 text-amber-300">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Recognizing Table QR Code...
                  </span>
                ) : (
                  <span>Point camera at any table QR tag</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                disabled={isScanning}
                onClick={() => handleSimulateScan(3)}
                className="py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl border border-stone-700 transition-colors disabled:opacity-50"
              >
                Scan Table 3
              </button>
              <button
                disabled={isScanning}
                onClick={() => handleSimulateScan(7)}
                className="py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl border border-stone-700 transition-colors disabled:opacity-50"
              >
                Scan Table 7
              </button>
              <button
                disabled={isScanning}
                onClick={() => handleSimulateScan(12)}
                className="py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl border border-stone-700 transition-colors disabled:opacity-50"
              >
                Scan Table 12
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
