import '@custom-styles/basic/custom-tooltip-table.scss';
import { PropTypes } from 'prop-types';
import React, { useState } from 'react';
import { Table, Tooltip } from 'reactstrap';
const ToolTips = ( props ) => {
    const { value, position, id, mainClass } = props;
    const [tooltipOpen, setTooltipOpen] = useState( false );
    const toggle = () => setTooltipOpen( !tooltipOpen );

    return (
        // <UncontrolledTooltip
        //     placement={position}
        //     target={id}
        //     //   autohide={false}
        //     ///  delay={{ hide: '1555000' }}
        //     trigger="hover"
        //     style={{
        //         color: 'blue',
        //         backgroundColor: 'white',
        //         border: 'solid 1px #7367F0',
        //         minWidth: '500px',
        //         padding: '1rem'


        //     }}
        // >
        //     <div style={{ minWidth: '200px', backgroundColor: 'white' }}>
        //         <Table className='custom-tooltip-table ' bordered>
        //             <thead>
        //                 <tr>
        //                     <th>Segment</th>
        //                     <th>Value</th>
        //                 </tr>
        //             </thead>
        //             <tbody>
        //                 {
        //                     value.map( ( item, index ) => {
        //                         return (
        //                             <tr key={index}>
        //                                 <td>
        //                                     {item.name}
        //                                 </td>
        //                                 <td>
        //                                     {item.value}
        //                                 </td>
        //                             </tr>
        //                         );
        //                     } )
        //                 }


        //             </tbody>
        //         </Table>
        //     </div>
        // </UncontrolledTooltip >

        <Tooltip
            {...props}
            isOpen={tooltipOpen}
            target={id}
            toggle={toggle}
            placement={position}
            trigger="hover"
            autohide={false}
            //  delay={{ hide: '1000' }}
            style={{
                color: 'blue',
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
                            value.map( ( item, index ) => {
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
        </Tooltip>
    );
};

export default ToolTips;


// ** Default Props
ToolTips.defaultProps = {
    value: 'Blank',
    position: 'auto',
    flip: true
};

// ** PropTypes
ToolTips.propTypes = {
    value: PropTypes.array,
    position: PropTypes.string,
    id: PropTypes.string.isRequired
};
