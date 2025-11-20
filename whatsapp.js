// Example helper to open WhatsApp with a prefilled message depending on language
function openWhatsApp(phone, message){
  const encoded = encodeURIComponent(message || 'Hello');
  const url = `https://wa.me/${phone}?text=${encoded}`;
  window.open(url, '_blank');
}
// Usage example: openWhatsApp('201273426669', 'مرحباً، أريد الاستفسار عن العروض');
