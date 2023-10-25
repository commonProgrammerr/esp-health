import PDFDocument from 'pdfkit';
import fs from 'node:fs';

interface PrintOptions {
  fontSize?: number
  margin?: {
    top: number;
    left: number;
    bottom: number;
    right: number;
  }
}

export async function printEti1015(text: string, options?: PrintOptions) {

  const fontSize = options?.fontSize || 120 // relation: 120 -> [20.04,121.6]
  const fontWidth = fontSize * 0.167
  const fontHeight = fontSize * 1.013333333
  const margins = options?.margin || {
    bottom: 10, top: 10, left: 10, right: 10
  }
  return new Promise((resolve, reject) => {
    try {
      // create a document and pipe to a blob 
      const doc = new PDFDocument({
        // size: [432, 288], // a smaller document for small badge printers
        size: [40 + (text.length * fontWidth), 40 + fontHeight], // a smaller document for small badge printers
        margins,
        compress: true
      });

      const stream = fs.createWriteStream(`${text}.pdf`)
      doc.pipe(stream)
      stream.once('close', resolve)
      stream.once('error', reject)
      //codebar
      doc.font("./fonts/BarcodeFont.ttf")
        .fontSize(fontSize)
        .text(text, 19, 19)
      doc.end();

    } catch (error) {
      reject(error)
    }
  })
}