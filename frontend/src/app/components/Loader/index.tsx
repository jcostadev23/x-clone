const Loading = () => {
  return (
    <div className="flex fixed inset-0 z-50 items-center justify-center bg-opacity-50">
      <div
        className={
          "animate-spin rounded-full border-6 border-t-gray-500  text-gray-400 h-20 w-20"
        }
      />
    </div>
  );
};

export default Loading;
