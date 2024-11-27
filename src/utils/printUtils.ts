import React from 'react';

export const printImage = (imageUrl: string) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Photo</title>
        <style>
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            img {
              width: 100%;
              height: auto;
              page-break-after: avoid;
            }
          }
        </style>
      </head>
      <body onload="window.print();window.close()">
        <img src="${imageUrl}" alt="Print"/>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};