import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

type ReportData = {
  clientName: string
  clientEmail: string
  periodStart: string
  periodEnd: string
  projects: {
    name: string
    hours: number
    rate: number
    total: number
  }[]
  totalHours: number
  totalAmount: number
}

export const generateReportPDF = (data: ReportData) => {
  const doc = new jsPDF()

  // Titolo
  doc.setFontSize(20)
  doc.text('Freelance Hub - Report Cliente', 14, 20)

  // Info cliente
  doc.setFontSize(12)
  doc.text(`Cliente: ${data.clientName}`, 14, 35)
  doc.text(`Email: ${data.clientEmail}`, 14, 43)
  doc.text(`Periodo: ${data.periodStart} - ${data.periodEnd}`, 14, 51)

  // Tabella progetti
  autoTable(doc, {
    startY: 65,
    head: [['Progetto', 'Ore', 'Tariffa (€)', 'Totale (€)']],
    body: data.projects.map(p => [
      p.name,
      p.hours.toFixed(1),
      p.rate.toFixed(2),
      p.total.toFixed(2)
    ]),
    foot: [
      [
        'TOTALI',
        data.totalHours.toFixed(1),
        '',
        data.totalAmount.toFixed(2)
      ]
    ],
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] }, // Indigo
    footStyles: { fillColor: [243, 244, 246], textColor: [0, 0, 0], fontStyle: 'bold' }
  })

  // Salva PDF
  doc.save(`report_${data.clientName}_${data.periodStart}_${data.periodEnd}.pdf`)
}