import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 to-orange-50 py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-6 order-2 lg:order-1">
              <div className="inline-block">
                <span className="text-sm font-semibold text-amber-800 bg-amber-100 px-4 py-2 rounded-full">
                  ✨ Traditional Art, Modern Touch
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Welcome to
                <span className="block text-amber-800 mt-2">Mahi Mehendi</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                Discover elegant henna designs for every occasion. From simple normal mehendi to exquisite bridal artistry.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link 
                  href="/gallery" 
                  className="inline-block bg-amber-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-all duration-300 shadow-md hover:shadow-lg text-center"
                >
                  Explore Gallery
                </Link>
                <Link 
                  href="/services" 
                  className="inline-block bg-white text-amber-900 border-2 border-amber-900 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-all duration-300 text-center"
                >
                  Book a Service
                </Link>
              </div>
            </div>
            
            {/* Right Image/Decoration */}
            <div className="order-1 lg:order-2">
              <div className="relative w-full max-w-md mx-auto lg:max-w-none">
                <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl shadow-2xl overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-8xl">
                    🤲
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-200 rounded-full opacity-50 blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-orange-200 rounded-full opacity-50 blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Mehendi Services
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We travel for events and provide on-site application. Every design is customized for the occasion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Bridal Mehendi */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-amber-100">
              <div className="w-12 h-12 bg-amber-900 text-white rounded-xl flex items-center justify-center text-2xl font-bold mb-4">
                B
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Bridal Mehendi</h3>
              <p className="text-gray-600 text-sm mb-4">Full bridal artistry</p>
              <p className="text-gray-700 mb-4">
                Intricate, full-hand bridal designs tailored to your look — fusion, Indo-Arabic, traditional Rajasthani motifs, and modern floral compositions.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">From ₹2,500</span>
                <Link href="/services" className="bg-amber-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-800 transition-colors">
                  Book Now
                </Link>
              </div>
            </div>

            {/* Engagement Mehendi */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-amber-100">
              <div className="w-12 h-12 bg-amber-900 text-white rounded-xl flex items-center justify-center text-2xl font-bold mb-4">
                E
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Engagement Mehendi</h3>
              <p className="text-gray-600 text-sm mb-4">Elegant event designs</p>
              <p className="text-gray-700 mb-4">
                Beautiful engagement and pre-wedding mehendi styles — delicate wrists, palms and arms to match your outfit and personality.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">From ₹1,200</span>
                <Link href="/services" className="bg-amber-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-800 transition-colors">
                  Book Now
                </Link>
              </div>
            </div>

            {/* Baby Shower Mehendi */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-amber-100">
              <div className="w-12 h-12 bg-amber-900 text-white rounded-xl flex items-center justify-center text-2xl font-bold mb-4">
                B
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Baby Shower</h3>
              <p className="text-gray-600 text-sm mb-4">Soft & joyful motifs</p>
              <p className="text-gray-700 mb-4">
                Cute, meaningful motifs and gentle patterns perfect for moms-to-be — flowers, baby icons and calm, pretty designs.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">From ₹800</span>
                <Link href="/services" className="bg-amber-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-800 transition-colors">
                  Book Now
                </Link>
              </div>
            </div>

            {/* Casual Mehendi */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-amber-100">
              <div className="w-12 h-12 bg-amber-900 text-white rounded-xl flex items-center justify-center text-2xl font-bold mb-4">
                S
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sider / Casual</h3>
              <p className="text-gray-600 text-sm mb-4">Quick & pretty</p>
              <p className="text-gray-700 mb-4">
                Normal/daily mehendi or small-event designs — quick, pretty and affordable options for casual celebrations.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">From ₹300</span>
                <Link href="/services" className="bg-amber-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-800 transition-colors">
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bridal Spotlight */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Image Side */}
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-8 lg:p-12 flex items-center justify-center min-h-[300px] lg:min-h-[400px]">
                <div className="text-9xl">💍</div>
              </div>
              
              {/* Content Side */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="inline-block mb-4">
                  <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wide">
                    Featured
                  </span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Bridal Spotlight
                </h2>
                
                <p className="text-gray-600 text-lg mb-6">
                  Hand-covered bridal sets, custom designs to match your outfit and jewellery.
                </p>
                
                <Link 
                  href="/services" 
                  className="inline-block bg-amber-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-all duration-300 shadow-md hover:shadow-lg text-center w-full sm:w-auto"
                >
                  Request Bridal Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Mahi Mehendi?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Quality service with attention to every detail
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                🎨
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Artists</h3>
              <p className="text-gray-600">Skilled professionals with years of experience</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                🌿
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Natural Henna</h3>
              <p className="text-gray-600">100% organic and chemical-free ingredients</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                ⏰
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">On-Time Service</h3>
              <p className="text-gray-600">We travel to your location and arrive punctually</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                💝
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fair Pricing</h3>
              <p className="text-gray-600">Transparent rates with no hidden charges</p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Mehendi Courses (Hands-on)
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Practical, small-group classes — we teach everything from making perfect cones to advanced bridal designs. Get certified and start your own mehendi journey!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Basic Course</h3>
              <p className="text-gray-600 mb-4">Learn fundamental techniques and simple designs</p>
              <p className="text-2xl font-bold text-amber-900 mb-4">₹2,500</p>
              <Link href="/contact" className="block w-full bg-amber-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors text-center">
                Enroll Now
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced Course</h3>
              <p className="text-gray-600 mb-4">Master complex patterns and bridal designs</p>
              <p className="text-2xl font-bold text-amber-900 mb-4">₹5,000</p>
              <Link href="/contact" className="block w-full bg-amber-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors text-center">
                Enroll Now
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 md:col-span-2 lg:col-span-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Professional Course</h3>
              <p className="text-gray-600 mb-4">Complete training to start your business</p>
              <p className="text-2xl font-bold text-amber-900 mb-4">₹8,000</p>
              <Link href="/contact" className="block w-full bg-amber-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors text-center">
                Enroll Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-900 to-orange-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Add Beauty to Your Celebration?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Book your appointment today and let us create something beautiful for you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="inline-block bg-white text-amber-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl text-center"
            >
              Contact Us Now
            </Link>
            <Link 
              href="/gallery" 
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-amber-900 transition-all duration-300 text-center"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}