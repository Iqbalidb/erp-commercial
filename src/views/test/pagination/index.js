import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';

export default function Pagination( props ) {
    const { randersData } = props;
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowPerPage, setRowPerPage] = useState( 10 );

    const count = Number( Math.ceil( randersData().length / rowPerPage ) );
    const handlePage = ( page ) => {
        setCurrentPage( page.selected + 1 );
    };
    const handleRowPerPage = ( perPageRow ) => {
        const rowNo = Number( perPageRow );
        setRowPerPage( rowNo );
        setCurrentPage( 1 );

    };

    return (
        <ReactPaginate
            previousLabel={'Pre'}
            nextLabel={'Next'}
            pageCount={count || 1}
            activeClassName="active"
            forcePage={currentPage !== 0 ? currentPage - 1 : 0}
            onPageChange={( page ) => handlePage( page )}
            pageClassName={'page-item'}
            nextLinkClassName={'page-link'}
            nextClassName={'page-item next'}
            previousClassName={'page-item prev'}
            previousLinkClassName={'page-link'}
            pageLinkClassName={'page-link'}
            containerClassName={
                'pagination react-paginate justify-content-end mb-0'
            }
        />
    );
}
