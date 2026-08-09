import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiX, HiDownload } from 'react-icons/hi';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

export default function QRCodeModal({
  open,
  onClose,
  qrUrl,
  ticketNumber,
  eventTitle,
  venue,
  eventDate,
  startTime,
  paymentMethod,
  quantity,
  attendeeName,
  attendeePhone,
}) {
  const formattedDate = eventDate ? new Date(eventDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const bookerName = attendeeName || 'Ticket holder';
  const bookerPhone = attendeePhone || 'Not provided';

  const getAbsoluteQrUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const createPdfTicket = async () => {
    if (!qrUrl) {
      toast.error('No QR code available to download.');
      return;
    }

    try {
      const absoluteUrl = getAbsoluteQrUrl(qrUrl);
      const response = await fetch(absoluteUrl);

      if (!response.ok) {
        throw new Error(`Unable to load QR code image (${response.status})`);
      }

      const blob = await response.blob();
      const reader = new FileReader();

      const imageDataUrl = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 40;
      let y = margin;

      doc.setLineWidth(2);
      doc.setDrawColor(30, 64, 175);
      doc.rect(margin / 2, margin / 2, pageWidth - margin, pageHeight - margin, 'S');

      const headerHeight = 58;
      doc.setFillColor(30, 64, 175);
      doc.rect(margin, y, pageWidth - margin * 2, headerHeight, 'F');
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor('#ffffff');
      doc.text(eventTitle || 'Event Ticket', pageWidth / 2, y + 36, { align: 'center' });
      y += headerHeight + 20;

      doc.setTextColor('#101828');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Ticket number', margin + 6, y);
      doc.setFont('helvetica', 'normal');
      doc.text(ticketNumber || 'N/A', margin + 6, y + 14);
      doc.text(`Payment: ${paymentMethod || 'Pending'}`, pageWidth - margin - 6, y, { align: 'right' });
      y += 28;

      const boxHeight = 120;
      doc.setFillColor(245, 247, 255);
      doc.rect(margin, y, pageWidth - margin * 2, boxHeight, 'F');
      doc.setDrawColor(148, 163, 184);
      doc.setLineWidth(0.8);
      doc.rect(margin, y, pageWidth - margin * 2, boxHeight, 'S');

      const leftX = margin + 14;
      const rightX = pageWidth / 2 + 10;
      let detailY = y + 24;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Venue', leftX, detailY);
      doc.setFont('helvetica', 'normal');
      doc.text(venue || 'Unknown venue', leftX, detailY + 16);
      doc.setFont('helvetica', 'bold');
      doc.text('Tickets', leftX, detailY + 40);
      doc.setFont('helvetica', 'normal');
      doc.text(`${quantity || 1}`, leftX, detailY + 56);

      doc.setFont('helvetica', 'bold');
      doc.text('Date', rightX, detailY);
      doc.setFont('helvetica', 'normal');
      doc.text(formattedDate || 'Pending', rightX, detailY + 16);
      doc.setFont('helvetica', 'bold');
      doc.text('Start time', rightX, detailY + 40);
      doc.setFont('helvetica', 'normal');
      doc.text(startTime || 'Pending', rightX, detailY + 56);
      y += boxHeight + 30;

      const attendeeBoxHeight = 70;
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, y, pageWidth - margin * 2, attendeeBoxHeight, 'F');
      doc.setDrawColor(148, 163, 184);
      doc.rect(margin, y, pageWidth - margin * 2, attendeeBoxHeight, 'S');
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Booked by', leftX, y + 22);
      doc.setFont('helvetica', 'normal');
      doc.text(bookerName, leftX, y + 38);
      doc.setFont('helvetica', 'bold');
      doc.text('Phone', rightX, y + 22);
      doc.setFont('helvetica', 'normal');
      doc.text(bookerPhone, rightX, y + 38);
      y += attendeeBoxHeight + 30;

      const qrSize = 200;
      const qrX = pageWidth / 2 - qrSize / 2;
      doc.addImage(imageDataUrl, 'PNG', qrX, y, qrSize, qrSize);
      y += qrSize + 30;

      doc.setFontSize(10);
      doc.setTextColor('#475569');
      const footerText = 'Present this ticket PDF at the gate and allow staff to scan the QR code for entry verification.';
      doc.text(footerText, margin + 10, y, { maxWidth: pageWidth - margin * 2 - 20 });

      doc.save(`${ticketNumber || 'event-ticket'}.pdf`);
      toast.success('Ticket PDF downloaded successfully.');
    } catch (error) {
      console.error('Failed to generate ticket PDF', error);
      toast.error('Unable to generate ticket PDF. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-5"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel shadow-glass rounded-xl2 p-6 max-w-sm w-full text-center relative"
          >
            <button onClick={onClose} className="absolute right-4 top-4 text-ink-muted" aria-label="Close">
              <HiX />
            </button>

            <h3 className="font-display font-semibold text-lg mb-1">{eventTitle}</h3>
            <p className="text-sm text-ink-muted font-mono mb-4">{ticketNumber}</p>

            <div className="space-y-3 text-left mb-5 text-sm text-slate-200">
              <div>
                <span className="block text-slate-400">Booked by</span>
                <span>{attendeeName || 'Ticket holder'}</span>
              </div>
              <div>
                <span className="block text-slate-400">Phone</span>
                <span>{attendeePhone || 'Not available'}</span>
              </div>
              <div>
                <span className="block text-slate-400">Venue</span>
                <span>{venue}</span>
              </div>
              <div>
                <span className="block text-slate-400">Date</span>
                <span>{formattedDate}</span>
              </div>
              <div>
                <span className="block text-slate-400">Start time</span>
                <span>{startTime}</span>
              </div>
              <div>
                <span className="block text-slate-400">Payment</span>
                <span>{paymentMethod}</span>
              </div>
              <div>
                <span className="block text-slate-400">Tickets</span>
                <span>{quantity}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl2 inline-block">
              <img src={qrUrl} alt={`QR ticket for ${ticketNumber}`} className="h-48 w-48" />
            </div>

            <button
              type="button"
              onClick={createPdfTicket}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
            >
              <HiDownload /> Download PDF ticket
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
