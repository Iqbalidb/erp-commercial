import '@custom-styles/basic/custom-table.scss';
import { useCallback, useEffect, useState } from "react";
import { Menu } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import { Table } from "reactstrap";


const RowHandler = SortableHandle( ( { children } ) => {
    return <>
        <span style={{
            cursor: 'grab'
        }}
            className='pr-1 font-weight-bolder'>
            <Menu size={12} />
        </span>
    </ >;
} );

const TableRow = ( { value, columns, noOfIndex } ) => {
    return (
        <>
            <tr >
                {
                    columns.map( ( column, inx ) => {
                        return (
                            <td
                                key={inx}

                                style={{
                                    width: column.width ?? '',
                                    textAlign: column?.type === 'action' ? 'center' : column?.type === 'number' ? 'right' : 'left',
                                    wordBreak: 'break-word'
                                }}
                            >

                                <div className={`d-flex align-items-center ${column?.type === 'action' ? 'justify-content-center' : column?.type === 'number' ? 'justify-content-right' : 'justify-content-start'}`}>
                                    {inx === 0 &&

                                        <RowHandler size={12} />
                                    }
                                    {column.cell( value, noOfIndex )}
                                </div>
                            </td>
                        );
                    } )
                }


            </tr>
        </>

    );
};


// import arrayMove from "./arrayMove";

function arrayMove( array, from, to, onOrderChange ) {
    array = array.slice();
    array.splice( to < 0 ? array.length + to : to, 0, array.splice( from, 1 )[0] );
    onOrderChange( array );
    return array;
}
const SortableCont = SortableContainer( ( { children } ) => {
    return <tbody>{children}</tbody>;
} );

const SortableItem = SortableElement( props => <TableRow {...props} /> );

const ReOrderableTable = ( props ) => {
    const { title, columns, data, onOrderChange } = props;
    const [items, setItems] = useState( data );


    const rows = [5, 10, 25, 50, 100, 200, 300, 500, 1000];
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowPerPage, setRowPerPage] = useState( 10 );

    const handlePage = ( page ) => {
        setCurrentPage( page.selected + 1 );
    };
    const handleRowPerPage = ( perPageRow ) => {
        const rowNo = Number( perPageRow );
        setRowPerPage( rowNo );
        setCurrentPage( 1 );
    };
    const indexOfLastData = currentPage * rowPerPage;
    const indexOfFirstData = indexOfLastData - rowPerPage;

    const count = Number( Math.ceil( items?.length / rowPerPage ) );
    const dataSlice = items?.slice( indexOfFirstData, indexOfLastData );

    ///for Re-Ordering rows
    const onSortEnd = useCallback( ( { oldIndex, newIndex } ) => {
        setItems( oldItems => arrayMove( oldItems, oldIndex, newIndex, onOrderChange ) );
    }, [] );

    useEffect( () => {
        setItems( data );
        return () => {
            setItems( [] );
        };
    }, [data] );


    return (
        <div className="dt">
            {
                title && (
                    <h6 className='font-weight-bold'>
                        {title}
                    </h6>
                )
            }

            <Table bordered size="sm" className="custom-dt-table" responsive>
                <thead>
                    <tr>
                        {
                            columns?.map( ( column, index ) => {
                                return (
                                    <th
                                        key={index}

                                        style={{
                                            width: column.width ?? '100px',
                                            textAlign: column?.type === 'action' ? 'center' : column?.type === 'number' ? 'right' : 'left'
                                        }}
                                    >
                                        {column.name}
                                    </th>
                                );
                            } )
                        }
                    </tr>
                </thead>
                <SortableCont
                    onSortEnd={onSortEnd}
                    axis="y"
                    lockAxis="y"
                    lockToContainerEdges={true}
                    lockOffset={["30%", "50%"]}
                    helperClass="helperContainerClass"
                    useDragHandle={true}
                >
                    {dataSlice?.map( ( value, index ) => (
                        <SortableItem
                            key={`item-${index}`}
                            index={index}
                            noOfIndex={index}
                            value={value}
                            columns={columns}
                        />
                    ) )}
                </SortableCont>
            </Table>
            <div >
                <div className='pagination-container'>
                    <div className="pagination">

                        <div className="row-per-page pr-1">
                            <label htmlFor="rowPerPageId">Row Per page:</label>
                            <select

                                value={rowPerPage}
                                onChange={( e ) => {
                                    handleRowPerPage( e.target.value );
                                }}
                                name="rowPerPage"
                                id="rowPerPageId"
                            >
                                {rows?.map( ( row, index ) => (
                                    <option key={index + 1} value={row}>
                                        {row}
                                    </option>
                                ) )}
                            </select>
                        </div>

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
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ReOrderableTable;
