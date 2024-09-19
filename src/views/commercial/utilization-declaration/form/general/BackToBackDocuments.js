import { useState } from "react";
import DataTable from "react-data-table-component";
import { PlusSquare } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Col, Label, Row } from "reactstrap";
import { confirmDialog } from "utility/custom/ConfirmDialog";
import CheckBoxInput from "utility/custom/ErpCheckBox";
import IconButton from "utility/custom/IconButton";
import { notify } from "utility/custom/notifications";
import { confirmObj } from "utility/enums";
import { isZeroToFixedNumber } from "utility/Utils";
import { bindBackToBackDocuments, bindUdInfo, getBackToBackDocuments } from "../../store/actions";
import BackToBackModal from "../modal/BackToBackModal";
import BackToBackColumns from "./BackToBackColumns";

const BackToBackDocuments = ( props ) => {
    const { submitErrors, isFromAmendment = false, isDetailsForm = false, isFromEditAmendment = false, isAmendmentDetailsForm = false } = props;
    const dispatch = useDispatch();
    const { backToBackDocBind, masterDocuments, udInfo } = useSelector( ( { udReducer } ) => udReducer );
    const [backToBackModal, setBackToBackModal] = useState( false );
    // const handleOnChange = ( e, row ) => {
    //     const { name, value } = e.target;
    //     const convertedNumber = Number( value );

    //     const updatedData = backToBackDocBind.map( md => {
    //         if ( md.id === row.id ) {
    //             if ( md.documentAmount < value ) {
    //                 notify( 'warning', 'Used Value cannot greater than actual Value!! ' );
    //             } else {
    //                 md[name] = convertedNumber;
    //             }
    //         }
    //         return md;
    //     } );
    //     dispatch( bindBackToBackDocuments( updatedData ) );
    // };
    console.log( { masterDocuments } );
    const handleOnChange = ( e, row ) => {
        const { name, value } = e.target;
        const convertedNumber = Number( value );

        const updatedData = backToBackDocBind.map( md => {
            if ( md.bbDocumentId === row.bbDocumentId ) {
                if ( name === 'documentUsedValue' && md.documentValue < value ) {
                    notify( 'warning', 'Used Value cannot greater than actual Value!! ' );
                } else if ( name === 'documentIncrease' ) {
                    const increaseValue = Number( value );
                    const usedValue = md.documentUsedValue;
                    const updatedValue = isZeroToFixedNumber( increaseValue + usedValue, 4 );

                    if ( updatedValue > md.documentValue ) {
                        notify( 'warning', 'Cannot increase value, because total value cannot crossed the main value ' );
                    } else {
                        md[name] = convertedNumber;
                        md['documentTotalValue'] = md.documentUsedValue + convertedNumber - md.documentDecrease;
                    }
                } else if ( name === 'documentDecrease' ) {
                    md[name] = convertedNumber;
                    md['documentTotalValue'] = md.documentUsedValue - convertedNumber + md.documentIncrease;
                } else {
                    md[name] = convertedNumber;
                }
            }
            return md;
        } );
        console.log( updatedData );
        dispatch( bindBackToBackDocuments( updatedData ) );

    };

    const handleOpenBBModal = () => {
        setBackToBackModal( true );
        const masterDocIds = masterDocuments?.map( fi => ( fi.masterDocumentId ? fi.masterDocumentId : fi.id ) );
        dispatch( getBackToBackDocuments( masterDocIds ) );
    };
    const handleDelete = ( id ) => {
        confirmDialog( confirmObj )
            .then( e => {
                if ( e.isConfirmed ) {
                    const dData = backToBackDocBind.filter( d => d.bbDocumentId !== id );
                    dispatch( bindBackToBackDocuments( dData ) );
                }
            }
            );
    };
    console.log( { backToBackDocBind } );
    const handleCheckBox = ( e ) => {
        const { checked, name } = e.target;

        const updatedData = {
            ...udInfo,
            [name]: checked
        };
        dispatch( bindUdInfo( updatedData ) );
        //  setFormData( { ...formData, [name]: checked } );

    };
    return (
        <>

            <Row>
                <Col xs={12} sm={12} md={6} lg={6}>
                    <IconButton
                        id="addModal"
                        hidden={isDetailsForm || isAmendmentDetailsForm}
                        onClick={() => handleOpenBBModal()}
                        icon={<PlusSquare size={20} color='green' />}
                        label='Add Back To Back'
                        placement='bottom'
                        isBlock={true}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6}>
                    <div
                        className='d-flex text-right justify-content-end pr-2'
                    >
                        <CheckBoxInput
                            label='Is Missing Value Allowed'
                            classNames='mt-1'
                            name='isMissingValueAllowed'
                            onChange={handleCheckBox}
                            value={udInfo.isMissingValueAllowed}
                            disabled={isDetailsForm || isAmendmentDetailsForm}
                            checked={udInfo.isMissingValueAllowed}
                        />
                    </div>
                </Col>

            </Row>
            <div className="p-0">
                <Label className="font-weight-bolder h5 text-secondary" >Back To Back Documents:</Label>
                <DataTable
                    noHeader
                    persistTableHead
                    defaultSortAsc
                    sortServer
                    dense
                    subHeader={false}
                    highlightOnHover
                    responsive={true}
                    paginationServer
                    expandableRows={false}
                    expandOnRowClicked
                    columns={BackToBackColumns( handleDelete, isFromAmendment, handleOnChange, isDetailsForm, isFromEditAmendment, isAmendmentDetailsForm )}
                    // sortIcon={<ChevronDown />}
                    className="react-custom-dataTable"
                    // expandableRowsComponent={<ExpandableBank data={data => data} />}
                    data={backToBackDocBind}
                />
            </div>
            {/* <div className="p-1">
                <Label className="font-weight-bolder h5 text-secondary" >Free of Costs:</Label>
                <DataTable
                    noHeader
                    persistTableHead
                    defaultSortAsc
                    sortServer
                    dense

                    subHeader={false}
                    highlightOnHover
                    responsive={true}
                    paginationServer
                    expandableRows={false}
                    expandOnRowClicked
                    columns={BackToBackColumns( handleOnChange )}
                    // sortIcon={<ChevronDown />}
                    className="react-custom-dataTable"
                // expandableRowsComponent={<ExpandableBank data={data => data} />}
                // data={backToBackDocBind}
                />
            </div> */}

            {
                backToBackModal && (
                    <BackToBackModal
                        openModal={backToBackModal}
                        setOpenModal={setBackToBackModal}
                    />
                )
            }

        </>
    );
};

export default BackToBackDocuments;