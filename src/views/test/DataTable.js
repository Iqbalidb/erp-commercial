import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { ChevronUp, Plus } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { Table } from 'reactstrap';
import ResizableTable from 'utility/custom/ResizableTable';
import { randomIdGenerator, randomIdString } from '../../utility/Utils';
import './test.scss';

export default function DataTable( props ) {
    const { filterArray,
        columns,
        filteredData,
        paginationServer = false,
        setFilteredData,
        data,
        serverSorting,
        CustomPagination,
        filter,
        expandableRows = false,
        expandIcon,
        ExpandedComponent
    } = props;
    const [showExpandedRowId, setShowExpandedRowId] = useState( '' );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowPerPage, setRowPerPage] = useState( 10 );
    const [count, setCount] = useState( 0 );
    const [expandedCompHeight, setExpandedCompHeight] = useState( 0 );
    const [exCompPos, setExCompPos] = useState( { top: 0, left: 0 } );
    const [tableColumns, setTableColumns] = useState( columns );
    const [tableHeadHeight, setTableHeadHeight] = useState( 0 ); //table headers (th) height
    const [tableDataHeight, setTableDataHeight] = useState( 0 ); //table data (td) height
    const [tableRowHeight, setTableRowHeight] = useState( 0 ); //table rows (tr) height
    const fixedColumns = columns.filter( el => el.isFixed );
    const resizeColumns = columns.filter( el => !el.isFixed );
    const rows = [5, 10, 25, 50, 100, 200, 300, 500, 1000];
    const expandedCompRef = useRef( null );
    // const expandedTableData = useRef( null );
    const resizableTableHeadRef = useRef( null ); //resizable th ref
    const tableDataRef = useRef( null ); //resizable filter td ref
    const tableRow = useRef( null ); //resizable table row
    const [expanded, setExpanded] = useState( false );

    const handlePage = ( page ) => {
        setCurrentPage( page.selected + 1 );
    };
    // handles pagination
    const handleRowPerPage = ( perPageRow ) => {
        const rowNo = Number( perPageRow );
        setRowPerPage( rowNo );
        setCurrentPage( 1 );
    };

    const indexOfLastData = currentPage * rowPerPage;
    const indexOfFirstData = indexOfLastData - rowPerPage;
    // useEffect( () => {
    //     setTableHeadHeight( resizableTableHeadRef.current.offsetHeight );
    //     setTableDataHeight( tableDataRef.current.offsetHeight );
    //     setTableRowHeight( tableRow.current.offsetHeight );
    // }, [] );

    useEffect( () => {
        let subscribe = true;
        if ( subscribe ) {
            const cnt = Number( Math.ceil( data?.length / rowPerPage ) );
            setCount( cnt );
            // setFilteredData( data?.slice( indexOfFirstData, indexOfLastData ) );

        }
        return () => {
            subscribe = false;
        };
    }, [currentPage, rowPerPage] );


    const handleExpandedRow = ( col ) => {

        setShowExpandedRowId( col.rowId );
        const updatedData = data.map( d => {
            if ( d.rowId === col.rowId ) {
                d['expanded'] = !d.expanded;
                setExpanded( prev => !prev );
            }
            return d;
        } );
        const expandedRow = data.find( d => d.rowId === col.rowId );
        setFilteredData( updatedData );
    };


    // sorting table
    const handleSort = ( column ) => {

        if ( serverSorting ) {
            serverSorting();
        } else {
            let sorted;
            if ( column.sortable ) {
                if ( column.type === 'number' ) {
                    filteredData.sort( ( a, b ) => {
                        // if sorting order is true it will sort in ascending order
                        return column.sortingOrder ? a[column.id] - b[column.id] : b[column.id] - a[column.id];
                    } );
                } else if ( column.type === 'date' ) {
                    filteredData.sort( ( a, b ) => {
                        return column.sortingOrder ? new Date( a[column.id] ) - new Date( b[column.id] ) : new Date( b[column.id] ) - new Date( a[column.id] );
                    } );
                } else {
                    filteredData.sort( ( a, b ) => {
                        return column.sortingOrder ? a[column.id].localeCompare( b[column.id] ) : b[column.id].localeCompare( a[column.id] );
                    } );
                }
            }
            const updatedData = columns.map( d => {
                if ( d.id === column.id ) {
                    d['sortingOrder'] = !d.sortingOrder;
                }
                return d;
            } );
            setTableColumns( updatedData );

        }
    };

    const dataSlice = filteredData.length > 10 ? filteredData.slice( indexOfFirstData, indexOfLastData ) : filteredData;
    const expandedTableData = useCallback( ( node ) => {
        console.log( 'expander height', node?.clientHeight );
        if ( node?.clientHeight ) {
            setExpandedCompHeight( node?.clientHeight );
        } else {
            setExpandedCompHeight( 0 );
        }

    }, [] );
    const parentExpandedComp = useCallback( ( node ) => {
        console.log( 'top height', node?.getBoundingClientRect() );
    }, [] );
    return (
        <div
            className='resizable-data-table'>
            <div className='nested-table-container' style={{ position: 'relative', overflow: 'hidden' }}>
                {/* fixed table section */}
                <Table
                    hover
                    bordered
                    className='fixed-table'
                >
                    <thead>
                        <tr>
                            {expandableRows && <th></th>}
                            {
                                fixedColumns?.map( ( el, i ) => (
                                    <th
                                        style={{
                                            cursor: el.sortable && 'pointer',
                                            width: el.width ?? '',
                                            textAlign: el.type === 'action' ? 'center' : el.type === 'number' ? 'center' : 'left',
                                            height: tableHeadHeight
                                        }}
                                        key={el.id}>
                                        <span
                                            onClick={() => handleSort( el )}>
                                            {el.name} {el.sortable && <ChevronUp

                                                size={16}
                                                style={{ rotate: el.sortingOrder ? '180deg' : '360deg' }} />}
                                        </span>
                                    </th>
                                ) )
                            }
                        </tr>
                    </thead>
                    <tbody>
                        <tr hidden={!filter}>
                            {expandableRows && <td></td>}
                            {
                                filterArray.map( ( filter, index ) => (
                                    fixedColumns.map( ( c, indx ) => (
                                        <Fragment key={indx + 1}>
                                            <td style={{ height: tableDataHeight }}>{filter[c.selector]}</td>
                                        </Fragment>
                                    ) )
                                ) )
                            }
                        </tr>

                        {dataSlice.map( ( column, index ) => (
                            <Fragment key={index + 1}>
                                <tr style={{ height: tableRowHeight }}>
                                    {expandableRows && <td
                                        style={{ textAlign: 'center' }}
                                        onClick={() => handleExpandedRow( column )}>{expandIcon ? expandIcon : <Plus size={16} />}
                                    </td>}

                                    {
                                        fixedColumns.map( ( c, indx ) => (
                                            <Fragment key={indx + 1}>
                                                <td
                                                    id={`${c.id}${column.rowId.toString()}d`}
                                                    style={{
                                                        width: c.width ?? '',
                                                        textAlign: c.type === 'action' ? 'center' : c.type === 'number' ? 'right' : 'left',
                                                        height: tableRowHeight
                                                    }}
                                                >
                                                    {c?.cell ? c.cell( column, index ) : column[c.selector]}

                                                </td>
                                            </Fragment>
                                        ) )
                                    }
                                </tr>
                                {/* expandable component */}
                                {column.expanded && <tr
                                    key={index + 11}
                                    id={column.id}
                                    // hidden={!column.expanded}
                                    // ref={expandedCompRef}
                                    ref={parentExpandedComp}
                                    style={{ zIndex: 1 }}
                                >
                                    <td
                                        // ref={expandedTableData}
                                        id={randomIdString()}
                                        style={{
                                            position: 'relative',
                                            // height: `${expandedCompHeight}px`,
                                            height: expandedCompHeight

                                        }}
                                        colSpan={columns.length + 1}
                                    >
                                        <div
                                            // ref={expandedTableData}
                                            style={{
                                                position: 'absolute',
                                                minWidth: '500px',
                                                // height: '100%',
                                                // top: ` ${column.top}px`,
                                                // left: ` ${column.left}px`,
                                                top: 0,
                                                zIndex: 10
                                            }}
                                        >
                                            {/* <ExpandedComponent /> */}
                                        </div>
                                        {/* </div> */}
                                    </td>
                                </tr>}
                            </Fragment>

                        ) )}


                    </tbody>
                </Table>
                {/* resizable table section */}
                <ResizableTable
                    responsive={true}
                    bordered
                    mainClass={`resizebom-${randomIdGenerator().toString()}`}
                    tableId={`bomTable-${randomIdGenerator().toString()}`}
                    className="bom-po-details-table"
                >
                    <thead>
                        <tr>
                            {resizeColumns.map( ( column ) => (
                                <th
                                    ref={resizableTableHeadRef}
                                    style={{
                                        cursor: column.sortable && 'pointer',
                                        width: column.width ?? '',
                                        textAlign: column.type === 'action' ? 'center' : column.type === 'number' ? 'center' : 'left'
                                    }}
                                    key={column.id}>
                                    <span
                                        onClick={() => handleSort( column )}>
                                        {column.name} {column.sortable && <ChevronUp

                                            size={16}
                                            style={{ rotate: column.sortingOrder ? '180deg' : '360deg' }} />}
                                    </span>
                                </th>
                            ) )}
                        </tr>
                    </thead>
                    <tbody>
                        {/* filtering row */}
                        <tr hidden={!filter}>

                            {
                                filterArray.map( ( filter, index ) => (
                                    resizeColumns.map( ( c, indx ) => (
                                        <Fragment key={indx + 1}>
                                            <td ref={tableDataRef}>{filter[c.selector]}</td>
                                        </Fragment>
                                    ) )
                                ) )
                            }
                        </tr>

                        {dataSlice?.map( ( column, index ) => (
                            <Fragment key={index + 1}>
                                <tr ref={tableRow}>

                                    {
                                        resizeColumns.map( ( c, indx ) => (
                                            <Fragment key={indx + 1}>
                                                <td
                                                    ref={tableRow}
                                                    id={`${c.id}${column.rowId.toString()}d`}
                                                    style={{
                                                        width: c.width ?? '',
                                                        textAlign: c.type === 'action' ? 'center' : c.type === 'number' ? 'right' : 'left'
                                                    }}
                                                >
                                                    {c?.cell ? c.cell( column, index ) : column[c.selector]}

                                                </td>
                                            </Fragment>
                                        ) )
                                    }


                                </tr>

                                {/* expandable component */}
                                {column.expanded ? <tr
                                    key={index + 11}
                                    style={{
                                        height: expandedCompHeight,
                                        position: 'relative',
                                        zIndex: 1,
                                        opacity: 1
                                    }}
                                >
                                    <td
                                        colSpan={columns.length + 1} >
                                        <div
                                            ref={expandedTableData}
                                            style={{
                                                position: 'absolute',
                                                minWidth: '500px',
                                                // height: '100%',
                                                // top: ` ${column.top}px`,
                                                left: ` -200px`,
                                                top: 0,
                                                zIndex: 999
                                            }}
                                        >
                                            <ExpandedComponent />
                                        </div>
                                        {/* <ExpandedComponent /> */}
                                    </td>

                                </tr> : null}

                            </Fragment>

                        ) )}


                    </tbody>

                </ResizableTable>
            </div>

            {/* pagination section */}
            <div hidden={!filteredData?.length}
                style={{
                    display: 'flex',
                    width: '100%',
                    marginTop: '20px'
                }}>
                <div
                    className="pagination-select"
                >

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
                            {rows.map( ( row, index ) => (
                                <option key={index + 1} value={row}>
                                    {row}
                                </option>
                            ) )}
                        </select>
                    </div>

                    {paginationServer ? <CustomPagination /> : <ReactPaginate
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
                    />}
                </div>
            </div>


        </div>
    );
}
