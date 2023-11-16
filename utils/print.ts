import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path'
import Encoder from 'code-128-encoder'
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

const encoder = new Encoder()
const fontSize = 52 // relation: 120 -> [20.04,121.6]
const legenda_size = fontSize * .333333333
const title_size = fontSize * .291666667

const fontWidth = fontSize * 0.42
const fontHeight = fontSize * 1.45

const margins = {
  bottom: (fontSize * .2), top: (fontSize * .2), left: (fontSize * .2), right: (fontSize * .2)
}

const barcode_top = margins.top + title_size
const legenda_top = barcode_top + fontHeight - (fontSize * 0.4)

export async function printEti1015(text: string, options?: PrintOptions) {
  const encoded_text = encoder.encode(text)
  const doc_width = (encoded_text.length * fontWidth)
  const doc_heigth = doc_width / 2.5
  const minor_width = doc_width / 3.5

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
        .font('./fonts/calibri/bold.ttf')
        .fontSize(title_size)
        .text('DeviceID', 0, margins.top + 5, {
          width: doc_width,
          height: 20,
          align: 'center'
        })

      doc
        .font('./fonts/calibri/regular.ttf')
        .fontSize(legenda_size)
        .text(text, 0, legenda_top, {
          width: doc_width,
          align: 'center',
        })

      //codebar
      doc.font("./fonts/code128.ttf")
        .fontSize(fontSize)
        .text(encoded_text, 0, barcode_top, {
          width: doc_width,
          height: 20,
          align: 'center',
        })

      doc.addPage({
        size: [doc_width, doc_heigth]
      })
        .moveTo(0, doc_heigth / 5)
        .lineTo(doc_width, doc_heigth / 5)
        .moveTo(0, doc_heigth - (doc_heigth / 5))
        .lineTo(doc_width, doc_heigth - (doc_heigth / 5))

        .moveTo(0.79, 0)
        .lineTo(0.79, doc_heigth)

        .moveTo(minor_width, 0)
        .lineTo(minor_width, doc_heigth)

        .moveTo(2 * minor_width, 0)
        .lineTo(2 * minor_width, doc_heigth)
        .moveTo(3 * minor_width, 0)
        .lineTo(3 * minor_width, doc_heigth)
        .stroke()

      for (let i = 0; i < 3; i++) {
        const text_line = doc_heigth / 2
        const text_start = (i * minor_width)
        doc.font('./fonts/calibri/bold.ttf')
          .fontSize(title_size / 1.5)
          .text('DeviceID', text_start, text_line - 1.25, {
            width: minor_width,
            height: 20,
            align: 'center',
            baseline: 'bottom'
          })
          .fontSize(legenda_size / 1.5)
          .text(text, text_start, text_line + 1.25, {
            width: minor_width,
            height: 20,
            align: 'center',
            baseline: 'top'
          })
      }

      doc.end();

    } catch (error) {
      reject(error)
    }
  })
}