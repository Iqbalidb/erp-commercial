import { PropTypes } from 'prop-types';
import React from 'react';
import Select from 'react-select';
import Creatable from 'react-select/creatable';
import CustomToolTip from './CustomToolTip';


const ToolTipDropdown = ( props ) => {
    const { isCreatable, id, value, position } = props;
    return (
        <div >
            {
                isCreatable ? (
                    <Creatable
                        id={id}
                        {...props}
                    />
                ) : (
                    <Select
                        id={id}
                        {...props}
                    />
                )

            }

            {
                value && (
                    <CustomToolTip
                        position={position}
                        id={id}
                        value={value?.label}
                    />
                )
            }
        </div>
    );
};

export default ToolTipDropdown;


// ** Default Props
ToolTipDropdown.defaultProps = {
    isCreatable: false,
    position: 'right'
};

// ** PropTypes
ToolTipDropdown.propTypes = {
    id: PropTypes.string.isRequired,
    isCreatable: PropTypes.bool
};
