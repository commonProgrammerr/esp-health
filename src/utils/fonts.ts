import path from 'path'

const fonts_dir = path.resolve('public/fonts')


export const fonts_path = {
  calibri: {
    bold_italic: path.join(fonts_dir, 'calibri/bold-italic.ttf'),
    bold: path.join(fonts_dir, 'calibri/bold.ttf'),
    italic: path.join(fonts_dir, 'calibri/italic.ttf'),
    regular: path.join(fonts_dir, 'calibri/regular.ttf')
  },
  BarcodeFont: path.join(fonts_dir, 'BarcodeFont.ttf'),
  code128: path.join(fonts_dir, 'code128.ttf'),
  LibreBarcode128: path.join(fonts_dir, 'LibreBarcode128-Regular.ttf'),
}


