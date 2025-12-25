import { NextRequest, NextResponse } from 'next/server';

// This API route handles order submissions and can send notifications to managers
// In production, you would integrate with:
// - Email service (SendGrid, Mailgun, etc.)
// - Telegram Bot API
// - CRM system
// - Database

interface OrderItem {
  productId: string;
  productName: string;
  colorId: string;
  colorName: string;
  quantity: number;
  price: number;
}

interface OrderData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  comment: string;
  deliveryMethod: string;
  paymentMethod: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderData = await request.json();
    
    // Generate order number
    const orderNumber = `SP${Date.now().toString().slice(-8)}`;
    
    // Format order for Telegram message
    const telegramMessage = formatTelegramMessage(orderNumber, orderData);
    
    // Send to Telegram (uncomment and configure in production)
    // await sendTelegramNotification(telegramMessage);
    
    // Send email confirmation (uncomment and configure in production)
    // await sendEmailConfirmation(orderData.email, orderNumber, orderData);
    
    // Log order (in production, save to database)
    console.log('New Order:', { orderNumber, ...orderData });
    
    return NextResponse.json({ 
      success: true, 
      orderNumber,
      message: 'Замовлення успішно створено' 
    });
  } catch (error) {
    console.error('Order submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Помилка при створенні замовлення' },
      { status: 500 }
    );
  }
}

function formatTelegramMessage(orderNumber: string, order: OrderData): string {
  const deliveryMethods: Record<string, string> = {
    'nova_poshta': 'Нова Пошта',
    'ukr_poshta': 'Укрпошта',
    'pickup': 'Самовивіз'
  };
  
  const paymentMethods: Record<string, string> = {
    'card': 'Оплата на картку',
    'cash_on_delivery': 'Накладений платіж'
  };
  
  const itemsList = order.items
    .map(item => `  • ${item.productName} (${item.colorName}) × ${item.quantity} = ${item.price * item.quantity} ₴`)
    .join('\n');
  
  return `
🎵 *НОВЕ ЗАМОВЛЕННЯ* #${orderNumber}

👤 *Клієнт:*
${order.firstName} ${order.lastName}
📧 ${order.email}
📱 ${order.phone}

📦 *Доставка:*
${deliveryMethods[order.deliveryMethod] || order.deliveryMethod}
${order.city}, ${order.address}

💳 *Оплата:*
${paymentMethods[order.paymentMethod] || order.paymentMethod}

🛒 *Товари:*
${itemsList}

💰 *Сума:* ${order.total} ₴

${order.comment ? `📝 *Коментар:* ${order.comment}` : ''}

⏰ ${new Date(order.createdAt).toLocaleString('uk-UA')}
  `.trim();
}

// Telegram notification function (configure with your bot token and chat ID)
async function sendTelegramNotification(message: string): Promise<void> {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram credentials not configured');
    return;
  }
  
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    })
  });
}

// Email notification function (integrate with your email service)
async function sendEmailConfirmation(
  email: string, 
  orderNumber: string, 
  order: OrderData
): Promise<void> {
  // Integrate with SendGrid, Mailgun, or other email service
  // Example with SendGrid:
  /*
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  await sgMail.send({
    to: email,
    from: 'orders@sopilka.ua',
    subject: `Замовлення #${orderNumber} прийнято`,
    html: generateEmailTemplate(orderNumber, order)
  });
  */
  console.log(`Email confirmation would be sent to: ${email}`);
}
