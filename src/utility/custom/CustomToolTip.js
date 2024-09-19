import { PropTypes } from 'prop-types';
import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';

const CustomToolTip = ( props ) => {
    const { value, position, id } = props;
    return (
        <UncontrolledTooltip
            placement={position}
            target={id}
            autohide={false}
            style={{
                color: '#7367F0',
                fontWeight: 'bold',
                backgroundColor: 'white',
                border: 'solid 1px #7367F0'
            }}
        >
            {value}
        </UncontrolledTooltip>
    );
};

export default CustomToolTip;


// ** Default Props
CustomToolTip.defaultProps = {
    value: 'Blank',
    position: 'right'

};

// ** PropTypes
CustomToolTip.propTypes = {
    value: PropTypes.string,
    position: PropTypes.string,
    id: PropTypes.string.isRequired
};
