import { useState } from "react";
import { Col, Row } from "reactstrap";
import ErpDateInput from "utility/custom/ErpDateInput";
import { ErpInput } from "utility/custom/ErpInput";

const ButtonTest = () => {

    const [data, setData] = useState( {
        blDate: '',
        dayToRealize: 0,
        realizationDate: ''
    } );
    console.log( { data } );
    const handleDateInput = ( date, name ) => {
        const updateData = {
            ...data,
            [name]: date
        };
        setData( updateData );
        //setFormData( { ...formData, [name]: date } );
    };
    const handleInputChange = ( e ) => {
        const { name, value, type } = e.target;
        const updateData = {
            ...data,
            [name]: type === 'number' ? Number( value ) : value
        };
        setData( updateData );

    };
    const calculateJoiningDate = ( applyDate, days ) => {
        const resultDate = new Date( applyDate );
        resultDate.setDate( resultDate.getDate() + days );
        return resultDate;
    };
    const joiningDate = calculateJoiningDate( data.blDate, data.dayToRealize );
    console.log( { joiningDate } );
    return (
        <div>
            <Row>
                <Col lg='6' md='6' xl='3'>
                    <ErpDateInput
                        name='blDate'
                        id='blDateId'
                        value={data.blDate}
                        onChange={handleDateInput}
                        label='BL Date'
                        placeholder='BL Date'
                        classNames='mt-1'
                    />
                </Col>
                <Col lg='6' md='6' xl='3'>
                    <ErpInput
                        name='dayToRealize'
                        id='dayToRealizeId'
                        type='number'
                        onChange={handleInputChange}
                        value={data.dayToRealize}
                        label='Day To Realize'
                        classNames='mt-1'
                        onFocus={( e ) => e.target.select()}
                    // disabled={isDetailsForm}
                    // invalid={( errors && errors?.billNo && !exportInvoiceInfo?.billNo.trim().length ) && true}
                    />
                </Col>

                <Col lg='6' md='6' xl='3'>
                    <ErpDateInput
                        name='realizationDate'
                        id='realizationDateId'
                        value={joiningDate}
                        onChange={handleDateInput}
                        label='Realization Date'
                        placeholder='Realization Date'
                        classNames='mt-1'
                    />
                </Col>
            </Row>

        </div>
    );
};

export default ButtonTest;