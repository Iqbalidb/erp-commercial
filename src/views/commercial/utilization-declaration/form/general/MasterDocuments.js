import '@custom-styles/commercial/master-document-form.scss';
import { useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, RefreshCcw } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Col, Label, Row } from "reactstrap";
import IconButton from "utility/custom/IconButton";
import { notify } from "utility/custom/notifications";
import { isZeroToFixedNumber } from "utility/Utils";
import { bindMasterDocumentsFromModal, bindUdInfo, getNotifyParties } from "../../store/actions";
import MasterDocModalForGroup from "../modal/MasterDocModalForGroup";
import MasterDocumentsColumn from "./MasterDocumentsColumn";
import NotifyPartyColumn from "./NotifyPartyColumn";


const MasterDocuments = ( props ) => {
    const CheckBoxInput = ( props ) => {
        const { marginTop, label, classNames, onChange, name, value, checked, disabled } = props;
        return (
            <div className='general-form-container'>
                <div className={`${classNames} checkbox-input-container `}>
                    <input
                        type='checkbox'
                        name={name}
                        onChange={( e ) => onChange( e )}
                        value={value}
                        checked={checked}
                        disabled={disabled}
                    />
                    <Label check size='sm' className='font-weight-bolder' > {label}</Label>
                </div>
            </div>
        );
    };
    const { submitErrors, isFromAmendment = false, isFromEditAmendment = false
        , isDetailsForm = false, isAmendmentDetailsForm = false, isFromEdit = false } = props;

    const dispatch = useDispatch();
    const { masterDocuments, notifyParties, udInfo, masterDocumentsFromGroup } = useSelector( ( { udReducer } ) => udReducer );
    const [masterDocModal, setMasterDocModal] = useState( false );
    function removeDuplicates( arr ) {
        const uniqueObjects = Array.from( new Set( arr.map( JSON.stringify ) ) ).map( JSON.parse );
        return uniqueObjects;
    }
    const comRef = udInfo.masterDoc.map( b => ( {
        label: b.label,
        value: b.value
    } ) );
    const groupType = udInfo.masterDoc.map( b => ( {
        label: b.groupType,
        value: b.groupType
    } ) );
    const typeArray = removeDuplicates( groupType );
    const comRefArray = removeDuplicates( comRef );

    const groupTypeName = typeArray[0];
    const comRefer = comRefArray[0];

    const handleOnChange = ( e, row ) => {
        const { name, value } = e.target;
        const convertedNumber = Number( value );

        const updatedData = masterDocuments.map( md => {
            if ( md.id === row.id ) {
                if ( name === 'masterDocumentUsedValue' && md.documentAmount < value ) {
                    notify( 'warning', 'Used Value cannot greater than actual Value!! ' );
                } else if ( name === 'masterDocumentDecrease' ) {
                    md[name] = convertedNumber;
                    md['masterDocumentTotalValue'] = md.masterDocumentUsedValue - convertedNumber + md.masterDocumentIncrease;
                } else if ( name === 'masterDocumentIncrease' ) {
                    const increaseValue = Number( value );
                    const usedValue = md.masterDocumentUsedValue;
                    const updatedValue = isZeroToFixedNumber( increaseValue + usedValue, 4 );

                    if ( updatedValue > md.documentAmount ) {
                        notify( 'warning', 'Cannot increase value, because total value cannot crossed the main value ' );
                    } else {
                        md[name] = convertedNumber;
                        md['masterDocumentTotalValue'] = md.masterDocumentUsedValue + convertedNumber - md.masterDocumentDecrease;
                    }

                } else {
                    md[name] = convertedNumber;

                }
            }
            return md;
        } );
        dispatch( bindMasterDocumentsFromModal( updatedData ) );

    };
    const handleRefreshMasterDoc = () => {

        const filterData = masterDocumentsFromGroup.filter( md => md.isExist === false );
        const updatedData = filterData.map( data => ( {
            ...data,
            masterDocumentNumber: data.documentNumber,
            masterDocumentUsedValue: 0,
            masterDocumentIncrease: 0,
            masterDocumentDecrease: 0

        } ) );
        const finalData = [...masterDocuments, ...updatedData];
        const uniqueData = finalData.filter( ( obj, index, self ) =>
            index === self.findIndex( ( t ) => (
                t.id === obj.id
            ) )
        );
        dispatch( bindMasterDocumentsFromModal( uniqueData ) );
        const masterDocIds = uniqueData?.map( fi => ( fi.masterDocumentId ? fi.masterDocumentId : fi.id ) );
        dispatch( getNotifyParties( masterDocIds ) );

    };
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
                    {
                        ( isFromAmendment || isFromEdit || isFromEditAmendment ) ? ( <IconButton
                            id="refreshMd"
                            // hidden={isDetailsForm}
                            onClick={() => handleRefreshMasterDoc()}
                            icon={<RefreshCcw size={20} color='green' />}
                            label='Refresh Master Document'
                            placement='bottom'
                            isBlock={true}
                            hidden={!groupTypeName?.label}
                        /> ) : ''
                    }
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
                <Label className="font-weight-bolder h5 text-secondary" >Master Documents:</Label>
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
                    columns={MasterDocumentsColumn( handleOnChange, isFromAmendment, isDetailsForm, isAmendmentDetailsForm, isFromEditAmendment )}
                    sortIcon={<ChevronDown />}
                    className="react-custom-dataTable"
                    data={masterDocuments}
                />
                <Label className="font-weight-bolder h5 text-secondary" >Notify Parities:</Label>
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
                    columns={NotifyPartyColumn()}
                    sortIcon={<ChevronDown />}
                    className="react-custom-dataTable"
                    data={notifyParties}
                />
            </div>
            <MasterDocModalForGroup
                openModal={masterDocModal}
                setOpenModal={setMasterDocModal}
            />
        </>
    );
};

export default MasterDocuments;