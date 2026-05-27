import React from 'react'
import { App } from '../components/App'
import ContactForm from './form/contact-form'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'
import { Phone, Mail, MessageCircle } from 'lucide-react'

const Contact = () => {
  return (
    <>
      <App
        head1='Join the dream'
        head2='team and build'
        head3='the future'
        head4=''
      />
      <div className='py-[120px] max-md:py-[80px] px-6'>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
          {/* Left Side: Contact Info */}
          <div className="lg:w-1/3 space-y-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Contact Information</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Reach out to us directly through any of these channels. Our team is ready to assist you.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#FF1284]/10 rounded-lg">
                  <Phone className="w-6 h-6 text-[#FF1284]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Team 1</p>
                  <a href="tel:7681842303" className="text-xl font-bold text-white hover:text-[#FF1284] transition-colors">+91 7681842303</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#26E9FF]/10 rounded-lg">
                  <Phone className="w-6 h-6 text-[#26E9FF]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Team 2</p>
                  <a href="tel:8763923036" className="text-xl font-bold text-white hover:text-[#26E9FF] transition-colors">+91 8763923036</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-lg">
                  <Mail className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Email Us</p>
                  <a href="mailto:business@illusorydesignstudios.com" className="text-lg font-bold text-white hover:text-gray-300 transition-colors">business@illusorydesignstudios.com</a>
                </div>
              </div>

              <div className="pt-8">
                <a 
                  href="https://wa.me/917681842303" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(37,211,102,0.3)]"
                >
                  <MessageCircle className="w-6 h-6" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:w-2/3">
            <ContactForm />
          </div>
        </div>
      </div>
      <FAQ />
      <Footer />
    </>
  )
}

export default Contact