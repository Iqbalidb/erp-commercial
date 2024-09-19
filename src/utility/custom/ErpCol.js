import React from 'react';
import { Col } from 'reactstrap';

const ErpCol = ( props ) => {
    const { children, ...rest } = props;
    return (
        <Col
            {...rest}
        >
            <div style={{
                padding: '5px'
            }}>
                {children}
            </div>
        </Col>
    );
};

export default ErpCol;