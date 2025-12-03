import React, { useState, useEffect } from 'react';
import { InvoicePreview } from './components/InvoicePreview';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { getDatesInRange, isSunday } from './utils';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const App: React.FC = () => {
  // Initial state setup closer to the PDF example
  const [startDate, setStartDate] = useState<Date>(new Date('2025-10-26'));
  const [endDate, setEndDate] = useState<Date>(new Date('2025-11-25'));
  const [dailyRate, setDailyRate] = useState<number>(170.00);
  const [reportNumber, setReportNumber] = useState<string>('15');
  const [unitPlate, setUnitPlate] = useState<string>('VDM-872');
  const [unitDesc, setUnitDesc] = useState<string>('CAMIONETA TOYOTA HILUX');

  // New editable fields
  const [projectName, setProjectName] = useState<string>('Cerro Verde, Arequipa');
  const [clientName, setClientName] = useState<string>('KAMPFER SAC');
  const [clientRuc, setClientRuc] = useState<string>('20600121503');

  // Using a Set for efficient lookup of selected dates
  const [selectedDateStrings, setSelectedDateStrings] = useState<Set<string>>(new Set());
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Initialize selected dates (auto-select Mon-Sat)
  useEffect(() => {
    // Only run this once on mount or if range changes drastically if desired, 
    // but for this demo, let's just initialize once or let user control it.
    // For now, let's pre-fill based on the example logic (skipping Sundays)
    const initialDates = getDatesInRange(startDate, endDate);
    const newSelection = new Set<string>();
    initialDates.forEach(d => {
        if (!isSunday(d)) {
            newSelection.add(d.toISOString().split('T')[0]);
        }
    });
    setSelectedDateStrings(newSelection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const toggleDate = (dateStr: string) => {
    const newSet = new Set(selectedDateStrings);
    if (newSet.has(dateStr)) {
      newSet.delete(dateStr);
    } else {
      newSet.add(dateStr);
    }
    setSelectedDateStrings(newSet);
  };

  const selectAllWeekdays = () => {
    const dates = getDatesInRange(startDate, endDate);
    const newSet = new Set<string>();
    dates.forEach(d => {
        if (!isSunday(d)) {
            newSet.add(d.toISOString().split('T')[0]);
        }
    });
    setSelectedDateStrings(newSet);
  };

  const clearSelection = () => {
    setSelectedDateStrings(new Set());
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
        const sheets = document.querySelectorAll('.print-sheet');
        if (!sheets || sheets.length === 0) {
            alert('No se encontró contenido para exportar.');
            return;
        }

        // Initialize PDF - A4 Landscape
        // @ts-ignore
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        for (let i = 0; i < sheets.length; i++) {
            const sheet = sheets[i] as HTMLElement;
            
            // Temporarily remove shadow and margin for clean capture
            const originalShadow = sheet.style.boxShadow;
            const originalMargin = sheet.style.marginBottom;
            sheet.style.boxShadow = 'none';
            sheet.style.marginBottom = '0';
            
            // Capture the sheet
            const canvas = await html2canvas(sheet, {
                scale: 4, // Scale 4 ensures 0.5px borders are captured cleanly (approx 2px on canvas) for crisp downscaling
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff', // Ensure white background
                windowWidth: sheet.scrollWidth,
                windowHeight: sheet.scrollHeight
            });

            // Restore styles
            sheet.style.boxShadow = originalShadow;
            sheet.style.marginBottom = originalMargin;

            // Use PNG for lossless compression to keep thin black lines crisp
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = 297; // A4 width in mm
            const pdfHeight = 210; // A4 height in mm

            if (i > 0) {
                pdf.addPage();
            }

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        }

        pdf.save(`Valorizacion_${reportNumber}.pdf`);

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Hubo un error al generar el PDF. Por favor intente nuevamente.');
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar Controls */}
      <ConfigurationPanel 
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        dailyRate={dailyRate}
        setDailyRate={setDailyRate}
        reportNumber={reportNumber}
        setReportNumber={setReportNumber}
        selectedDateStrings={selectedDateStrings}
        toggleDate={toggleDate}
        selectAllWeekdays={selectAllWeekdays}
        clearSelection={clearSelection}
        unitPlate={unitPlate}
        setUnitPlate={setUnitPlate}
        unitDesc={unitDesc}
        setUnitDesc={setUnitDesc}
        projectName={projectName}
        setProjectName={setProjectName}
        clientName={clientName}
        setClientName={setClientName}
        clientRuc={clientRuc}
        setClientRuc={setClientRuc}
        onDownloadPdf={handleDownloadPdf}
        isGeneratingPdf={isGeneratingPdf}
      />

      {/* Main Content / Preview */}
      <main className="flex-1 bg-gray-100 lg:ml-96 p-4 lg:p-12 min-h-screen overflow-auto flex justify-center items-start">
        <InvoicePreview 
            startDate={startDate}
            endDate={endDate}
            selectedDateStrings={selectedDateStrings}
            dailyRate={dailyRate}
            reportNumber={reportNumber}
            unitPlate={unitPlate}
            unitDesc={unitDesc}
            projectName={projectName}
            clientName={clientName}
            clientRuc={clientRuc}
        />
      </main>
    </div>
  );
};

export default App;