const loading = () => {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#38BDF8] rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading...</p>
        </div>
    );
}
export default loading