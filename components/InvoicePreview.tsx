import React from 'react';
import { Logo } from './Logo';
import { formatCurrency, formatDate, formatDateShort, getDatesInRange, isSunday } from '../utils';

interface InvoicePreviewProps {
  startDate: Date;
  endDate: Date;
  selectedDateStrings: Set<string>;
  dailyRate: number;
  reportNumber: string;
  unitPlate: string;
  unitDesc: string;
  projectName: string;
  clientName: string;
  clientRuc: string;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  startDate,
  endDate,
  selectedDateStrings,
  dailyRate,
  reportNumber,
  unitPlate,
  unitDesc,
  projectName,
  clientName,
  clientRuc
}) => {
  
  const allDates = getDatesInRange(startDate, endDate);
  
  // Calculations
  const totalWorkedDays = allDates.filter(d => selectedDateStrings.has(d.toISOString().split('T')[0])).length;
  
  // Unit calculations
  const unitIgv = dailyRate * 0.18;
  const unitTotal = dailyRate + unitIgv;

  // Total calculations
  const subtotal = totalWorkedDays * dailyRate;
  const totalIgv = subtotal * 0.18;
  const grandTotal = subtotal + totalIgv;
  
  const reportMonthYear = startDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase();

  // Color constant from screenshot (Dark Blue)
  const headerColor = "bg-[#002060]";

  // Pagination logic for Detail Table
  // A4 Landscape height is ~210mm. Deducting margins (p-12 ~ 48px top/bottom), we have limited space.
  // 16 rows + header + footer fits comfortably.
  const ROWS_PER_PAGE = 16;
  const detailPages = [];
  for (let i = 0; i < allDates.length; i += ROWS_PER_PAGE) {
    detailPages.push(allDates.slice(i, i + ROWS_PER_PAGE));
  }

  // Use the custom CSS class defined in index.html for correct print behavior
  const borderStyle = "custom-thin-border";

  return (
    <div className="flex flex-col items-center">
      
      {/* --- SHEET 1: HEADER & SUMMARY --- */}
      <div className="print-sheet bg-white text-black p-12 shadow-lg w-[297mm] min-h-[210mm] mb-8 text-xs leading-relaxed font-sans relative flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
            <div>
            <Logo className="h-24" />
            </div>
            <div className="text-right text-sm">
            <h2 className="font-bold text-[#002060] text-lg">MAJENIL GROUP</h2>
            <p>RUC: 20609828642</p>
            <p>Telefono: +51 949872606</p>
            <p>E-mail: majenilgroup.gmail.com</p>
            </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-[#002060] uppercase mb-1">INFORME DE VALORIZACIÓN DE ALQUILER</h1>
            <h2 className="text-xl font-bold text-[#002060] uppercase">DE VEHÍCULO Nº {reportNumber} - {reportMonthYear}</h2>
        </div>

        {/* Client Info - Updated to custom thin border */}
        <div className={`mb-10 space-y-3 text-sm border-b-[0.5px] pb-8 border-gray-200`}>
            {/* Note: Keeping the divider gray-200 as it's a separator, not a table border, but applying thin logic manually or keep as is. 
                User asked for black boxes/tables to be thin. Let's keep this subtle separator gray. 
            */}
            <div className="grid grid-cols-[140px_1fr]">
            <span className="font-bold text-gray-700">Proyecto:</span>
            <span className="text-gray-900">{projectName}</span>
            </div>
            <div className="grid grid-cols-[140px_1fr]">
            <span className="font-bold text-gray-700">Cliente:</span>
            <span className="text-gray-900">{clientName}</span>
            </div>
            <div className="grid grid-cols-[140px_1fr]">
            <span className="font-bold text-gray-700">RUC Cliente:</span>
            <span className="text-gray-900">{clientRuc}</span>
            </div>
            <div className="grid grid-cols-[140px_1fr]">
            <span className="font-bold text-gray-700">Unidad:</span>
            <span className="text-gray-900">{unitDesc} (Placa {unitPlate})</span>
            </div>
        </div>

        {/* Summary Table */}
        <div className="mb-8">
            <h3 className="font-bold text-[#002060] mb-3 uppercase text-sm tracking-wider">Resumen General</h3>
            <table className={`w-full border-collapse text-center text-sm shadow-sm`}>
            <thead>
                <tr className={`${headerColor} text-white`}>
                <th className={`${borderStyle} p-3`}>Placa</th>
                <th className={`${borderStyle} p-3`}>Unidad</th>
                <th className={`${borderStyle} p-3`}>Año</th>
                <th className={`${borderStyle} p-3`}>Fecha inicio</th>
                <th className={`${borderStyle} p-3`}>Fecha final</th>
                <th className={`${borderStyle} p-3`}>Total días</th>
                <th className={`${borderStyle} p-3`}>Tarifa diaria</th>
                <th className={`${borderStyle} p-3`}>Igv.</th>
                <th className={`${borderStyle} p-3`}>Total a pagar</th>
                </tr>
            </thead>
            <tbody>
                <tr className="bg-white font-medium text-black">
                <td className={`${borderStyle} p-3`}>{unitPlate}</td>
                <td className={`${borderStyle} p-3 uppercase`}>{unitDesc}</td>
                <td className={`${borderStyle} p-3`}>2024</td>
                <td className={`${borderStyle} p-3`}>{formatDate(startDate)}</td>
                <td className={`${borderStyle} p-3`}>{formatDate(endDate)}</td>
                <td className={`${borderStyle} p-3`}>{totalWorkedDays}</td>
                <td className={`${borderStyle} p-3`}>{formatCurrency(dailyRate)}</td>
                <td className={`${borderStyle} p-3`}>{formatCurrency(unitIgv)}</td>
                <td className={`${borderStyle} p-3 font-bold`}>{formatCurrency(unitTotal)}</td>
                </tr>
                <tr className="text-black">
                    <td colSpan={6} className={`${borderStyle} p-3 text-right font-bold text-gray-600 uppercase tracking-wide`}>Total General</td>
                    <td className={`${borderStyle} p-3 font-bold bg-gray-50`}>{formatCurrency(subtotal)}</td>
                    <td className={`${borderStyle} p-3 font-bold bg-gray-50`}>{formatCurrency(totalIgv)}</td>
                    <td className={`${borderStyle} p-3 font-bold bg-gray-50`}>{formatCurrency(grandTotal)}</td>
                </tr>
            </tbody>
            </table>
        </div>

        <div className="mt-auto">
            <p className="text-xs text-gray-500 italic border-t pt-2">
                La presente valorización corresponde exclusivamente al servicio de alquiler indicado y será válida para efectos de facturación.
            </p>
            <div className="text-right text-[10px] text-gray-400 mt-2">
                Página 1 de {detailPages.length + 1}
            </div>
        </div>
      </div>

      {/* --- SHEET 2+: DETAIL TABLES (Paginated) --- */}
      {detailPages.map((pageDates, pageIndex) => {
        const isLastPage = pageIndex === detailPages.length - 1;
        // The detail pages start from page 2 (index 0 maps to page 2)
        const pageNumber = pageIndex + 2;
        const totalPages = detailPages.length + 1;

        return (
            <div key={pageIndex} className="print-sheet bg-white text-black p-12 shadow-lg w-[297mm] min-h-[210mm] mb-8 text-xs leading-relaxed font-sans relative flex flex-col justify-between">
                <div>
                    {/* Using thin black borders */}
                    <table className={`w-full border-collapse text-center text-xs`}>
                        <thead>
                            <tr className={`${headerColor} text-white`}>
                                <th className={`${borderStyle} p-2 font-semibold tracking-wide text-sm`} colSpan={2}>
                                    VALORIZACION Nº {reportNumber}: {startDate.getFullYear()}
                                </th>
                                <th className={`${borderStyle} p-2 font-semibold tracking-wide text-sm`} colSpan={3}>
                                    {unitDesc}
                                </th>
                                <th className={`${borderStyle} p-2 font-semibold tracking-wide text-sm`} colSpan={2}>
                                    PLACA: {unitPlate}
                                </th>
                            </tr>
                            <tr className={`${headerColor} text-white`}>
                                <th className={`${borderStyle} py-2 px-1 w-32`}>Fecha</th>
                                <th className={`${borderStyle} py-2 px-1`}>Equipo / Descripción</th>
                                <th className={`${borderStyle} py-2 px-1 w-24`}>Turnos/ días</th>
                                <th className={`${borderStyle} py-2 px-1 w-32`}>Tarifa diaria</th>
                                <th className={`${borderStyle} py-2 px-1 w-32`}>Total</th>
                                <th className={`${borderStyle} py-2 px-1 w-40`}>Detalle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageDates.map((date, idx) => {
                                const dateStr = date.toISOString().split('T')[0];
                                const isWorked = selectedDateStrings.has(dateStr);
                                const isSundayDay = isSunday(date);
                                
                                const rowClass = idx % 2 === 0 ? 'bg-white' : 'bg-slate-50';

                                return (
                                    <tr key={dateStr} className={`text-xs ${rowClass} hover:bg-blue-100 transition-colors`}>
                                        <td className={`${borderStyle} py-2 px-1 font-medium text-gray-700`}>{formatDateShort(date)}</td>
                                        
                                        {isWorked ? (
                                            <>
                                                <td className={`${borderStyle} py-2 px-2 text-left uppercase pl-6 font-medium text-gray-800`}>
                                                    {unitDesc}
                                                    <div className="text-[10px] text-gray-500 font-normal">{unitPlate}</div>
                                                </td>
                                                <td className={`${borderStyle} py-2 px-1`}>01</td>
                                                <td className={`${borderStyle} py-2 px-1 text-gray-600`}>{formatCurrency(dailyRate)}</td>
                                                <td className={`${borderStyle} py-2 px-1 font-bold text-gray-800`}>{formatCurrency(dailyRate * 1.18)}</td>
                                            </>
                                        ) : (
                                            <>
                                                <td className={`${borderStyle} py-2 px-1 bg-gray-200`}></td>
                                                <td className={`${borderStyle} py-2 px-1 bg-gray-200`}></td>
                                                <td className={`${borderStyle} py-2 px-1 bg-gray-200`}></td>
                                                <td className={`${borderStyle} py-2 px-1 bg-gray-200`}></td>
                                            </>
                                        )}
                                        
                                        <td className={`${borderStyle} py-2 px-1 bg-gray-200 text-gray-500 font-semibold text-[10px]`}>
                                            {isSundayDay ? 'DOMINGO' : '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                            
                            {/* Footer Totals - Only show on the very last page */}
                            {isLastPage && (
                                <tr className="font-bold bg-blue-50 text-sm">
                                    <td className={`${borderStyle} p-2 text-right uppercase tracking-wide text-gray-700`} colSpan={2}>Total Acumulado</td>
                                    <td className={`${borderStyle} p-2`}>{totalWorkedDays} días</td>
                                    <td className={`${borderStyle} p-2`}>{formatCurrency(subtotal)}</td>
                                    <td className={`${borderStyle} p-2 text-[#002060]`}>{formatCurrency(grandTotal)}</td>
                                    <td className={`${borderStyle} p-2 bg-gray-200`}></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Page Number */}
                <div className="w-full text-right text-[10px] text-gray-400 mt-4">
                    Página {pageNumber} de {totalPages}
                </div>
            </div>
        );
      })}

    </div>
  );
};