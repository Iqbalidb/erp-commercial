import '@custom-styles/commercial/master-document-form.scss';
import classNames from "classnames";
import { useState } from "react";
import { Search } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from "reactstrap";
import { getBanksDropdown, getBuyerDropdownCm } from "redux/actions/common";
import ErpDateInput from "utility/custom/ErpDateInput";
import { ErpDetailInputTooltip } from "utility/custom/ErpDetailInputTooltip";
import { ErpInput } from "utility/custom/ErpInput";
import ErpSelect from "utility/custom/ErpSelect";
import FormContentLayout from "utility/custom/FormContentLayout";
import IconButton from "utility/custom/IconButton";
import { notify } from "utility/custom/notifications";
import { getMasterDocumentByQuery } from "views/commercial/masterDocument/store/actions";
import { bindBackToBackDocuments, bindMasterDocumentsFromModal, bindUdInfo, getMasterDocumentsFromGroup, getNotifyParties } from "../../store/actions";
import AddressModal from "../modal/AddressModal";
import BankModal from "../modal/BankModal";
import MasterDocumentModalUD from "../modal/MasterDocumentModalUD";

const UdGeneralForm = ( props ) => {


    const { submitErrors, isFromAmendment = false, isDetailsForm = false, isAmendmentDetailsForm = false, isFromEdit = false, isFromEditAmendment = false } = props;
    const errors = submitErrors;
    const dispatch = useDispatch();
    const { udInfo } = useSelector( ( { udReducer } ) => udReducer );
    const { defaultTenant, defaultTenantId } = useSelector( ( { auth } ) => auth );
    const { buyerDropdownCm, isBuyerDropdownCm } = useSelector( ( { commonReducers } ) => commonReducers );
    const [openAddressModal, setOpenAddressModal] = useState( false );
    const [masterDocumentModal, setMasterDocumentModal] = useState( false );
    const [lienBankModal, setLienBankModal] = useState( false );
    const [whichForTheModal, setWhichForTheModal] = useState( '' );
    const [perPage, setPerPage] = useState( 5 );
    const [filterMasterDocGroup, setFilterMasterDocGroup] = useState( {
        masterDocGroup: null,
        documentType: null
    } );
    const params = {
        perPage
    };

    console.log( { udInfo } );
    function removeDuplicates( arr ) {
        const uniqueObjects = Array.from( new Set( arr.map( JSON.stringify ) ) ).map( JSON.parse );
        return uniqueObjects;
    }
    // Example usage:
    const groupType = udInfo.masterDoc.map( b => ( {
        label: b.groupType,
        value: b.groupType
    } ) );
    const comRef = udInfo.masterDoc.map( b => ( {
        label: b.label,
        value: b.value
    } ) );
    const typeArray = removeDuplicates( groupType );
    const comRefArray = removeDuplicates( comRef );
    const groupTypeName = typeArray[0];
    const comRefer = comRefArray[0];
    const getTenantName = ( id ) => {
        const { tenants } = defaultTenant;

        const selectedTenant = tenants?.find( t => t.id.toLowerCase() === id.toLowerCase() );
        return selectedTenant?.name ?? '';
    };

    const handleInputChange = ( e ) => {
        const { name, value, type } = e.target;
        const updatedInfo = {
            ...udInfo,
            [name]: type === 'number' ? Number( value ) : value
        };
        dispatch( bindUdInfo( updatedInfo ) );
    };


    const handleOpenAddressModal = () => {
        setOpenAddressModal( true );
    };
    const handleMasterDocModal = () => {
        if ( !udInfo?.buyer ) {
            notify( 'warning', 'Please Select a Buyer First!!' );
        } else if ( !udInfo?.lienBank ) {
            notify( 'warning', 'Please Select a Lien Bank First!!' );

        } else {
            setMasterDocumentModal( true );

            setFilterMasterDocGroup( {
                ...filterMasterDocGroup,
                masterDocGroup: groupTypeName?.label ? comRefer : null,
                documentType: groupTypeName?.label ? groupTypeName : null
            } );
            {
                if ( groupTypeName?.label ) {
                    dispatch( getMasterDocumentsFromGroup( comRefer?.value ) );
                }
            }


            const defaultFilteredArrayValue = [
                {
                    column: "buyerId",
                    value: udInfo?.buyer?.value ?? ''
                },
                {
                    column: "lienBranchId",
                    value: udInfo?.lienBank?.value ?? ''
                }
            ];
            const filteredData = defaultFilteredArrayValue.filter( filter => filter.value.length );
            dispatch( getMasterDocumentByQuery( params, filteredData ) );

        }


    };
    const handleDropDownChange = ( data, e ) => {
        const { name } = e;
        const updatedInfo = {
            ...udInfo,
            [name]: data,
            // ['lienBank']: null,
            ['masterDoc']: []

        };
        dispatch( bindUdInfo( updatedInfo ) );
        dispatch( bindMasterDocumentsFromModal( [] ) );
        dispatch( getNotifyParties( null ) );
        dispatch( getMasterDocumentsFromGroup( null ) );

    };
    const handleDateInput = ( data, name ) => {
        const updatedInfo = {
            ...udInfo,
            [name]: data
        };
        dispatch( bindUdInfo( updatedInfo ) );
    };
    const handleBankModalOpen = ( bankFor ) => {
        setLienBankModal( true );
        dispatch( getBanksDropdown() );
        setWhichForTheModal( bankFor );
    };
    const handleRowDoubleClick = ( row ) => {
        const value = row.id;
        const label = `${row.label}, ${row.bankName}`;
        const bankName = row.bankName;
        const address = row.address;
        const phone = row.contactNumber;
        const fax = row.faxNumber;

        const updatedInfo = {
            ...udInfo,
            [whichForTheModal]: {
                value,
                label,
                bankName,
                address,
                phone,
                fax
            },
            ['masterDoc']: []
        };
        dispatch( bindUdInfo( updatedInfo ) );
        dispatch( getMasterDocumentsFromGroup( null ) );
        dispatch( bindMasterDocumentsFromModal( [] ) );
        dispatch( bindBackToBackDocuments( [] ) );
    };
    const handleBuyerOnFocus = () => {
        dispatch( getBuyerDropdownCm() );
    };

    return (
        <>
            {
                isFromAmendment || isFromEditAmendment || isAmendmentDetailsForm ? <FormContentLayout title={'BGMEA Information'}>
                    {

                        ( isFromAmendment || isFromEditAmendment || isAmendmentDetailsForm ) ? (

                            <>

                                <Col xs={12} lg={3} className='mb-1'>
                                    <ErpDateInput
                                        label='Amendment Date'
                                        name='amendmentDate'
                                        id='amendmentDate'
                                        classNames='mt-1'
                                        placeholder='Amendment Date'
                                        value={udInfo.amendmentDate}
                                        onChange={handleDateInput}
                                        disabled={isAmendmentDetailsForm}
                                        invalid={!!( ( errors?.amendmentDate && !udInfo.amendmentDate?.length ) )}
                                    />
                                </Col>
                                <Col xs={12} lg={3} className='mb-1'>
                                    <ErpInput
                                        name='amendmentRefNumber'
                                        id='amendmentRefNumberId'
                                        onChange={handleInputChange}
                                        value={udInfo.amendmentRefNumber}
                                        label='Amendment Ref Number'
                                        classNames='mt-1'
                                        invalid={( errors && errors?.amendmentRefNumber && !udInfo?.amendmentRefNumber.trim().length ) && true}
                                        disabled={isAmendmentDetailsForm}
                                    />
                                </Col>
                                <Col xs={12} lg={3} className='mb-1'>
                                    <ErpInput
                                        name='amendmentDocumentNumber'
                                        id='amendmentDocumentNumberId'
                                        onChange={handleInputChange}
                                        value={udInfo.amendmentDocumentNumber}
                                        label='Amendment Document Number'
                                        classNames='mt-1'
                                        invalid={( errors && errors?.amendmentDocumentNumber && !udInfo?.amendmentDocumentNumber.trim().length ) && true}
                                        disabled={isAmendmentDetailsForm}
                                    />
                                </Col>
                                <Col xs={12} lg={3} className='mb-1'>
                                    <ErpInput
                                        name='amendmentTrackingNumber'
                                        id='amendmentTrackingNumberId'
                                        onChange={handleInputChange}
                                        value={udInfo.amendmentTrackingNumber}
                                        label='Amendment Tracking Number'
                                        classNames='mt-1'
                                        invalid={( errors && errors?.amendmentTrackingNumber && !udInfo?.amendmentTrackingNumber.trim().length ) && true}
                                        disabled={isAmendmentDetailsForm}
                                    />
                                </Col>
                            </>


                        ) : null
                    }
                </FormContentLayout> : ''
            }
            <FormContentLayout title={'BGMEA Information'} >
                <Col md='12'>
                    <Row className=''>
                        <Col lg='12' md='12' xl='12'>

                            <div className="d-grid ">
                                <label htmlFor="" className='font-weight-bolder' style={{ marginRight: '112px' }}>Name</label>
                                <span style={{ marginRight: '8px' }}>:</span>
                                <span >{udInfo?.bgmeaName}</span>
                            </div>
                            {/* <BgmeaInfo label='Name' details={udInfo?.bgmeaName} />
                            <BgmeaInfo label='Address' details={udInfo?.bgmeaAddress} /> */}
                            <div className="d-grid ">
                                <label htmlFor="" className='font-weight-bolder' style={{ marginRight: '100px' }}>Address</label>
                                <span style={{ marginRight: '8px' }}>:</span>
                                <span >{udInfo?.bgmeaAddress}</span>
                            </div>
                            {/* <div >
                                <label htmlFor="" className='font-weight-bolder'>Address</label>
                                <div>
                                    <span>:</span>
                                    <span >{udInfo?.bgmeaAddress}</span>                                </div>
                            </div> */}
                            {/* <ErpInput
                                id='addressId'
                                label='Address'
                                name='bgmeaAddress'
                                // type="component"
                                classNames='mt-1'
                                type='textarea'
                                disabled
                                value={udInfo?.bgmeaAddress?.label ?? ''}

                                secondaryOption={

                                    <div
                                        onClick={() => { }}
                                        style={{
                                            marginLeft: '6px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <IconButton
                                            id='address'
                                            color={'primary'}
                                            outline={true}
                                            isBlock={true}
                                            icon={<Search size={12} />}
                                            onClick={() => handleOpenAddressModal()}
                                            label='Address'
                                            placement='top'
                                        />
                                    </div>
                                }
                            /> */}
                        </Col>


                    </Row>

                </Col>
            </FormContentLayout>
            <Row>
                <Col md='12'>
                    <FormContentLayout title={'UD Information'} marginTop>
                        <Col>
                            <Row>
                                <Col lg='6' md='6' xl='3'>
                                    <ErpInput
                                        name='applicationNo'
                                        id='applicationNoId'
                                        onChange={handleInputChange}
                                        value={udInfo.applicationNo}
                                        label='Application No'
                                        classNames='mt-1'
                                        disabled={isDetailsForm || isAmendmentDetailsForm}
                                        invalid={( errors && errors?.applicationNo && !udInfo?.applicationNo.trim().length ) && true}

                                    />
                                </Col>
                                <Col lg='6' md='6' xl='3'>
                                    <ErpDateInput
                                        name='applicationDate'
                                        id='applicationDateId'
                                        value={udInfo.applicationDate}
                                        onChange={handleDateInput}
                                        label='Application Date'
                                        disabled={isDetailsForm || isAmendmentDetailsForm}
                                        placeholder='Application Date'
                                        classNames='mt-1'
                                        invalid={( errors && errors?.applicationDate && !udInfo.applicationDate?.length ) && true}

                                    />
                                </Col>
                                <Col lg='6' md='6' xl='3'>

                                    <ErpInput
                                        name='udNo'
                                        id='udNoId'
                                        onChange={handleInputChange}
                                        value={udInfo.udNo}
                                        label='UD No'
                                        disabled={isDetailsForm || isAmendmentDetailsForm}
                                        classNames='mt-1'
                                        invalid={( errors && errors?.udNo && !udInfo?.udNo.trim().length ) && true}

                                    />
                                </Col>
                                <Col lg='6' md='6' xl='3'>
                                    <ErpDateInput
                                        name='udDate'
                                        id='udDateId'
                                        value={udInfo.udDate}
                                        onChange={handleDateInput}
                                        label='UD Date'
                                        placeholder='UD Date'
                                        classNames='mt-1'
                                        disabled={isDetailsForm || isAmendmentDetailsForm}
                                    />

                                </Col>

                            </Row>
                            <Row>
                                <Col lg='6' md='6' xl='3'>

                                    <ErpInput
                                        name='trackingNo'
                                        id='trackingNoId'
                                        onChange={handleInputChange}
                                        value={udInfo.trackingNo}
                                        label='Tracking No'
                                        classNames='mt-1'
                                        disabled={isDetailsForm || isAmendmentDetailsForm}
                                        invalid={( errors && errors?.trackingNo && !udInfo?.trackingNo.trim().length ) && true}

                                    />
                                </Col>
                                <Col lg='6' md='6' xl='3'>
                                    <ErpInput
                                        label='Factory Unit'
                                        name='beneficiary'
                                        classNames='mt-1'
                                        id='beneficiaryId'
                                        value={udInfo?.beneficiary ? udInfo?.beneficiary?.label : getTenantName( defaultTenantId )}
                                        onChange={handleInputChange}
                                        disabled
                                    />
                                </Col>
                                {/* <Col lg='6' md='6' xl='3'>
                                    <ErpInput
                                        type='number'
                                        name='udVersion'
                                        id='udVersionId'
                                        onChange={handleInputChange}
                                        value={udInfo.udVersion}
                                        label='UD Version'
                                        classNames='mt-1'
                                        onFocus={e => {
                                            e.target.select();
                                        }}
                                        disabled

                                    />
                                </Col> */}

                                <Col lg='6' md='6' xl='3'>
                                    <ErpInput
                                        name='bondLicense'
                                        id='bondLicenseId'
                                        onChange={handleInputChange}
                                        value={udInfo.bondLicense}
                                        label='Bond License'
                                        classNames='mt-1'
                                        disabled={isDetailsForm || isAmendmentDetailsForm}
                                    />
                                </Col>
                                <Col lg='6' md='6' xl='3'>
                                    <ErpDateInput
                                        name='licenseDate'
                                        id='licenseDateId'
                                        value={udInfo.licenseDate}
                                        onChange={handleDateInput}
                                        label='License Date'
                                        placeholder='License Date'
                                        classNames='mt-1'
                                        disabled={isDetailsForm || isAmendmentDetailsForm}
                                    />
                                </Col>
                            </Row>
                            <Row>

                                <Col lg='6' md='6' xl='3'>
                                    <ErpInput
                                        name='vatRegistration'
                                        id='vatRegistrationId'
                                        onChange={handleInputChange}
                                        value={udInfo.vatRegistration}
                                        label='Vat Registration'
                                        classNames='mt-1'
                                    />
                                </Col>
                                <Col lg='6' md='6' xl='3'>
                                    <ErpDateInput
                                        name='regDate'
                                        id='regDateId'
                                        value={udInfo.regDate}
                                        onChange={handleDateInput}
                                        label='Registration Date'
                                        placeholder='Registration Date'
                                        disabled={isDetailsForm || isAmendmentDetailsForm}
                                        classNames='mt-1'
                                    />
                                </Col>
                                <Col lg='6' md='6' xl='3'>
                                    <ErpInput
                                        name='membershipNo'
                                        id='membershipNoId'
                                        onChange={handleInputChange}
                                        value={udInfo.membershipNo}
                                        label='Membership No'
                                        classNames='mt-1'
                                        disabled={isDetailsForm || isAmendmentDetailsForm}
                                    />
                                </Col>
                                <Col lg='6' md='6' xl='3'>
                                    <ErpInput
                                        type='number'
                                        name='membershipYear'
                                        id='membershipYear'
                                        onChange={handleInputChange}
                                        value={udInfo.membershipYear}
                                        label='Membership Year'
                                        classNames='mt-1'
                                        onFocus={e => {
                                            e.target.select();
                                        }}
                                        disabled={isDetailsForm || isAmendmentDetailsForm}
                                    />
                                </Col>
                            </Row>
                            <Row>

                                <Col lg='6' md='6' xl='3'>
                                    <ErpSelect
                                        menuPlacement='auto'
                                        label='Buyer'
                                        name="buyer"
                                        placeholder='Buyer'
                                        isDisabled={isFromAmendment || isFromEdit || isDetailsForm || isAmendmentDetailsForm}
                                        classNames='mt-1'
                                        isLoading={!isBuyerDropdownCm}
                                        options={buyerDropdownCm}
                                        value={udInfo?.buyer}
                                        onFocus={() => { handleBuyerOnFocus(); }}
                                        onChange={handleDropDownChange}
                                        className={classNames( `erp-dropdown-select ${( ( errors?.buyer && !udInfo.buyer ) ) && 'is-invalid'} ` )}
                                    />
                                </Col>
                                <Col lg='6' md='6' xl='3'>
                                    <ErpDetailInputTooltip
                                        id='lienBankId'
                                        label='Lien Bank'
                                        name='lienBank'
                                        value={udInfo?.lienBank?.label ?? ''}
                                        classNames='mt-1'
                                        invalid={( errors && errors?.lienBank && !udInfo?.lienBank?.label.length ) && true}
                                        secondaryOption={

                                            <div
                                                onClick={() => { }}
                                                style={{
                                                    marginLeft: '6px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <IconButton
                                                    id='lien-bank'
                                                    color={'primary'}
                                                    outline={true}
                                                    hidden={isFromAmendment || isFromEdit || isDetailsForm || isAmendmentDetailsForm}
                                                    isBlock={true}
                                                    icon={<Search size={12} />}
                                                    onClick={() => handleBankModalOpen( 'lienBank' )}
                                                    label='Lien Bank'
                                                    placement='top'
                                                />
                                            </div>
                                        }

                                    />
                                </Col>
                                <Col lg='6' md='6' xl='3'>
                                    <ErpDetailInputTooltip
                                        name='masterDoc'
                                        id='masterDocId'
                                        onChange={handleDropDownChange}
                                        value={udInfo?.masterDoc?.map( pi => pi.label ).toString()}
                                        label='Master Document'
                                        classNames='mt-1 '
                                        invalid={!!( ( errors?.masterDoc && !udInfo.masterDoc?.length ) )}

                                        isDisabled
                                        secondaryOption={

                                            <div
                                                onClick={() => { }}
                                                style={{
                                                    marginLeft: '6px',
                                                    marginTop: '2px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <IconButton
                                                    id='masterDocBtnId'
                                                    color={'primary'}
                                                    outline={true}
                                                    isBlock={true}
                                                    hidden={isDetailsForm || isAmendmentDetailsForm}
                                                    icon={<Search size={12} />}
                                                    onClick={() => handleMasterDocModal()}
                                                    label='Master Documents'
                                                    placement='top'
                                                />
                                            </div>
                                        }
                                    />
                                </Col>
                                {/* <Col lg='6' md='6' xl='3'>
                                    <ErpNumberInput
                                        label='Master Doc Amount'
                                        classNames='mt-1'
                                        name='totalInvoiceValue'
                                        id='totalInvoiceValueId'
                                        type='number'
                                        decimalScale={4}
                                        disabled
                                        onChange={handleInputChange}
                                        value={udInfo?.masterDocAmount}
                                    // invalid={( errors && errors?.freightAmount && masterDocumentInfo?.freightAmount === 0 ) && true}
                                    />
                                </Col> */}
                            </Row>
                        </Col>
                    </FormContentLayout>
                </Col>
            </Row>
            {
                openAddressModal && (
                    <AddressModal
                        openModal={openAddressModal}
                        setOpenModal={setOpenAddressModal}
                    />
                )
            }

            {
                masterDocumentModal && (
                    <MasterDocumentModalUD
                        openModal={masterDocumentModal}
                        setOpenModal={setMasterDocumentModal}
                        filterMasterDocGroup={filterMasterDocGroup}
                        setFilterMasterDocGroup={setFilterMasterDocGroup}

                    />
                )
            }
            {
                lienBankModal && (
                    <BankModal
                        openModal={lienBankModal}
                        setOpenModal={setLienBankModal}
                        whichForTheModal={whichForTheModal}
                        setWhichForTheModal={setWhichForTheModal}
                        handleRow={handleRowDoubleClick}
                    />
                )
            }
        </>
    );
};

export default UdGeneralForm;