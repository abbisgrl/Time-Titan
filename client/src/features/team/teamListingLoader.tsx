const TeamListingLoader = () => {
  const loaderArray = Array.from({ length: 5 }); // Adjust length as needed

  return (
    <div className="container mx-auto p-4 max-w-screen-lg">
      {/* Loader Rows */}
      {loaderArray.map((_, idx) => (
        <div
          key={idx}
          className="mb-4 bg-white shadow rounded-lg p-4 animate-pulse"
        >
          {/* Main rectangular loader with moderate width */}
          <div className="h-6 bg-gray-300 rounded w-full sm:w-[500px] md:w-[650px] lg:w-[926px]"></div>
        </div>
      ))}
    </div>
  );
};

export default TeamListingLoader;
