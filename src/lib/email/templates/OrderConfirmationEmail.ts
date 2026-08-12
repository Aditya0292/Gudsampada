export interface EmailOrderItem {
  name: string
  size?: string
  qty: number
  price: number
}

export interface OrderConfirmationEmailProps {
  orderNumber: string
  customerName: string
  shippingAddress: {
    line1: string
    city: string
    state: string
    pincode: string
  }
  items: EmailOrderItem[]
  subtotal: number
  shippingFee: number
  total: number
  awbNumber?: string | null
  courierName?: string | null
  trackingUrl?: string | null
}

export function generateOrderConfirmationHtml(props: OrderConfirmationEmailProps): string {
  const itemsHtml = props.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #E6E0D4; font-family: Georgia, serif; color: #1C1C1A;">
            <strong>${item.name}</strong><br/>
            <span style="font-size: 11px; color: #665D54;">Weight/Size: ${item.size || 'Standard'}</span>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #E6E0D4; font-family: monospace; text-align: center; color: #1C1C1A;">
            ${item.qty}
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #E6E0D4; font-family: monospace; text-align: right; color: #1C1C1A; font-weight: bold;">
            ₹${(item.price * item.qty).toLocaleString('en-IN')}
          </td>
        </tr>
      `
    )
    .join('')

  const whatsappMessage = encodeURIComponent(
    `Hi GudSampada Support, I have a question regarding my Order #${props.orderNumber}.`
  )

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - GudSampada</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F1EA; font-family: Georgia, 'Times New Roman', serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F4F1EA; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #1C1C1A; border-collapse: collapse;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #1C1C1A; padding: 24px 30px; text-align: center;">
              <h1 style="margin: 0; color: #F9F6F0; font-family: Georgia, serif; font-size: 26px; font-weight: bold; letter-spacing: 1px;">
                gud<span style="font-style: italic; color: #8C7A6B;">sampada.</span>
              </h1>
              <p style="margin: 4px 0 0 0; color: #8C7A6B; font-family: sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 3px;">
                Authentic Jaggery Craft
              </p>
            </td>
          </tr>

          <!-- Success Banner -->
          <tr>
            <td style="padding: 30px; background-color: #F9F6F0; border-bottom: 1px solid #E6E0D4; text-align: center;">
              <span style="display: inline-block; background-color: #8C7A6B; color: #FFFFFF; font-family: sans-serif; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; padding: 4px 10px; margin-bottom: 12px;">
                Order Confirmed ✓
              </span>
              <h2 style="margin: 0 0 8px 0; color: #1C1C1A; font-size: 22px; font-weight: bold;">
                Thank you for your order, ${props.customerName}!
              </h2>
              <p style="margin: 0; color: #665D54; font-size: 13px; line-height: 1.5;">
                We have received your order <strong>#${props.orderNumber}</strong> and our Kolhapur artisans are preparing it for shipment.
              </p>
            </td>
          </tr>

          <!-- Order Details Table -->
          <tr>
            <td style="padding: 30px;">
              <h3 style="margin: 0 0 16px 0; color: #1C1C1A; font-family: sans-serif; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px solid #1C1C1A; padding-bottom: 8px;">
                Order Summary
              </h3>
              
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                <thead>
                  <tr>
                    <th align="left" style="padding-bottom: 8px; font-family: sans-serif; font-size: 10px; text-transform: uppercase; color: #8C7A6B; letter-spacing: 1px;">Item</th>
                    <th align="center" style="padding-bottom: 8px; font-family: sans-serif; font-size: 10px; text-transform: uppercase; color: #8C7A6B; letter-spacing: 1px;">Qty</th>
                    <th align="right" style="padding-bottom: 8px; font-family: sans-serif; font-size: 10px; text-transform: uppercase; color: #8C7A6B; letter-spacing: 1px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Totals -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 10px;">
                <tr>
                  <td style="padding: 4px 0; font-family: sans-serif; font-size: 12px; color: #665D54;">Subtotal</td>
                  <td align="right" style="padding: 4px 0; font-family: monospace; font-size: 12px; color: #1C1C1A;">₹${props.subtotal.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-family: sans-serif; font-size: 12px; color: #665D54;">Shipping Fee</td>
                  <td align="right" style="padding: 4px 0; font-family: monospace; font-size: 12px; color: #1C1C1A;">₹${props.shippingFee.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0 0 0; font-family: sans-serif; font-size: 14px; font-weight: bold; color: #1C1C1A; border-top: 1px solid #1C1C1A;">Grand Total Paid</td>
                  <td align="right" style="padding: 10px 0 0 0; font-family: monospace; font-size: 16px; font-weight: bold; color: #8C7A6B; border-top: 1px solid #1C1C1A;">₹${props.total.toLocaleString('en-IN')}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Address & Estimated Delivery -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F9F6F0; border: 1px solid #E6E0D4; padding: 20px;">
                <tr>
                  <td style="vertical-align: top; width: 50%; padding-right: 10px;">
                    <h4 style="margin: 0 0 8px 0; font-family: sans-serif; font-size: 10px; font-weight: bold; text-transform: uppercase; color: #8C7A6B; letter-spacing: 1px;">
                      Delivery Address
                    </h4>
                    <p style="margin: 0; font-size: 12px; color: #1C1C1A; line-height: 1.5;">
                      <strong>${props.customerName}</strong><br/>
                      ${props.shippingAddress.line1}<br/>
                      ${props.shippingAddress.city}, ${props.shippingAddress.state} — ${props.shippingAddress.pincode}
                    </p>
                  </td>
                  <td style="vertical-align: top; width: 50%; padding-left: 10px; border-left: 1px solid #E6E0D4;">
                    <h4 style="margin: 0 0 8px 0; font-family: sans-serif; font-size: 10px; font-weight: bold; text-transform: uppercase; color: #8C7A6B; letter-spacing: 1px;">
                      Estimated Dispatch
                    </h4>
                    <p style="margin: 0; font-size: 12px; color: #1C1C1A; line-height: 1.5;">
                      <strong>5 – 7 Business Days</strong><br/>
                      <span style="font-size: 11px; color: #665D54;">You will receive courier tracking details once dispatched.</span>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Support Footer -->
          <tr>
            <td style="background-color: #1C1C1A; padding: 24px 30px; text-align: center;">
              <p style="margin: 0 0 16px 0; color: #F9F6F0; font-size: 12px;">
                Have questions about your order? We are here to help.
              </p>
              <a href="https://wa.me/919876543210?text=${whatsappMessage}" target="_blank" style="display: inline-block; background-color: #25D366; color: #FFFFFF; font-family: sans-serif; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; text-decoration: none; padding: 10px 20px; border-radius: 0;">
                💬 Chat with Us on WhatsApp
              </a>
              <p style="margin: 20px 0 0 0; color: #8C7A6B; font-family: sans-serif; font-size: 10px;">
                © GudSampada. All rights reserved. Pure Kolhapuri Jaggery.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
