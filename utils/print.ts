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

  // const fontSize = options?.fontSize || 120 // relation: 120 -> [20.04,121.6]
  // const fontWidth = fontSize * 0.167
  // const fontHeight = fontSize * 1.013333333
  const fontSize = options?.fontSize || 120 // relation: 120 -> [20.04,121.6]
  const legenda_size = fontSize * .2
  const title_size = fontSize * .15

  const fontWidth = fontSize * 0.33
  const fontHeight = fontSize * 1.084

  const margins = options?.margin || {
    bottom: (fontSize * .2), top: (fontSize * .2), left: (fontSize * .2), right: (fontSize * .2)
  }

  const barcode_top = margins.top + title_size
  const legenda_top = barcode_top + fontHeight - (fontSize * 0.4)

  const doc_width = (margins.left * 2) + (text.length * fontWidth)
  const doc_heigth = (margins.bottom * 2) + fontHeight + legenda_size + title_size - (fontSize * 0.275)


  return new Promise((resolve, reject) => {
    try {
      // create a document and pipe to a blob 
      const doc = new PDFDocument({
        // size: [432, 288], // a smaller document for small badge printers
        size: [doc_width, doc_heigth],
        margins,
        compress: true
      });

      const stream = fs.createWriteStream(`${text}.pdf`)
      doc.pipe(stream)
      stream.once('close', resolve)
      stream.once('error', reject)

      doc
        .font('Helvetica-Bold')
        .fontSize(title_size)
        .text('DeviceID', 0, margins.top, {
          width: doc_width,
          align: 'center'
        })

      doc
        .font('Helvetica')
        .fontSize(legenda_size)
        .text(text, 0, legenda_top, {
          width: doc_width,
          align: 'center',
        })

      //codebar
      doc.font("./fonts/LibreBarcode128-Regular.ttf")
        .fontSize(fontSize)
        .text(text, 0, barcode_top, {
          width: doc_width,
          align: 'center',
        })

      doc.end();

    } catch (error) {
      reject(error)
    }
  })
}