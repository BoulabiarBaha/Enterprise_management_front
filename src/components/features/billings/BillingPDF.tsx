import { formatCurrency, formatDate } from '@/lib/utils';
import type { Billing, Transaction, Client, Product } from '@/types';

/**
 * Props pour le composant PDF
 */
// interface BillingPDFProps {
//   billing: Billing;
//   transaction: Transaction;
//   client: Client;
//   products: Product[];
// }

/**
 * Génère le contenu HTML de la facture pour impression/PDF
 * 
 * Cette fonction crée un HTML formaté qui peut être :
 * 1. Affiché dans une nouvelle fenêtre
 * 2. Imprimé directement (window.print())
 * 3. Converti en PDF par le navigateur
 */
export const generateBillingHTML = (
  billing: Billing,
  transaction: Transaction,
  client: Client,
  products: Product[]
): string => {
  // Trouve les détails de chaque produit vendu
  const productDetails = transaction.soldProducts.map((soldProduct) => {
    const product = products.find((p) => p.id === soldProduct.productId);
    return {
      name: product?.name || 'Produit inconnu',
      unitPrice: product?.unitPrice || 0,
      quantity: soldProduct.quantity,
      note: soldProduct.note,
      total: (product?.unitPrice || 0) * soldProduct.quantity,
    };
  });

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Facture ${billing.reference}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      padding: 40px;
      color: #333;
      line-height: 1.6;
    }
    
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #3b82f6;
    }
    
    .company-info h1 {
      color: #3b82f6;
      font-size: 28px;
      margin-bottom: 5px;
    }
    
    .company-info p {
      color: #666;
      font-size: 14px;
    }
    
    .invoice-info {
      text-align: right;
    }
    
    .invoice-info h2 {
      color: #333;
      font-size: 24px;
      margin-bottom: 10px;
    }
    
    .invoice-info p {
      font-size: 14px;
      color: #666;
    }
    
    .invoice-number {
      font-size: 18px;
      font-weight: bold;
      color: #3b82f6;
    }
    
    .parties {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    
    .party {
      width: 45%;
    }
    
    .party h3 {
      font-size: 14px;
      color: #999;
      text-transform: uppercase;
      margin-bottom: 10px;
      letter-spacing: 1px;
    }
    
    .party-details {
      background: #f8fafc;
      padding: 15px;
      border-radius: 8px;
      border-left: 3px solid #3b82f6;
    }
    
    .party-details p {
      margin-bottom: 5px;
      font-size: 14px;
    }
    
    .party-details .name {
      font-weight: bold;
      font-size: 16px;
      color: #333;
      margin-bottom: 8px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    
    thead {
      background: #3b82f6;
      color: white;
    }
    
    th {
      padding: 12px;
      text-align: left;
      font-weight: 600;
      font-size: 14px;
    }
    
    th:last-child,
    td:last-child {
      text-align: right;
    }
    
    tbody tr {
      border-bottom: 1px solid #e5e7eb;
    }
    
    tbody tr:hover {
      background: #f9fafb;
    }
    
    td {
      padding: 12px;
      font-size: 14px;
    }
    
    .product-name {
      font-weight: 500;
      color: #333;
    }
    
    .product-note {
      font-size: 12px;
      color: #666;
      font-style: italic;
    }
    
    .totals {
      margin-left: auto;
      width: 300px;
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
    }
    
    .total-row.subtotal {
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 12px;
      margin-bottom: 8px;
    }
    
    .total-row.total {
      font-size: 18px;
      font-weight: bold;
      color: #3b82f6;
      padding-top: 12px;
      border-top: 2px solid #3b82f6;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    
    @media print {
      body {
        padding: 20px;
      }
      
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <!-- Header -->
    <div class="header">
      <div class="company-info">
        <h1>Gestion Pro</h1>
        <p>Votre partenaire de confiance</p>
      </div>
      <div class="invoice-info">
        <h2>FACTURE</h2>
        <p class="invoice-number">${billing.reference}</p>
        <p>Date: ${formatDate(billing.date, 'dd/MM/yyyy')}</p>
      </div>
    </div>
    
    <!-- Parties -->
    <div class="parties">
      <div class="party">
        <h3>Facturé à</h3>
        <div class="party-details">
          <p class="name">${client.name}</p>
          <p>${client.email}</p>
          ${client.tel ? `<p>${client.tel}</p>` : ''}
          ${client.address ? `<p>${client.address}</p>` : ''}
          <p>N° Fiscal: ${client.numIdentiteFiscal}</p>
        </div>
      </div>
      <div class="party">
        <h3>Informations</h3>
        <div class="party-details">
          <p><strong>Référence:</strong> ${billing.reference}</p>
          <p><strong>Date:</strong> ${formatDate(billing.date, 'dd/MM/yyyy')}</p>
          <p><strong>Transaction:</strong> #${transaction.id.substring(0, 8)}</p>
        </div>
      </div>
    </div>
    
    <!-- Products Table -->
    <table>
      <thead>
        <tr>
          <th>Produit</th>
          <th style="text-align: center;">Quantité</th>
          <th style="text-align: right;">Prix Unit.</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${productDetails.map(item => `
          <tr>
            <td>
              <div class="product-name">${item.name}</div>
              ${item.note ? `<div class="product-note">${item.note}</div>` : ''}
            </td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: right;">${formatCurrency(item.unitPrice)}</td>
            <td style="text-align: right;">${formatCurrency(item.total)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <!-- Totals -->
    <div class="totals">
      <div class="total-row subtotal">
        <span>Sous-total HT:</span>
        <span>${formatCurrency(billing.totalHT)}</span>
      </div>
      ${billing.enableTax ? `
        <div class="total-row">
          <span>TVA (${(billing.tva * 100).toFixed(0)}%):</span>
          <span>${formatCurrency(billing.totalTTC - billing.totalHT)}</span>
        </div>
      ` : ''}
      <div class="total-row total">
        <span>Total TTC:</span>
        <span>${formatCurrency(billing.totalTTC)}</span>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>Merci pour votre confiance !</p>
      <p>Cette facture a été générée automatiquement par Gestion Pro</p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Ouvre la facture dans une nouvelle fenêtre et déclenche l'impression
 */
export const printBilling = (
  billing: Billing,
  transaction: Transaction,
  client: Client,
  products: Product[]
) => {
  const html = generateBillingHTML(billing, transaction, client, products);
  
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Attendre que le contenu soit chargé avant d'imprimer
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};

/**
 * Télécharge la facture en PDF (utilise l'impression du navigateur)
 */
export const downloadBillingPDF = (
  billing: Billing,
  transaction: Transaction,
  client: Client,
  products: Product[]
) => {
  // On utilise la même méthode que print
  // L'utilisateur pourra choisir "Enregistrer en PDF" dans la boîte de dialogue d'impression
  printBilling(billing, transaction, client, products);
};