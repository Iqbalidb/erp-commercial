import { useEffect, useState } from "react";
import { Card } from "reactstrap";
import { baseAxios } from "services";
import { commercialApi } from "services/api-end-points/commercial";
import { convertQueryString } from "utility/Utils";
import CustomDropdown from "./drop-down";

export default function Custom() {
    const [allOptions, setAllOptions] = useState( [] );
    const [page, setPage] = useState( 1 );
    const [hasMore, setHasMore] = useState( true );
    const [lastElementVisible, setLastElementVisible] = useState( false );
    // console.log( lastElementVisible );
    const [isloading, setIsLoading] = useState( false );
    console.log( 'has more', hasMore );
    console.log( 'lastElement', lastElementVisible );

    const options = [
        {
            label: 'Company 1'
        }, {
            label: 'Company 2'
        }, {
            label: 'Company 3'
        },
        {
            label: 'Company 4'
        },
        {
            label: 'Company 5'
        },
        {
            label: 'Company 6'
        },
        {
            label: 'Company 7'
        },
        {
            label: 'Company 8'
        },
        {
            label: 'Company 9'
        },
        {
            label: 'Company 10'
        },
        {
            label: 'Company 11'
        },
        {
            label: 'Company 12'
        }
    ];
    const defaultFilteredArrayValue = [
        {
            column: "documentType",
            value: ''
        },
        {
            column: "commercialReference",
            value: ''
        },
        {
            column: "buyerId",
            value: ''
        },
        {
            column: "documentNumber",
            value: ''
        },
        {
            column: "beneficiary",
            value: ''
        },
        {
            column: "shipDate",
            value: ''
        },
        {
            column: "documentExpiryDate",
            value: ''
        },
        {
            column: "portOfLoading",
            value: ''
        }


    ];
    const filteredData = defaultFilteredArrayValue.filter( filter => filter.value.length );
    const paramsObj = {
        page,
        perPage: 7,
        sortedBy: 'documentType',
        orderBy: 'asc',
        isDraft: false,
        status: true
    };
    useEffect( () => {
        setIsLoading( true );
        baseAxios.post(
            `${commercialApi.masterDoc.root}/get/all?${convertQueryString( paramsObj )}`, filteredData ).then( res => {

                if ( res.data ) {
                    setIsLoading( false );
                    setHasMore( allOptions.length < res.data.totalRecords );
                    // console.log( 'hasMore', allOptions.length < res.data.totalRecords );
                    const allData = res?.data?.data?.map( d => {
                        return {
                            label: d.documentNumber
                        };
                    } );
                    setAllOptions( [...allOptions, ...allData] );
                }
            } ).catch( err => console.log( err ) );
    }, [page, hasMore] );
    useEffect( () => {
        if ( lastElementVisible && hasMore ) {
            setPage( prev => prev + 1 );
        }
    }, [lastElementVisible, hasMore] );


    const isLastElementVisible = ( visibility ) => {
        setLastElementVisible( visibility );
        // if ( visibility && hasMore ) {
        //     console.log( 'api call' );
        //     setPage( prev => prev + 1 );
        // }
    };
    return (
        <>
            <Card>
                <div style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CustomDropdown id='custom-dropdown' options={allOptions} isLastElementVisible={isLastElementVisible} fetchLoading={isloading} />

                </div>
            </Card>
        </>
    );
}
