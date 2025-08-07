const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section Skeleton */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-emerald-800 py-24">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center text-white max-w-3xl mx-auto">
            <div className="h-12 bg-white/20 rounded-lg w-3/4 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-white/20 rounded w-2/3 mx-auto mb-8 animate-pulse"></div>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="h-10 w-40 bg-white/20 rounded-lg animate-pulse"></div>
              <div className="h-10 w-40 bg-white/20 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tours Grid Skeleton */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default LoadingSkeleton
