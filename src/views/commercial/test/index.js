import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import {
    Card,
    Col,
    Row
} from 'reactstrap';
import { getAllChargeHeadsByQuery } from '../charge-heads/store/actions';

const Test = () => {

    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 5 );
    const [searchKey, setSearchKey] = useState( '' );
    const [sortedBy, setSortedBy] = useState( 'name' );
    const [status, setStatus] = useState( true );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const { allChargeHeads, total } = useSelector( ( { chargeHeadsReducer } ) => chargeHeadsReducer );
    console.log( 'currentPage', currentPage );
    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        searchKey,
        status
    };
    !paramsObj.searchKey.length && delete paramsObj.searchKey;
    ///effects
    const initialData = {
        cHead: null
    };
    const [filterObj, setFilterObj] = useState( initialData );
    const updatedCHead = allChargeHeads.map( e => ( { label: e.name, value: e.id } ) );
    console.log( 'updatedCHead', updatedCHead );
    //function for get all charge heads
    const handleGetAllChargeHeads = () => {
        dispatch( getAllChargeHeadsByQuery( paramsObj ) );
    };
    //effect
    useEffect( () => {
        handleGetAllChargeHeads();
    }, [dispatch] );

    const handleDropdownChange = ( data, e ) => {
        const { name } = e;
        const updatePi = {
            ...filterObj,
            [name]: data
        };
        setFilterObj( updatePi );
    };

    const handlePaginationBottom = ( e ) => {
        console.log( e );
        if ( e.isTrusted === true ) {
            delete paramsObj.searchKey;
            dispatch(
                getAllChargeHeadsByQuery( {
                    page: currentPage + 1,
                    perPage: rowsPerPage,
                    status
                } )
            );
            setCurrentPage( currentPage + 1 );

        }

    };


    // useEffect( () => {
    //     const dropdown = document.getElementById( 'cHead' );
    //     dropdown.addEventListener( 'scroll', handlePaginationBottom );
    //     return () => {
    //         dropdown.removeEventListener( 'scroll', handlePaginationBottom );
    //     };
    // }, [currentPage] );

    return (

        <Card className='m-2 p-5'>
            <Row>
                <Col xs={12} lg={4}>

                </Col>
                <Col xs={12} lg={4}>
                    <Select
                        name='cHead'
                        id='cHead'
                        className='mb-1'
                        options={updatedCHead}
                        value={filterObj?.cHead}
                        onChange={handleDropdownChange}
                        onMenuScrollToBottom={handlePaginationBottom}
                    />
                </Col>

            </Row>


        </Card>
    );
};

export default Test;
