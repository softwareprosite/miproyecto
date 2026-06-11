import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface TouristReceipt {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  destination: string;
  provider: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  bookingRef: string;
  date: string;
}

export const generateTouristReceiptPDF = async (receipt: TouristReceipt) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Header
  pdf.setFontSize(24);
  pdf.setTextColor(37, 99, 235);
  pdf.text('🏔️ BOLIVIA TOURS', 105, 20, { align: 'center' });

  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Sistema de Registro Turístico', 105, 28, { align: 'center' });

  // Title
  pdf.setFontSize(16);
  pdf.setTextColor(31, 41, 55);
  pdf.text('RECIBO DE RESERVA TURÍSTICA', 105, 40, { align: 'center' });

  // Divider
  pdf.setDrawColor(37, 99, 235);
  pdf.line(20, 45, 190, 45);

  let yPosition = 55;

  // Booking Reference
  pdf.setFontSize(11);
  pdf.setTextColor(55, 65, 81);
  pdf.text(`Referencia: ${receipt.bookingRef}`, 20, yPosition);
  yPosition += 8;
  pdf.text(`Fecha de emisión: ${new Date().toLocaleDateString('es-ES')}`, 20, yPosition);
  yPosition += 15;

  // Tourist Info Section
  pdf.setFontSize(12);
  pdf.setTextColor(31, 41, 55);
  pdf.text('INFORMACIÓN DEL TURISTA', 20, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setTextColor(75, 85, 99);
  pdf.text(`Nombre: ${receipt.firstName} ${receipt.lastName}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Email: ${receipt.email}`, 20, yPosition);
  yPosition += 12;

  // Booking Details Section
  pdf.setFontSize(12);
  pdf.setTextColor(31, 41, 55);
  pdf.text('DETALLES DE LA RESERVA', 20, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setTextColor(75, 85, 99);
  pdf.text(`Destino: ${receipt.destination}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Proveedor: ${receipt.provider}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Fecha de entrada: ${receipt.checkIn}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Fecha de salida: ${receipt.checkOut}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Número de huéspedes: ${receipt.guests}`, 20, yPosition);
  yPosition += 12;

  // Price Section
  pdf.setFontSize(12);
  pdf.setTextColor(31, 41, 55);
  pdf.text('RESUMEN DE PAGO', 20, yPosition);
  yPosition += 8;

  pdf.setFontSize(11);
  pdf.setTextColor(75, 85, 99);
  pdf.text(`Monto total: $${receipt.totalPrice.toFixed(2)}`, 20, yPosition);
  yPosition += 8;

  // Status
  pdf.setFontSize(11);
  pdf.setTextColor(16, 185, 129);
  pdf.text('✓ Estado: CONFIRMADA', 20, yPosition);
  yPosition += 15;

  // Divider
  pdf.setDrawColor(37, 99, 235);
  pdf.line(20, yPosition, 190, yPosition);
  yPosition += 10;

  // Terms
  pdf.setFontSize(8);
  pdf.setTextColor(107, 114, 128);
  const terms = [
    'Este recibo confirma su reserva turística en Bolivia Tours.',
    'Por favor, presente este documento al llegar al destino.',
    'Para cambios o cancelaciones, contacte al proveedor de servicios.',
    'Política de cancelación: 48 horas antes de la fecha de entrada.'
  ];

  terms.forEach((term) => {
    pdf.text(term, 20, yPosition, { maxWidth: 170 });
    yPosition += 5;
  });

  yPosition += 5;

  // Footer
  pdf.setFontSize(9);
  pdf.setTextColor(149, 157, 165);
  pdf.text('Bolivia Tours - Gracias por elegirnos', 105, yPosition, { align: 'center' });
  yPosition += 6;
  pdf.text('www.boliviatours.com | info@boliviatours.com', 105, yPosition, { align: 'center' });

  // Save PDF
  const fileName = `recibo-${receipt.bookingRef}-${new Date().getTime()}.pdf`;
  pdf.save(fileName);
};

export const generateDestinationReportPDF = async (destinations: any[]) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  pdf.setFontSize(20);
  pdf.setTextColor(37, 99, 235);
  pdf.text('REPORTE DE DESTINOS TURÍSTICOS', 105, 20, { align: 'center' });

  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 105, 28, { align: 'center' });

  pdf.setDrawColor(37, 99, 235);
  pdf.line(20, 32, 190, 32);

  let yPosition = 45;

  destinations.forEach((dest, index) => {
    pdf.setFontSize(11);
    pdf.setTextColor(31, 41, 55);
    pdf.text(`${index + 1}. ${dest.name}`, 20, yPosition);
    yPosition += 6;

    pdf.setFontSize(9);
    pdf.setTextColor(75, 85, 99);
    pdf.text(`Región: ${dest.region} | Categoría: ${dest.category}`, 25, yPosition);
    yPosition += 5;
    pdf.text(`Visitantes: ${dest.visitors.toLocaleString()} | Precio: $${dest.price}`, 25, yPosition);
    yPosition += 8;

    if (yPosition > 270) {
      pdf.addPage();
      yPosition = 20;
    }
  });

  pdf.save(`reporte-destinos-${new Date().getTime()}.pdf`);
};
