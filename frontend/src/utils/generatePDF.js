import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const addHeader = (doc, title) => {
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, 210, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('PARAMOUNT ENTERPRISES', 14, 15);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Hardware Shop Management System', 14, 23);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 196, 15, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Generated: ' + new Date().toLocaleString(), 196, 23, { align: 'right' });
  doc.setTextColor(0, 0, 0);
};

const addFooter = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 285, 210, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('2026 Paramount Enterprises. All rights reserved.', 14, 292);
    doc.text('Page ' + i + ' of ' + pageCount, 196, 292, { align: 'right' });
    doc.setTextColor(0, 0, 0);
  }
};

const summaryBox = (doc, items) => {
  items.forEach((item, i) => {
    const x = 14 + i * 65;
    doc.setFillColor(241, 245, 249);
    doc.rect(x, 42, 62, 18, 'F');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(item.label, x + 31, 48, { align: 'center' });
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(String(item.value), x + 31, 57, { align: 'center' });
  });
  doc.setTextColor(0, 0, 0);
};

export const generateStockPDF = (stocks) => {
  const doc = new jsPDF();
  addHeader(doc, 'STOCK REPORT');
  const lowStock = stocks.filter(s => s.stockQuantity <= s.reorderLevel).length;
  summaryBox(doc, [
    { label: 'TOTAL PRODUCTS', value: stocks.length },
    { label: 'TOTAL UNITS', value: stocks.reduce((s, i) => s + i.stockQuantity, 0) },
    { label: 'LOW STOCK ITEMS', value: lowStock },
  ]);
  autoTable(doc, {
    startY: 68,
    head: [['#', 'Product Name', 'Supplier', 'Quantity', 'Reorder Level', 'Status']],
    body: stocks.map((s, i) => [i + 1, s.product, s.supplier, s.stockQuantity, s.reorderLevel, s.stockQuantity <= s.reorderLevel ? 'Low Stock' : 'In Stock']),
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    didParseCell: (data) => {
      if (data.column.index === 5 && data.section === 'body') {
        data.cell.styles.textColor = data.cell.raw === 'Low Stock' ? [220, 38, 38] : [22, 163, 74];
        data.cell.styles.fontStyle = 'bold';
      }
    },
    margin: { left: 14, right: 14 },
  });
  addFooter(doc);
  doc.save('paramount-stock-report.pdf');
};

export const generateCustomerPDF = (customers) => {
  const doc = new jsPDF();
  addHeader(doc, 'CUSTOMER REPORT');
  summaryBox(doc, [{ label: 'TOTAL CUSTOMERS', value: customers.length }]);
  autoTable(doc, {
    startY: 68,
    head: [['#', 'Name', 'Contact', 'Email', 'Address']],
    body: customers.map((c, i) => [i + 1, c.name, c.contact, c.email || '-', c.address || '-']),
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
  });
  addFooter(doc);
  doc.save('paramount-customer-report.pdf');
};

export const generateOrderPDF = (orders) => {
  const doc = new jsPDF();
  addHeader(doc, 'ORDER REPORT');
  const totalRevenue = orders.reduce((s, o) => s + Number(o.total_amount || o.totalAmount || 0), 0);
  const pending = orders.filter(o => o.status === 'Pending').length;
  summaryBox(doc, [
    { label: 'TOTAL ORDERS', value: orders.length },
    { label: 'PENDING', value: pending },
    { label: 'REVENUE (LKR)', value: totalRevenue.toLocaleString() },
  ]);
  autoTable(doc, {
    startY: 68,
    head: [['#', 'Customer', 'Date', 'Total (LKR)', 'Status']],
    body: orders.map((o, i) => [i + 1, o.customer_name || o.customerName, new Date(o.createdAt).toLocaleDateString(), Number(o.total_amount || o.totalAmount || 0).toLocaleString(), o.status]),
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
  });
  addFooter(doc);
  doc.save('paramount-order-report.pdf');
};

export const generateSupplierPDF = (suppliers) => {
  const doc = new jsPDF();
  addHeader(doc, 'SUPPLIER REPORT');
  summaryBox(doc, [{ label: 'TOTAL SUPPLIERS', value: suppliers.length }]);
  autoTable(doc, {
    startY: 68,
    head: [['#', 'Supplier Name', 'Contact', 'Email', 'Products Supplied']],
    body: suppliers.map((s, i) => [i + 1, s.supplierName, s.contact, s.email || '-', s.productsSupplied || '-']),
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
  });
  addFooter(doc);
  doc.save('paramount-supplier-report.pdf');
};

export const generateEmployeePDF = (employees) => {
  const doc = new jsPDF();
  addHeader(doc, 'EMPLOYEE REPORT');
  const totalSalary = employees.reduce((s, e) => s + e.salary, 0);
  const unpaid = employees.filter(e => e.paymentStatus === 'Unpaid').length;
  summaryBox(doc, [
    { label: 'TOTAL EMPLOYEES', value: employees.length },
    { label: 'MONTHLY SALARY (LKR)', value: totalSalary.toLocaleString() },
    { label: 'UNPAID', value: unpaid },
  ]);
  autoTable(doc, {
    startY: 68,
    head: [['#', 'Employee ID', 'Name', 'Role', 'Salary (LKR)', 'Payment']],
    body: employees.map((e, i) => [i + 1, e.employeeId, e.name, e.role, e.salary.toLocaleString(), e.paymentStatus]),
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    didParseCell: (data) => {
      if (data.column.index === 5 && data.section === 'body') {
        data.cell.styles.textColor = data.cell.raw === 'Paid' ? [22, 163, 74] : [220, 38, 38];
        data.cell.styles.fontStyle = 'bold';
      }
    },
    margin: { left: 14, right: 14 },
  });
  addFooter(doc);
  doc.save('paramount-employee-report.pdf');
};