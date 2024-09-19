
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';

export default function FormContentLayout( props ) {
    const { marginTop, title, border = true, children } = props;
    return (
        <>
            <Row className={`p-0 mt-0 ${marginTop ? 'mt-1' : 'mt-0'}`} >
                {title && <Col className="title-container  p-0">
                    <p>{title}</p>
                    <div />
                </Col>}
            </Row>
            <Row className={`${border && 'border pt-1 pb-1 pl-1 pr-1 rounded'}`} >
                {children}
            </Row>
        </>
    );
}

// ** Default Props
FormContentLayout.defaultProps = {
    marginTop: false,
    border: true
};
// ** PropTypes
FormContentLayout.propTypes = {
    children: PropTypes.node,
    marginTop: PropTypes.bool,
    border: PropTypes.bool,
    title: PropTypes.string
};