import '@custom-styles/basic/custom-tooltip-table.scss';
import { PropTypes } from 'prop-types';
import React from 'react';
import { Table, UncontrolledTooltip } from 'reactstrap';
const DetailsToolTip = ( props ) => {
    const { value, position, id, mainClass } = props;
    // console.log( value );
    return (
        <div className='details-tooltip'>
            <UncontrolledTooltip
                placement={position}
                target={id}
                autohide={false}
                // delay={{ hide: '1555000' }}
                trigger="hover"
                style={{
                    color: '#7367F0',
                    backgroundColor: 'white',
                    border: 'solid 1px #7367F0',
                    minWidth: '500px',
                    padding: '1rem'
                }}
            >
                <div style={{ minWidth: '200px', backgroundColor: 'white' }}>
                    <Table className='custom-tooltip-table ' bordered>
                        <thead>
                            <tr>
                                <th>Segment</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                value?.map( ( item, index ) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                {item.name}
                                            </td>
                                            <td>
                                                {item.value}
                                            </td>
                                        </tr>
                                    );
                                } )
                            }


                        </tbody>
                    </Table>
                </div>
            </UncontrolledTooltip >
        </div>

    );
};

export default DetailsToolTip;


// ** Default Props
DetailsToolTip.defaultProps = {
    value: 'Blank',
    position: 'auto'

};

// ** PropTypes
DetailsToolTip.propTypes = {
    value: PropTypes.array,
    position: PropTypes.string,
    id: PropTypes.string.isRequired
};
