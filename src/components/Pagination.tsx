import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { setPage, fetchNews } from "../redux/newsSlice";

const PaginationControls = () => {
  const dispatch = useDispatch();
  const { page } = useSelector((state: RootState) => state.news);

  const handlePrevPage = () => {
    if (page > 1) {
      dispatch(setPage(page - 1));
      dispatch(fetchNews({ page: page - 1 }));
    }
  };

  const handleNextPage = () => {
    if (page) {
      dispatch(setPage(page + 1));
      dispatch(fetchNews({ page: page + 1 }));
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <button onClick={handlePrevPage} disabled={page === 1} className="p-2 bg-gray-300 rounded mr-2">
        Previous
      </button>
      {/* <span className="p-2">{`Page ${page} of ${totalPages}`}</span> */}
      <button onClick={handleNextPage}
      //  disabled={page === totalPages} 
       className="p-2 bg-gray-300 rounded ml-2">
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
