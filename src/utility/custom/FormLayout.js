// import React from 'react';
// import { Card, CardBody } from 'reactstrap';
// import '../../assets/scss/basic/formLayout.scss';

// export default function FormLayout( props ) {

//     return (
//         <Card className='card-layout-container mt-3'>
//             <CardBody className='card-body-container'>
//                 {props.children}
//             </CardBody>
//         </Card>
//     );
// }


import PropTypes from 'prop-types';
import { Card, CardBody } from 'reactstrap';
import '../../assets/scss/basic/formLayout.scss';

export default function FormLayout( props ) {
    const { children, isNeedTopMargin = false, hidden = false, classNames, isNested = false } = props;

    return (
        <Card hidden={hidden} className={` card-layout-container ${classNames} ${isNeedTopMargin ? 'mt-3' : ''}`}>
            <CardBody className={`${isNested ? 'card-body-container-nested' : 'card-body-container'} `}>
                {children}
            </CardBody>
        </Card>
    );
}
// ** Default Props
FormLayout.defaultProps = {
    isNeedTopMargin: false,
    hidden: false,
    classNames: ''
};
// ** PropTypes
FormLayout.propTypes = {
    children: PropTypes.node,
    isNeedTopMargin: PropTypes.bool,
    hidden: PropTypes.bool,
    classNames: PropTypes.string
};