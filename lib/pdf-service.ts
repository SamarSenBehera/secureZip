import { PDFDocument, degrees, rgb, StandardFonts } from "pdf-lib"

// Merge multiple PDFs into one
export const mergePDFs = async (pdfBuffers: Buffer[]): Promise<Buffer> => {
  const mergedPdf = await PDFDocument.create()

  for (const pdfBuffer of pdfBuffers) {
    const pdf = await PDFDocument.load(pdfBuffer)
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
    copiedPages.forEach((page) => mergedPdf.addPage(page))
  }

  return Buffer.from(await mergedPdf.save())
}

// Split PDF into separate pages
export const splitPDF = async (pdfBuffer: Buffer): Promise<Buffer[]> => {
  const pdf = await PDFDocument.load(pdfBuffer)
  const pageCount = pdf.getPageCount()
  const result: Buffer[] = []

  for (let i = 0; i < pageCount; i++) {
    const newPdf = await PDFDocument.create()
    const [copiedPage] = await newPdf.copyPages(pdf, [i])
    newPdf.addPage(copiedPage)
    result.push(Buffer.from(await newPdf.save()))
  }

  return result
}

// Extract specific pages from PDF
export const extractPages = async (pdfBuffer: Buffer, pageNumbers: number[]): Promise<Buffer> => {
  const pdf = await PDFDocument.load(pdfBuffer)
  const newPdf = await PDFDocument.create()

  for (const pageNumber of pageNumbers) {
    if (pageNumber >= 1 && pageNumber <= pdf.getPageCount()) {
      const [copiedPage] = await newPdf.copyPages(pdf, [pageNumber - 1])
      newPdf.addPage(copiedPage)
    }
  }

  return Buffer.from(await newPdf.save())
}

// Rotate PDF pages
export const rotatePDF = async (pdfBuffer: Buffer, rotation: number): Promise<Buffer> => {
  const pdf = await PDFDocument.load(pdfBuffer)
  const pages = pdf.getPages()

  pages.forEach((page) => {
    page.setRotation(degrees(rotation))
  })

  return Buffer.from(await pdf.save())
}

// Add watermark to PDF
export const addWatermark = async (pdfBuffer: Buffer, watermarkText: string): Promise<Buffer> => {
  const pdf = await PDFDocument.load(pdfBuffer)
  const pages = pdf.getPages()
  const font = await pdf.embedFont(StandardFonts.Helvetica)

  pages.forEach((page) => {
    const { width, height } = page.getSize()
    page.drawText(watermarkText, {
      x: width / 2 - 150,
      y: height / 2,
      size: 50,
      font,
      color: rgb(0.8, 0.8, 0.8),
      opacity: 0.3,
      rotate: degrees(45),
    })
  })

  return Buffer.from(await pdf.save())
}

// Password protect PDF
export const passwordProtectPDF = async (pdfBuffer: Buffer, password: string): Promise<Buffer> => {
  const pdf = await PDFDocument.load(pdfBuffer)

  // Set user password (required to open the document)
  pdf.encrypt({
    userPassword: password,
    ownerPassword: password,
    permissions: {
      printing: "highResolution",
      modifying: false,
      copying: false,
      annotating: false,
      fillingForms: true,
      contentAccessibility: true,
      documentAssembly: false,
    },
  })

  return Buffer.from(await pdf.save())
}
