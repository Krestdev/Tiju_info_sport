import Link from 'next/link'
import React from 'react'

const ContactPage = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>
        <div className='inline-flex gap-2 items-center mb-3'>
          <p className='text-gray-500'>NOUS <span className='text-gray-700 font-medium'>CONTACTER</span></p>
          <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
        </div>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10'>
        <img className='w-full object-cover md:max-w-[480px] h-auto aspect-video' src='/images/Contact.jpg' alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <div className='flex flex-col'>
            <p className='font-semibold text-xl text-gray-600'>Nous sommes</p>
            <p className='text-gray-500'> Tyju Info Sport <br />Houston, TX, United States</p>
          </div>
          <div className='flex flex-col'>
            <Link className='hover:underline' href={"tel: 6 20 58 01 76"}>Tel: +(237) 6 20 58 01 76</Link>
            <Link className='hover:underline' href={"mailto: tyjuofficiel@gmail.com"}>Email: tyjuofficiel@gmail.com</Link>
          </div>
          <p className='font-semibold text-xl text-gray-600'>Careers  at Forever</p>
          <p className='text-gray-500'>Informez vous sur le sport en visitant nos publications</p>
          <Link href={'/category'} className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Nos Publications</Link>
        </div>
      </div>
      <div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d443090.69249136414!2d-95.7309313732617!3d29.816768862481357!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640b8b4488d8501%3A0xca0d02def365053b!2sHouston%2C%20Texas%2C%20%C3%89tats-Unis!5e0!3m2!1sfr!2sde!4v1733387925737!5m2!1sfr!2sde"
          width="600"
          height="450"
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className='w-full'
        ></iframe>
      </div>
    </div>
  )
}

export default ContactPage
