import Image from "next/image";

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-zinc-950 text-zinc-100 pt-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">About Us</h1>

          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
            Learn more about our journey, our mission, and the values that guide
            everything we do.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center   lg:justify-start">
            <video
              src="/mission.mp4"
              loop
              autoPlay
              muted
              playsInline
              className="max-w-sm rounded-2xl border border-zinc-800"
            ></video>
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-6">Our Story</h2>

            <p className="text-zinc-400 leading-8">
              Founded with a vision to provide customers with high-quality
              products and a seamless shopping experience, our company has
              continuously evolved to meet the needs of modern consumers.
            </p>

            <p className="text-zinc-400 leading-8 mt-4">
              We believe in quality, transparency, and customer satisfaction.
              Every product we offer is carefully selected to ensure value and
              reliability.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-4">Mission</h3>

            <p className="text-zinc-400">
              To provide customers with quality products and exceptional
              service.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-4">Vision</h3>

            <p className="text-zinc-400">
              To become a trusted destination for customers worldwide.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-4">Values</h3>

            <p className="text-zinc-400">
              Integrity, customer focus, innovation, and quality.
            </p>
          </div>
        </div>

        {/* Trust Section */}
        <div className="mt-20 mb-16">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
            <h2 className="text-3xl font-semibold mb-6">
              Why Customers Trust Us
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-medium mb-2">Quality Products</h4>

                <p className="text-zinc-400">
                  Carefully selected products that meet high standards.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Secure Shopping</h4>

                <p className="text-zinc-400">
                  Safe and reliable transactions for every order.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Customer Support</h4>

                <p className="text-zinc-400">
                  Dedicated support to help customers whenever needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
