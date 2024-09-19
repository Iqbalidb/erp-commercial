import { Circle, Edit, Eye, MoreVertical, Trash2, Triangle } from "react-feather";
import Select from 'react-select';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { confirmOK } from "utility/custom/ConfirmDialog";
import { payTermOptions } from "utility/enums";
import { formatFlatPickerValue } from "../../../../utility/Utils";
import { AvailableStatus } from "./AvailableStatus";

export const mdListColumn = ( handleEdit, handleDelete, handleDetails, handleAmendmentDetails, handleTransfer ) => {
    const confirmObj = {
        title: 'Fully Converted',
        text: "SC Locked for conversion",
        // html: 'You can use <b>bold text</b>',
        confirmButtonText: 'OK'
        // cancelButtonText: 'OK'
    };

    const handleAmendmentSystem = ( row ) => {
        if ( row.poConverted === row.poTotal && row.documentType === 'SC' ) {
            confirmOK( confirmObj )
                .then( e => {
                    //
                } );
        } else {
            handleAmendmentDetails( row );
        }
    };
    const handleEditSystem = ( row ) => {
        if ( row.poConverted === row.poTotal && row.documentType === 'SC' ) {
            confirmOK( confirmObj )
                .then( e => {
                    //
                } );
        } else {
            handleEdit( row );
        }
    };
    const handleTransferSystem = ( row ) => {
        if ( row.poConverted === row.poTotal && row.documentType === 'SC' ) {
            confirmOK( confirmObj )
                .then( e => {
                    //
                } );
        } else {
            handleTransfer( row );
        }
    };
    const column = [

        {
            name: 'Actions',
            width: '50px',
            center: true,
            isFixed: true,
            unResizable: true,
            cell: row => (
                <UncontrolledDropdown>
                    <DropdownToggle tag='div' className='btn btn-sm'>
                        <MoreVertical size={14} className='cursor-pointer' />
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem
                            // hidden={!row.isActive}
                            className='w-100'
                            onClick={() => { handleEditSystem( row ); }}
                        >
                            <Edit color='green' size={14} className='mr-50' />
                            <span className='align-middle'>Edit</span>
                        </DropdownItem>

                        <DropdownItem
                            hidden={row.isDraft}
                            className='w-100'
                            onClick={() => { handleAmendmentSystem( row ); }}
                        >
                            <Circle color='green' size={14} className='mr-50' />
                            <span className='align-middle'>Amendment</span>
                        </DropdownItem>

                        <DropdownItem
                            hidden={row.isDraft || !row.isTransferable}
                            className='w-100'
                            onClick={() => { handleTransferSystem( row ); }}
                        >
                            <Triangle color='green' size={14} className='mr-50' />
                            <span className='align-middle'>Transfer</span>
                        </DropdownItem>


                        <DropdownItem
                            className='w-100'
                            hidden={!row.isDraft}
                            onClick={() => handleDelete( row )}
                        >
                            <Trash2 color='red' size={14} className='mr-50' />
                            <span className='align-middle'>Delete</span>
                        </DropdownItem>

                        <DropdownItem
                            className='w-100'
                            onClick={() => handleDetails( row )}
                        >
                            <Eye color='blue' size={14} className='mr-50' />
                            <span color='primary' className='align-middle'>View</span>
                        </DropdownItem>

                    </DropdownMenu>
                </UncontrolledDropdown>
            )
        },
        {
            name: 'Status',
            center: true,
            isFixed: true,
            unResizable: true,
            cell: row => {
                return <>
                    <AvailableStatus row={row} />
                </>;
            }
        },

        {
            name: 'Document Type',
            selector: 'documentType',
            cell: row => row.documentType,
            sortable: true,
            width: '130px',
            center: true

        },
        {
            name: 'Commercial. Ref.',
            selector: 'commercialReference',
            cell: row => row.commercialReference,
            width: '120px'

        },
        {
            name: 'Document No',
            selector: 'documentNumber',
            cell: row => row.documentNumber,
            minWidth: '100px'

        },
        {
            name: ' Date',
            selector: 'documentDate',
            cell: row => ( row.documentDate ? formatFlatPickerValue( row.documentDate ) : null )

        },
        {
            name: ' Receive Date',
            minWidth: '100px',
            selector: 'documentReceiveDate',
            cell: row => ( row.documentReceiveDate ? formatFlatPickerValue( row.documentReceiveDate ) : null )

        },
        {
            name: 'Amendment Date',
            minWidth: '120px',
            selector: 'amendmentDate',
            cell: row => ( row.amendmentDate ? formatFlatPickerValue( row.amendmentDate ) : 'N/A' )

        },
        {
            name: 'Converted',
            minWidth: '90px',
            selector: 'converted',
            center: true,
            cell: row => {
                return (
                    <>
                        {row.documentType === 'SC' ? (
                            <p>{`${row.poConverted} of ${row.poTotal}`}</p>
                        ) : "N/A"}
                    </>
                );
            }
        },

        {
            name: 'Converted To',
            selector: 'toLCNumbers',
            sortable: true,
            center: true,
            cell: row => ( row.toLCNumbers ? row.toLCNumbers : '-' )

        },

        {
            name: 'Converted From',
            selector: 'toLCNumbers',
            sortable: true,
            center: true,
            cell: row => ( row.fromSCNumbers ? row.fromSCNumbers : '-' )

        },
        {
            name: 'Buyer',
            selector: 'buyerName',
            sortable: true,
            cell: row => row.buyerName

        },
        // {
        //     name: 'Beneficiary',
        //     selector: 'beneficiary',
        //     sortable: true,
        //     minWidth: '140px',
        //     cell: row => row.beneficiary
        // },
        {
            name: 'Opening Bank',
            selector: 'openingBankBranch',
            cell: row => row.openingBankBranch,
            minWidth: '180px'

        },
        {
            name: 'Lien Bank',
            selector: 'lienBankBranch',
            cell: row => row.lienBankBranch,
            minWidth: '180px'

        },
        {
            name: 'Receiving Bank',
            selector: 'receiveThroughBankBranch',
            cell: row => row.receiveThroughBankBranch,
            minWidth: '180px'

        },
        {
            name: "Ship Date",
            selector: 'shipDate',
            minWidth: '90px',
            cell: row => ( row.shipDate ? formatFlatPickerValue( row.shipDate ) : null )
        },

        {
            name: 'Expiry  Date',
            selector: 'documentExpiryDate',
            minWidth: '90px',
            cell: row => ( row.documentExpiryDate ? formatFlatPickerValue( row.documentExpiryDate ) : null )
        },
        {
            name: 'Port of Loading',
            selector: 'portOfLoading',
            cell: row => JSON.parse( row.portOfLoading ).toString(),
            minWidth: '300px'

        }
    ];
    return column;
};
export const mdDynamicTableCols = ( handleEdit, handleDelete, handleDetails, handleAmendmentDetails, handleTransfer ) => {
    const column = [

        // {
        //     id: 'actionId',
        //     name: 'Action',
        //     center: true,
        //     isFixed: true,
        //     type: 'action',
        //     unResizable: true,
        //     selector: 'action',
        //     cell: row => (
        //         <div style={{ position: 'relative', border: '1px solid ', zIndex: 3 }}>
        //             {/* <UncontrolledDropdown id={`${row.id}`} direction='up' >
        //                     <DropdownToggle tag='div' className='btn btn-sm'>
        //                         <MoreVertical size={14} className='cursor-pointer' />
        //                     </DropdownToggle>
        //                     <DropdownMenu id={`${row.id}`} right style={{ position: 'absolute', zIndex: 100 }}>
        //                         <DropdownItem
        //                             // hidden={!row.isActive}
        //                             className='w-100'
        //                             onClick={() => { handleEdit( row ); }}
        //                         >
        //                             <Edit color='green' size={14} className='mr-50' />
        //                             <span className='align-middle'>Edit</span>
        //                         </DropdownItem>

        //                         <DropdownItem
        //                             hidden={row.isDraft}
        //                             className='w-100'
        //                             onClick={() => { handleAmendmentDetails( row ); }}
        //                         >
        //                             <Circle color='green' size={14} className='mr-50' />
        //                             <span className='align-middle'>Amendment</span>
        //                         </DropdownItem>

        //                         <DropdownItem
        //                             hidden={row.isDraft}
        //                             className='w-100'
        //                             onClick={() => { handleTransfer( row ); }}
        //                         >
        //                             <Triangle color='green' size={14} className='mr-50' />
        //                             <span className='align-middle'>Transfer</span>
        //                         </DropdownItem>
        //                         <DropdownItem
        //                             className='w-100'
        //                             hidden={!row.isDraft}
        //                             onClick={() => handleDelete( row )}
        //                         >
        //                             <Trash2 color='red' size={14} className='mr-50' />
        //                             <span className='align-middle'>Delete</span>
        //                         </DropdownItem>

        //                         <DropdownItem
        //                             className='w-100'
        //                             onClick={() => handleDetails( row )}
        //                         >
        //                             <AlignJustify color='green' size={14} className='mr-50' />
        //                             <span color='primary' className='align-middle'>Details</span>
        //                         </DropdownItem>

        //                     </DropdownMenu>
        //                 </UncontrolledDropdown> */}
        //             <div style={{
        //                 position: 'absolute',
        //                 backgroundColor: 'white',
        //                 height: '300px',
        //                 width: '200px',
        //                 zIndex: 30,
        //                 top: '0'

        //             }}>
        //                 buttons
        //             </div>
        //         </div>
        //     )
        // },
        {
            name: 'Status',
            id: 'statusId',
            type: 'action',
            isFixed: true,
            unResizable: true,
            width: '100px',
            selector: 'status',
            cell: row => {
                return <>
                    <AvailableStatus row={row} />
                </>;
            }
        },

        {
            id: 'documentTypeId',
            name: 'Document Type',
            selector: 'documentType',
            cell: row => row.documentType,
            sortable: true,
            width: '150px',
            center: true

        },
        {
            id: 'commercialRefId',
            name: 'Commercial. Ref.',
            selector: 'commercialReference',
            cell: row => <Select
                value={null}
                options={payTermOptions}
                onChange={() => { }}
                menuPosition="fixed"
            />,
            width: '120px'

        },
        {
            id: 'documentNo',
            name: 'Document No',
            selector: 'documentNumber',
            cell: row => row.documentNumber,
            width: '100px'

        },
        {
            id: 'documentDateId',
            name: ' Date',
            selector: 'documentDate',
            cell: row => formatFlatPickerValue( row.documentDate )

        },
        {
            id: 'receiveDateId',
            name: ' Receive Date',
            width: '90px',
            selector: 'documentReceiveDate',
            cell: row => formatFlatPickerValue( row.documentReceiveDate )

        },
        {
            id: 'amendmentDateId',
            name: 'Amendment Date',
            width: '90px',
            selector: 'amendmentDate',
            cell: row => ( row.amendmentDate ? formatFlatPickerValue( row.amendmentDate ) : 'N/A' )

        },
        {
            id: 'convertedId',
            name: 'Converted',
            width: '90px',
            selector: 'converted',
            center: true,
            cell: row => {
                return (
                    <>
                        {row.documentType === 'SC' ? (
                            <p>{`${row.poConverted} of ${row.poTotal}`}</p>
                        ) : "N/A"}
                    </>
                );
            }
        },

        {
            id: 'buyerId',
            name: 'Buyer',
            selector: 'buyerName',
            sortable: true,
            width: '120px',
            cell: row => row.buyerName

        },
        {
            id: 'beneficiaryId',
            name: 'Beneficiary',
            selector: 'beneficiary',
            sortable: true,
            width: '140px',
            cell: row => row.beneficiary
        },
        {
            id: 'openingBankId',
            name: 'Opening Bank',
            selector: 'openingBankBranch',
            cell: row => row.openingBankBranch,
            width: '140px',
            sortable: true

        },
        {
            id: 'lienBankId',
            name: 'Lien Bank',
            selector: 'lienBankBranch',
            cell: row => row.lienBankBranch,
            width: '140px'

        },
        {
            id: 'receivingBankId',
            name: 'Receiving Bank',
            selector: 'receiveThroughBankBranch',
            cell: row => row.receiveThroughBankBranch,
            width: '140px'

        },
        {
            id: 'shipDateId',
            name: "Ship Date",
            selector: 'shipDate',
            width: '90px',
            cell: row => formatFlatPickerValue( row.shipDate )
        },

        {
            id: 'expiryDateId',
            name: 'Expiry  Date',
            selector: 'documentExpiryDate',
            width: '90px',
            cell: row => formatFlatPickerValue( row.documentExpiryDate )

        },
        {
            id: 'portOfLoadingId',
            name: 'Port of Loading',
            selector: 'portOfLoading',
            cell: row => JSON.parse( row.portOfLoading ).toString(),
            width: '300px'

        }
    ];
    return column;
};

export const masterDocumentsColumns = [

    {
        name: 'Export  ID',
        cell: row => row.exId

    },
    {
        name: 'Export  No',
        cell: row => row.exNumber,
        width: '150px'

    },
    {
        name: 'Expiry Date',
        cell: row => row.expiryDate

    },

    {
        name: 'Com. Reference',
        cell: row => row.comRef,
        minWidth: '140px'

    },
    {
        name: 'Buyer',
        cell: row => row.buyer

    },

    {
        name: "Ship Date",
        cell: row => row.shipDate
    },
    {
        name: 'Document Type',
        cell: row => row.documentType,
        minWidth: '140px'
    },
    {
        name: 'Quantity',
        cell: row => row.quantity
    },
    {
        name: 'Amount',
        cell: row => row.amount
    }

];
