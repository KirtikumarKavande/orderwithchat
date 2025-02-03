interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    loading: boolean;
  }
  
  export default function Pagination({ currentPage, totalPages, onPageChange, loading }: PaginationProps) {
    return (
      <div className="mt-8 flex justify-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="px-4 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
        >
          Previous
        </button>
        
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = currentPage - 2 + i;
          if (pageNum > 0 && pageNum <= totalPages) {
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white'
                    : 'border hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            );
          }
          return null;
        })}
  
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="px-4 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
        >
          Next
        </button>
      </div>
    );
  }