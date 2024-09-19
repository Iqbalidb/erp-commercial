import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import CustomPreLoader from "utility/custom/CustomPreLoader";
import CustomPagination from "utility/custom/customController/CustomPagination";
import { getAllExportPI, getAllUsedExportPI } from "../store/actions";
import ExportPiColumns from "./ExportPiColumns";

const ExportPIAllList = () => {
    const dispatch = useDispatch();
    const { allExportPI, piTotal } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );
    const { isDataLoadedCM } = useSelector( ( { commonReducers } ) => commonReducers );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [currentPage, setCurrentPage] = useState( 1 );
    // const [isFromBom, setIsFromBom] = useState( true );
    console.log( { allExportPI } );
    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage
        // isFromBom: true
    };
    useEffect( () => {
        dispatch( getAllUsedExportPI() );
        dispatch( getAllExportPI( paramsObj ) );
    }, [dispatch] );
    const handlePagination = page => {
        console.log( { page } );
        dispatch(
            getAllExportPI( {
                page: page.selected + 1,
                perPage: rowsPerPage
                // isFromBom: true
            }, [] )
        );
        setCurrentPage( page.selected + 1 );
    };
    return (
        <div className="p-2 border border-primary" >
            <DataTable
                noHeader
                persistTableHead
                defaultSortAsc
                sortServer
                dense
                progressPending={!isDataLoadedCM}
                progressComponent={
                    <CustomPreLoader />
                }
                subHeader={false}
                highlightOnHover
                responsive={true}
                paginationServer
                // expandableRows={true}
                // expandOnRowClicked={true}
                columns={ExportPiColumns()}
                // onRowExpandToggled={( expanded, row ) => dispatch( bindAllSupplierPI( row.id, expanded ) )}
                className="react-custom-dataTable"
                // expandableRowsComponent={<ExpandablePIFile data={data => data} />}
                data={allExportPI}
            />

            <CustomPagination
                onPageChange={handlePagination}
                currentPage={currentPage}
                count={Number( Math.ceil( piTotal / rowsPerPage ) )}
            />
        </div>
    );
};

export default ExportPIAllList;