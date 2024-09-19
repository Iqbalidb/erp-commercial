// import '@custom-styles/merchandising/others/custom-resizable-table.scss';
import '@custom-styles/basic/custom-table.scss';
import classnames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';
import { Plus } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { Table } from 'reactstrap';
import { randomIdGenerator } from '../Utils';

const CustomTable = ( props ) => {

    const {
        className = "custom-dt-table",
        mainClass = `custom-dt-table${randomIdGenerator()}d`,
        tableId = `custom-dt-table${randomIdGenerator()}d`,
        responsive = true,
        bordered = true,
        size,
        columns,
        data,
        filterArray,
        isFilterable,
        rows = [5, 10, 15, 20],
        currentPage,
        totalRecord,
        rowPerPage,
        defaultSortBy = '',
        defaultOrderBy = 'asc',
        handlePagination,
        handleRowPerPage,
        handleSort,
        isSeverSidePagination = false,
        tableHeight = 250
    } = props;


    const tables = document.getElementsByClassName( mainClass );
    const resizableGrid = ( table ) => {
        // console.log( table );
        const tableHeight = table.offsetHeight;
        table.style.overflow = 'hidden';
        const row = table.getElementsByTagName( 'tr' )[0],
            cols = row ? row.children : undefined;
        if ( !cols ) return;

        const paddingDiff = ( col ) => {
            function getStyleVal( elm, css ) {
                return ( window.getComputedStyle( elm, null ).getPropertyValue( css ) );
            }

            if ( getStyleVal( col, 'box-sizing' ) === 'border-box' ) {
                return 0;
            }

            const padLeft = getStyleVal( col, 'padding-left' );
            const padRight = getStyleVal( col, 'padding-right' );
            return ( parseInt( padLeft ) + parseInt( padRight ) );

        };
        const setListeners = ( div ) => {
            let pageX, curCol, nxtCol, curColWidth, nxtColWidth, tableWidth;

            div.addEventListener( 'mousedown', function ( e ) {
                tableWidth = document.getElementById( tableId ).offsetWidth;
                curCol = e.target.parentElement;
                nxtCol = curCol.nextElementSibling;
                pageX = e.pageX;
                const padding = paddingDiff( curCol );
                curColWidth = curCol.offsetWidth - padding; /// for whole table
                // if ( nxtCol ) nxtColWidth = nxtCol.offsetWidth - padding;
            } );

            div.addEventListener( 'mouseover', function ( e ) {
                e.target.style.borderRight = '3px solid #FBBC06';
            } );

            div.addEventListener( 'mouseout', function ( e ) {
                e.target.style.borderRight = '';
            } );

            document.addEventListener( 'mousemove', function ( e ) {
                if ( curCol ) {
                    const diffX = e.pageX - pageX;
                    // if (nxtCol)
                    //nxtCol.style.width = (nxtColWidth - (diffX)) + 'px';
                    curCol.style.width = `${curColWidth + diffX}px`;
                    // console.log( curCol.style.width );
                    // console.log( tableWidth );
                    document.getElementById( tableId ).style.width = `${tableWidth + diffX}px`;
                }
            } );

            document.addEventListener( 'mouseup', function ( e ) {
                curCol = undefined;
                nxtCol = undefined;
                pageX = undefined;
                nxtColWidth = undefined;
                curColWidth = undefined;
            } );
        };

        const createDiv = ( height ) => {
            // console.log( height );
            const div = document.createElement( 'div' );
            div.style.top = 0;
            div.style.right = 0;
            div.style.width = '5px';
            div.style.boxSizing = "border-box";
            div.style.position = 'absolute';
            div.style.cursor = 'col-resize';
            div.style.userSelect = 'none';
            div.style.height = `${height}px`;
            return div;
        };
        for ( let i = 0; i < cols.length; i++ ) {
            const div = createDiv( tableHeight );
            cols[i].appendChild( div );
            cols[i].style.position = 'relative';
            setListeners( div );
        }
    };
    useEffect( () => {
        for ( let i = 0; i < tables.length; i++ ) {
            resizableGrid( tables[i] );
        }
    }, [tableId] );

    //LocalState
    const [localCurrentPage, setLocalCurrentPage] = useState( 1 );
    const [localRowPerPage, setLocalRowPerPage] = useState( 10 );
    ///PageHandle
    const handleLocalPageHandle = ( page ) => {
        setLocalCurrentPage( page.selected + 1 );
        isSeverSidePagination && handlePagination( page );
    };

    const handleLocalRowPerPage = ( perPageRow ) => {
        const rowNo = Number( perPageRow );
        setLocalRowPerPage( rowNo );
        isSeverSidePagination && handleRowPerPage( rowNo );
        handleLocalPageHandle( {
            selected: 0
        } );
    };

    const initialSorting = _.orderBy( data.map( d => (
        {
            ...d,
            rowId: randomIdGenerator(),
            expanded: false
        } ) ),
        [defaultOrderBy], [defaultSortBy] );

    const [localData, setLocalData] = useState( initialSorting );
    const [orderLocalBy, setOrderLocalBy] = useState( defaultOrderBy );
    const [sortLocalBy, setSortLocalBy] = useState( defaultSortBy );

    const handleLocalSort = ( column ) => {

        if ( isSeverSidePagination ) {
            handleSort( column.selector );
        } else {
            setOrderLocalBy( orderLocalBy === 'asc' ? 'desc' : 'asc' );
            if ( column?.sort || column?.sort === undefined ) {
                setSortLocalBy( column.selector );
                const whichBy = sortLocalBy === column.selector ? orderLocalBy === 'asc' ? 'desc' : 'asc' : 'asc';
                const sortData = _.orderBy( localData, [column.selector], [whichBy] );
                setLocalData( sortData );
            }
        }

    };

    ///
    const dtRowPerPage = isSeverSidePagination ? rowPerPage : localRowPerPage;
    const dtCurrentPage = isSeverSidePagination ? currentPage : localCurrentPage;

    const count = Number( Math.ceil( totalRecord / dtRowPerPage ) );

    const indexOfLastData = dtCurrentPage * dtRowPerPage;
    const indexOfFirstData = indexOfLastData - dtRowPerPage;

    const dataSlice = localData.slice( indexOfFirstData, indexOfLastData );

    // console.log( tableHeight * ( dtRowPerPage / 10 ) );

    const handleRowExpanding = ( row ) => {
        const updatedData = localData.map( d => {
            if ( d.id === row.id ) {
                d['expanded'] = !d.expanded;
            }
            return d;
        } );
        setLocalData( updatedData );
    };

    return (
        <>
            <div className='dt' >
                <div style={{ minHeight: `${tableHeight}px` }}>
                    <Table
                        id={tableId}
                        hover
                        responsive={responsive}
                        bordered={bordered}
                        size={size}
                        className={classnames( `${mainClass}`, `${className}` )}
                    >
                        <thead>
                            <tr>
                                <th>
                                    E
                                </th>
                                {columns.map( ( column, index ) => (
                                    <Fragment key={index}>

                                        <th
                                            style={{
                                                width: column.width ?? '',
                                                textAlign: column.type === 'action' ? 'center' : column.type === 'number' ? 'center' : 'left'
                                            }}
                                            key={index + 1}
                                        >
                                            <div className='th-data mx-1' onClick={() => { handleLocalSort( column ); }} >
                                                <span> {column.name}</span>
                                                <span hidden={column.type === 'action' || column.type === 'action'} className='icon' >
                                                    <div>
                                                        <span hidden={orderLocalBy === 'asc'}>
                                                            <svg

                                                                style={{ transform: "rotate(180deg)" }}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="20"
                                                                height="20"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            >
                                                                <polyline points="6 9 12 15 18 9"></polyline>
                                                            </svg>
                                                        </span>
                                                        <span hidden={orderLocalBy === 'desc'}>
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="20"
                                                                height="20"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round">
                                                                <polyline points="6 9 12 15 18 9"></polyline>
                                                            </svg>
                                                        </span>

                                                    </div>
                                                </span>
                                            </div>
                                        </th>
                                    </Fragment>

                                ) )}

                            </tr>
                        </thead>
                        <tbody>
                            <tr hidden={!isFilterable}>
                                <td></td>
                                {/* {
                                    filterArray.map( ( filter, index ) => (
                                        columns.map( ( c, indx ) => (
                                            <Fragment key={indx + 1}>
                                                <td>{filter[c.selector]}</td>
                                            </Fragment>
                                        ) )
                                    ) )
                                } */}
                                {
                                    filterArray.map( ( filter, index ) => (
                                        columns.map( ( c, indx ) => (
                                            <Fragment key={indx + 1}>
                                                <td>{filter[c.selector]}</td>
                                            </Fragment>
                                        ) )
                                    ) )
                                }
                            </tr>

                            {/* <tr key={index + 1}>
                                {expandableRow && <td> </td>}
                                {columns.map( ( c, indx ) => (
                                    <Fragment key={indx + 1}>
                                        <td>{filter[c.selector]}</td>
                                    </Fragment>
                                ) )}
                            </tr> */}
                            {dataSlice.map( ( dt, index ) => (
                                <Fragment key={index}>
                                    <tr key={index + 2}>
                                        <td>
                                            <Plus onClick={() => { handleRowExpanding( dt ); }} size={14} />
                                        </td>
                                        {
                                            columns.map( ( c, indx ) => (
                                                <Fragment key={indx + 1}>

                                                    <td
                                                        key={indx + 1}
                                                        id={`${c.id}${dt.id.toString()}d`}
                                                        style={{
                                                            width: c.width ?? '',
                                                            textAlign: c.type === 'action' ? 'center' : c.type === 'number' ? 'right' : 'left'
                                                        }}
                                                    >
                                                        {c?.cell ? c.cell( dt, index ) : dt[c.selector]}


                                                        {/* {
                                                c.selector === 'itemName' && (
                                                    <CustomToolTip
                                                        id={`${c.id}${column.rowId.toString()}d`}
                                                        position="right"
                                                        value={c.valueType ? `${column[c.selector]?.label}` : `${column[c.selector]}`}
                                                    />
                                                )
                                            } */}

                                                    </td>
                                                </Fragment>
                                            ) )
                                        }
                                    </tr>
                                    <tr
                                        key={index + 11}
                                        hidden={!dt.expanded}>
                                        <td
                                            colSpan={columns.length + 1}
                                        >
                                            s
                                        </td>
                                    </tr>
                                </Fragment>
                            ) )}
                        </tbody>
                    </Table>
                </div>
                <div className='pagination-container'>
                    <div className="pagination">
                        <ReactPaginate
                            previousLabel={'Pre'}
                            nextLabel={'Next'}
                            pageCount={count || 1}
                            activeClassName="active"
                            forcePage={dtCurrentPage !== 0 ? dtCurrentPage - 1 : 0}
                            onPageChange={( page ) => handleLocalPageHandle( page )}
                            pageClassName={'page-item'}
                            nextLinkClassName={'page-link'}
                            nextClassName={'page-item next'}
                            previousClassName={'page-item prev'}
                            previousLinkClassName={'page-link'}
                            pageLinkClassName={'page-link'}
                            containerClassName={
                                'pagination react-paginate justify-content-end my-2 pr-1'
                            }
                        />
                        <div className="row-per-page">
                            <label htmlFor="rowPerPageId">Row Per page:</label>
                            <select
                                value={dtRowPerPage}
                                onChange={( e ) => {
                                    handleLocalRowPerPage( e.target.value );
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
                    </div>
                </div>
            </div>


        </>
    );
};

export default CustomTable;
// ** PropTypes
CustomTable.propTypes = {
    className: PropTypes.string,
    responsive: PropTypes.bool,
    bordered: PropTypes.bool,
    size: PropTypes.string,
    tableId: PropTypes.string.isRequired,
    mainClass: PropTypes.string.isRequired
};
