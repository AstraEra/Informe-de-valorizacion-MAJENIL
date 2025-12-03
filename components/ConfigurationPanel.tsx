import React from 'react';
import { getDatesInRange, isSunday } from '../utils';

interface ConfigurationPanelProps {
  startDate: Date;
  setStartDate: (d: Date) => void;
  endDate: Date;
  setEndDate: (d: Date) => void;
  dailyRate: number;
  setDailyRate: (r: number) => void;
  reportNumber: string;
  setReportNumber: (s: string) => void;
  selectedDateStrings: Set<string>;
  toggleDate: (d: string) => void;
  selectAllWeekdays: () => void;
  clearSelection: () => void;
  unitPlate: string;
  setUnitPlate: (s: string) => void;
  unitDesc: string;
  setUnitDesc: (s: string) => void;
  // New props
  projectName: string;
  setProjectName: (s: string) => void;
  clientName: string;
  setClientName: (s: string) => void;
  clientRuc: string;
  setClientRuc: (s: string) => void;
  
  onDownloadPdf: () => void;
  isGeneratingPdf: boolean;
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  dailyRate,
  setDailyRate,
  reportNumber,
  setReportNumber,
  selectedDateStrings,
  toggleDate,
  selectAllWeekdays,
  clearSelection,
  unitPlate,
  setUnitPlate,
  unitDesc,
  setUnitDesc,
  projectName,
  setProjectName,
  clientName,
  setClientName,
  clientRuc,
  setClientRuc,
  onDownloadPdf,
  isGeneratingPdf
}) => {
  
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) setStartDate(new Date(e.target.value));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) setEndDate(new Date(e.target.value));
  };

  const rangeDates = getDatesInRange(startDate, endDate);

  return (
    <div className="w-full lg:w-96 bg-gray-900 text-white p-6 h-screen overflow-y-auto fixed left-0 top-0 shadow-xl no-print z-50">
      <h2 className="text-2xl font-bold mb-6 text-blue-400">Configuración</h2>
      
      {/* General Data */}
      <div className="space-y-4 mb-8">
         <div>
          <label className="block text-sm font-medium mb-1 text-gray-400">Nº Informe</label>
          <input 
            type="text" 
            value={reportNumber}
            onChange={(e) => setReportNumber(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-400">Proyecto</label>
          <input 
            type="text" 
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-400">Cliente</label>
          <input 
            type="text" 
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-400">RUC Cliente</label>
          <input 
            type="text" 
            value={clientRuc}
            onChange={(e) => setClientRuc(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-400">Placa</label>
                <input 
                    type="text" 
                    value={unitPlate}
                    onChange={(e) => setUnitPlate(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-400">Tarifa (S/)</label>
                <input 
                    type="number" 
                    value={dailyRate}
                    onChange={(e) => setDailyRate(parseFloat(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">Vehículo</label>
            <input 
                type="text" 
                value={unitDesc}
                onChange={(e) => setUnitDesc(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
            />
        </div>

        <div className="grid grid-cols-2 gap-2">
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-400">Inicio</label>
                <input 
                    type="date" 
                    value={startDate.toISOString().split('T')[0]}
                    onChange={handleStartDateChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-400">Fin</label>
                <input 
                    type="date" 
                    value={endDate.toISOString().split('T')[0]}
                    onChange={handleEndDateChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm"
                />
            </div>
        </div>
      </div>

      <hr className="border-gray-700 mb-6" />

      {/* Calendar Selector */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-300">Días Trabajados</h3>
            <div className="space-x-2">
                 <button onClick={selectAllWeekdays} className="text-xs bg-blue-900 hover:bg-blue-800 px-2 py-1 rounded">L-S</button>
                 <button onClick={clearSelection} className="text-xs bg-red-900 hover:bg-red-800 px-2 py-1 rounded">Limpiar</button>
            </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-gray-500">
            <div>D</div><div>L</div><div>M</div><div>M</div><div>J</div><div>V</div><div>S</div>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
            {/* Pad the start of the grid to align with day of week */}
            {Array.from({ length: startDate.getDay() }).map((_, i) => (
                <div key={`pad-${i}`} className="h-8"></div>
            ))}

            {rangeDates.map((date) => {
                const dateStr = date.toISOString().split('T')[0];
                const isSelected = selectedDateStrings.has(dateStr);
                const isSun = isSunday(date);
                
                return (
                    <button
                        key={dateStr}
                        onClick={() => toggleDate(dateStr)}
                        className={`
                            h-8 rounded flex items-center justify-center font-medium transition-colors
                            ${isSelected 
                                ? 'bg-blue-600 text-white' 
                                : isSun 
                                    ? 'bg-gray-800 text-red-400 border border-gray-700' 
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }
                        `}
                        title={date.toDateString()}
                    >
                        {date.getDate()}
                    </button>
                );
            })}
        </div>
      </div>

      <div className="space-y-3">
        <button 
            onClick={() => window.print()}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded shadow-lg transition-transform transform active:scale-95"
        >
            IMPRIMIR (Nativo)
        </button>

        <button 
            onClick={onDownloadPdf}
            disabled={isGeneratingPdf}
            className={`w-full ${isGeneratingPdf ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} text-white font-bold py-3 rounded shadow-lg transition-transform transform active:scale-95 flex justify-center items-center`}
        >
            {isGeneratingPdf ? (
                <span>Generando...</span>
            ) : (
                <span>DESCARGAR PDF</span>
            )}
        </button>
      </div>

      <div className="mt-8 text-xs text-gray-500">
        <p>Ajuste el tamaño del navegador para ver la vista previa completa antes de generar el PDF.</p>
      </div>

    </div>
  );
};