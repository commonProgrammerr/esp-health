import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path'
import { fonts_path } from './fonts'

const base_path = process.env.PRINTS_DIR_PATH as string

interface PrintOptions {
  fontSize?: number
  margin?: {
    top: number;
    left: number;
    bottom: number;
    right: number;
  }
  path?: string
}

const fontSize = 48 // relation: 120 -> [20.04,121.6]
const legenda_size = fontSize * .333333333
const title_size = fontSize * .291666667

const fontWidth = fontSize * 0.33
const fontHeight = fontSize * 1.45

const margins = {
  bottom: (fontSize * .2), top: (fontSize * .2), left: (fontSize * .2), right: (fontSize * .2)
}

const barcode_top = margins.top + title_size
const legenda_top = barcode_top + fontHeight - (fontSize * 0.4)

export async function printEti1015(text: string, options?: PrintOptions) {

  const doc_width = (margins.left * 2) + (text.length * fontWidth)
  const doc_heigth = (margins.bottom * 2) + fontHeight + legenda_size + title_size - (fontSize * 0.275)
  const minor_width = doc_width / 3
  const minor_heigth = doc_heigth / 2

  return new Promise((resolve, reject) => {
    try {
      // create a document and pipe to a blob 
      const doc = new PDFDocument({
        // size: [432, 288], // a smaller document for small badge printers
        size: [doc_width, doc_heigth],
        margins,
        compress: true
      });

      const stream = fs.createWriteStream(options?.path || path.join(base_path, text + '.pdf'))
      doc.pipe(stream)
      stream.once('close', resolve)
      stream.once('error', reject)

      doc
        .font(fonts_path.calibri.bold)
        .fontSize(title_size)
        .text('DeviceID', 0, margins.top, {
          width: doc_width,
          align: 'center'
        })

      doc
        .font(fonts_path.calibri.regular)
        .fontSize(legenda_size)
        .text(text, 0, legenda_top, {
          width: doc_width,
          align: 'center',
        })

      //codebar
      doc.font(fonts_path.code128)
        .fontSize(fontSize)
        .text(text, 0, barcode_top, {
          width: doc_width,
          align: 'center',
        })

      doc.addPage({
        size: [doc_width, doc_heigth]
      })
        .moveTo(0, 10)
        .lineTo(doc_width, 10)
        //
        .moveTo(0, doc_heigth - 10)
        .lineTo(doc_width, doc_heigth - 10)
        //
        .moveTo(0, doc_heigth / 2)
        .lineTo(doc_width, doc_heigth / 2)
        //
        .moveTo(doc_width / 3, 0)
        .lineTo(doc_width / 3, doc_heigth)
        //
        .moveTo(2 * minor_width, 0)
        .lineTo(2 * minor_width, doc_heigth)
        .stroke()
      for (let j = 0; j < 2; j++) {
        for (let i = 0; i < 3; i++) {
          const text_line = (j * minor_heigth) + (minor_heigth / 2) + (j ? -5 : 5)
          const text_start = (i * minor_width)
          doc.font(fonts_path.calibri.bold)
            .fontSize(title_size / 2)
            .text('DeviceID', text_start, text_line, {
              width: minor_width,
              height: 20,
              align: 'center',
              baseline: 'bottom'
            }).font(fonts_path.calibri.regular)
            .fontSize(legenda_size / 2)
            .text(text, text_start, text_line, {
              width: minor_width,
              height: 20,
              align: 'center',
              baseline: 'top'
            })
        }
      }

      doc.end();

    } catch (error) {
      reject(error)
    }
  })
}