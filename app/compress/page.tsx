import { FileDown } from "lucide-react"

import { Header } from "@/components/header"
import { FileUploader } from "@/components/file-uploader"

export default function CompressPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-purple-gradient py-16 text-white">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <FileDown className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">Compress Files</h1>
              <p className="text-lg text-white/80">
                Reduce file size while optimizing for maximum quality. Our advanced DKD algorithm ensures the best
                compression ratio while maintaining file integrity.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6">
            <FileUploader
              toolType="compress"
              acceptedFileTypes="*"
              allowMultiple={false}
              maxFileSize={200}
              requirePassword={false}
            />

            <div className="mt-16 mx-auto max-w-3xl">
              <h2 className="text-2xl font-semibold mb-6 text-center">How to compress files</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center p-6 rounded-xl border border-primary-100 bg-white shadow-sm">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-50 mb-4">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-medium mb-2">Upload</h3>
                  <p className="text-sm text-gray-600">Select or drag and drop your files to the upload area above.</p>
                </div>

                <div className="flex flex-col items-center text-center p-6 rounded-xl border border-primary-100 bg-white shadow-sm">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-50 mb-4">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-medium mb-2">Process</h3>
                  <p className="text-sm text-gray-600">
                    Click the "Process Files" button to start the compression with DKD algorithm.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-6 rounded-xl border border-primary-100 bg-white shadow-sm">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-50 mb-4">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-medium mb-2">Download</h3>
                  <p className="text-sm text-gray-600">Download your compressed files with enhanced security.</p>
                </div>
              </div>

              <div className="mt-12 rounded-xl bg-primary-50 p-6 text-sm border border-primary-100">
                <h3 className="font-semibold text-lg mb-2 text-primary-800">About our compression technology</h3>
                <p className="text-gray-700">
                  Our Dynamic Keyed Dictionary (DKD) algorithm provides both compression and encryption in a single
                  process, ensuring your files are not only smaller but also secure. The algorithm analyzes patterns in
                  your data to achieve optimal compression ratios while applying military-grade encryption.
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="font-medium text-primary-700">Supports All File Types</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="font-medium text-primary-700">Military-Grade Encryption</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="font-medium text-primary-700">Up to 70% Size Reduction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-900 text-white py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">SecureZip</h3>
              <p className="text-gray-400 text-sm">
                Secure file compression and encryption using our proprietary DKD algorithm.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Tools</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/compress" className="text-gray-400 hover:text-white">
                    Compress Files
                  </a>
                </li>
                <li>
                  <a href="/merge" className="text-gray-400 hover:text-white">
                    Merge Files
                  </a>
                </li>
                <li>
                  <a href="/split" className="text-gray-400 hover:text-white">
                    Split Files
                  </a>
                </li>
                <li>
                  <a href="/encrypt" className="text-gray-400 hover:text-white">
                    Encrypt Files
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/about" className="text-gray-400 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-400 hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/blog" className="text-gray-400 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="/careers" className="text-gray-400 hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/terms" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/cookies" className="text-gray-400 hover:text-white">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center md:text-left">
            <p className="text-gray-400 text-sm">© 2023 SecureZip. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
