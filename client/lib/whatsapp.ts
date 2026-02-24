import { cartStore } from "./flux/CartStore";

export const getWhatsAppLink = () => {
  const items = cartStore.getItems();
  const total = cartStore.getTotal();
  const phoneNumber = "5491161901310";
  
  if (items.length === 0) return `https://wa.me/${phoneNumber}?text=${encodeURIComponent("Hola! Quiero hacer un pedido.")}`;
  
  let message = "Hola! Quiero hacer un pedido:\n\n";
  items.forEach(item => {
    message += `- ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toLocaleString()})\n`;
  });
  message += `\nTotal: $${total.toLocaleString()}`;
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};
