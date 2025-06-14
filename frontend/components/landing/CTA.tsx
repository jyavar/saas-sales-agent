const CTA = () => {
  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Ready to Transform Your GitHub Into Sales?</h2>
        <p className="text-lg text-gray-600 mb-8">
          Most founders see their first qualified lead within 48 hours. Average setup time: 12 minutes.
        </p>
        <div className="flex justify-center space-x-4">
          <span className="text-sm text-gray-500">Works with any GitHub repository</span>
          <span className="text-sm text-gray-500">No credit card required</span>
          <span className="text-sm text-gray-500">Cancel anytime</span>
        </div>
        <a href="#" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-8">
          Get Started
        </a>
      </div>
    </section>
  )
}

export default CTA
