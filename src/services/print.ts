import PDFDocument from 'pdfkit';
import { fonts_path } from '../utils/fonts'

const fontSize = 52 // relation: 120 -> [20.04,121.6]
const legenda_size = 16
// const title_size = 14

const fontWidth = 16
// const fontHeight = 69.6

const margins = { bottom: 9.6, top: 9.6, left: 9.6, right: 9.6 }

// const barcode_top = 23.6
// const legenda_top = 74

export async function printEti1015(text: string, prepare?: (doc: PDFKit.PDFDocument) => Promise<void>) {

  const doc_width = 10 + (text.length * fontWidth)
  const doc_heigth = 98
  const minor_width = doc_width / 3
  const minor_heigth = doc_heigth / 2
  // create a document and pipe to a blob 
  const doc = new PDFDocument({
    // size: [432, 288], // a smaller document for small badge printers
    size: [doc_width, doc_heigth],
    compress: true
  });

  prepare && await prepare(doc)
  // const stream = fs.createWriteStream(options?.path || path.join(base_path, text + '.pdf'))
  // doc.pipe(stream)

  return new Promise((resolve, reject) => {
    try {

      doc.once('close', resolve)
      doc.once('error', reject)

      doc
        .font(fonts_path.calibri.bold)
        .fontSize(14)
        .text('DeviceID', 0, (doc_heigth / 2) - 20, {
          width: doc_width,
          height: 20,
          align: 'center',
          baseline: 'bottom'
        })

      doc
        .font(fonts_path.calibri.regular)
        .fontSize(legenda_size)
        .text(text, 0, (doc_heigth / 2) + 26, {
          width: doc_width,
          height: 20,
          align: 'center',
          baseline: 'top'
        })

      //codebar
      doc.font(fonts_path.code128)
        .fontSize(fontSize)
        .text(text, 0, doc_heigth / 2, {
          width: doc_width,
          height: 20,
          align: 'center',
          baseline: 'middle'
        })

      // doc.addPage({
      //   size: [doc_width, doc_heigth]
      // })
      //   .moveTo(0, 10)
      //   .lineTo(doc_width, 10)
      //   //
      //   .moveTo(0, doc_heigth - 10)
      //   .lineTo(doc_width, doc_heigth - 10)
      //   //
      //   .moveTo(0, doc_heigth / 2)
      //   .lineTo(doc_width, doc_heigth / 2)
      //   //
      //   .moveTo(doc_width / 3, 0)
      //   .lineTo(doc_width / 3, doc_heigth)
      //   //
      //   .moveTo(2 * minor_width, 0)
      //   .lineTo(2 * minor_width, doc_heigth)
      //   .stroke()

      // for (let j = 0; j < 2; j++) {
      //   for (let i = 0; i < 3; i++) {
      //     const text_line = (j * minor_heigth) + (minor_heigth / 2) + (j ? -5 : 5)
      //     const text_start = (i * minor_width)
      //     doc.font(fonts_path.calibri.bold)
      //       .fontSize(14 / 2)
      //       .text('DeviceID', text_start, text_line, {
      //         width: minor_width,
      //         height: 20,
      //         align: 'center',
      //         baseline: 'bottom'
      //       }).font(fonts_path.calibri.regular)
      //       .fontSize(legenda_size / 2)
      //       .text(text, text_start, text_line, {
      //         width: minor_width,
      //         height: 20,
      //         align: 'center',
      //         baseline: 'top'
      //       })
      //   }
      // }

      doc.end();

    } catch (error) {
      reject(error)
    }
  })
}