"use client";

const SearchPage = ({ params }: { params: { search: string } }) => {
  // console.log("params", params.search);

  return (
    <div className="container mt-2">
      <h1 className="text-base"> Bottles Search Page {params.search} </h1>
    </div>
  );
};

export default SearchPage;
