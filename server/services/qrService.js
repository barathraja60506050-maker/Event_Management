const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const TICKETS_DIR = path.join(__dirname, '..', 'tickets');

if (!fs.existsSync(TICKETS_DIR)) {
  fs.mkdirSync(TICKETS_DIR, { recursive: true });
}

/**
 * Generates a QR code PNG for a registration and saves it to /tickets.
 * The QR payload is a JSON string the check-in scanner can parse without
 * a network round trip: ticket number + event + user, plus a short
 * "v" field in case we need to version the payload format later.
 */
async function generateTicketQR({
  ticketNumber,
  eventId,
  userId,
  registrationId,
  eventTitle,
  eventVenue,
  eventDate,
  startTime,
  attendeeName,
  attendeeEmail,
  attendeePhone,
  quantity,
  paymentMethod,
  amount,
  status,
  receiptNumber,
}) {
  const payload = JSON.stringify({
    v: 2,
    ticketNumber,
    registrationId,
    eventId,
    eventTitle,
    eventVenue,
    eventDate,
    startTime,
    userId,
    attendeeName,
    attendeeEmail,
    attendeePhone,
    quantity,
    paymentMethod,
    amount,
    status,
    receiptNumber,
  });
  const filename = `${ticketNumber}.png`;
  const filePath = path.join(TICKETS_DIR, filename);

  await QRCode.toFile(filePath, payload, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 320,
  });

  return `/tickets/${filename}`;
}

module.exports = { generateTicketQR };
