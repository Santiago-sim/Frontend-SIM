export default function LoadingTour() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Skeleton */}
      <div className="relative h-[500px] w-full bg-gray-300 animate-pulse"></div>

      {/* Breadcrumbs Skeleton */}
      <div className="container mx-auto px-4 py-4 relative z-10 -mt-[500px]">
        <div className="h-4 w-64 bg-gray-200 rounded"></div>
      </div>

      {/* Tour Title Card Skeleton */}
      <div className="container mx-auto px-4 relative z-10 mt-[340px]">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 animate-pulse">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="h-8 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column Skeleton */}
          <div className="md:col-span-2">
            {/* Quick Info Skeleton */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-pulse">
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-10 w-10 bg-gray-200 rounded-full mr-2"></div>
                    <div>
                      <div className="h-3 w-16 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="mb-8 animate-pulse">
              <div className="grid grid-cols-4 gap-2 mb-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>

            {/* Location Skeleton */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-pulse">
              <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
              <div className="aspect-video bg-gray-200 rounded-lg"></div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>

              <div className="mb-6">
                <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
              </div>

              <div className="mb-6">
                <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>

              <div className="mb-6 pt-4">
                <div className="flex justify-between mb-2">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
                <div className="flex justify-between mt-4 pt-4">
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>

              <div className="h-12 w-full bg-gray-200 rounded mb-3"></div>
              <div className="h-12 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
