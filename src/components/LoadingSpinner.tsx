const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  )
}

export default LoadingSpinner
