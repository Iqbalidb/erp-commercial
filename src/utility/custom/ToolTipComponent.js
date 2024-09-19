import '@custom-styles/basic/custom-tooltip-table.scss';
import { PropTypes } from 'prop-types';
import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
const ToolTipComponent = ( props ) => {
    const { position, id, component } = props;
    // console.log( value );
    return (
        <UncontrolledTooltip
            placement={position}
            target={id}
            autohide={false}
            ///  delay={{ hide: '1555000' }}
            trigger="hover"
            style={{
                color: '#000',
                backgroundColor: 'white',
                border: 'solid 1px #7367F0',
                minWidth: '300px',
                padding: '0.5rem'

            }}
        >
            {component}
        </UncontrolledTooltip >
    );
};

export default ToolTipComponent;


// ** Default Props
ToolTipComponent.defaultProps = {
    position: 'bottom'

};

// ** PropTypes
ToolTipComponent.propTypes = {
    position: PropTypes.string,
    id: PropTypes.string.isRequired
};
