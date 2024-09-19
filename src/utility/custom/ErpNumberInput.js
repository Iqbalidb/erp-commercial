import PropTypes from 'prop-types';
import NumberFormat from "react-number-format";
import { Label } from "reactstrap";
import '../../assets/scss/basic/erp-input.scss';
export const ErpNumberInput = ( props ) => {
    const {
        classNames,
        invalid,
        name,
        label,
        value,
        secondaryOption,
        decimalScale,
        onChange,
        disabled,
        sideBySide,
        ...rest
    } = props;
    const numberOnChange = ( e ) => {
        const { name, value } = e.target;
        if ( value !== '.' ) {
            const formatNumber = Number( value );
            const returnObj = {
                ...e.target,
                name,
                value: formatNumber
            };
            onChange( {
                ...e,
                target: {
                    ...returnObj
                }
            } );

        }
    };

    return (
        <>
            {
                sideBySide ? (
                    <div className={`${classNames} erp-input-container `}>
                        <Label size='sm' className='font-weight-bolder'>{label}</Label>
                        <div className='d-flex align-items-center'>
                            <span className='mr-1 font-weight-bolder'>:</span>


                            <NumberFormat
                                className={`form-control-sm form-control text-right ${invalid && 'border-danger'} `}
                                displayType="input"
                                value={value}
                                disabled={disabled}
                                name={name}
                                decimalScale={decimalScale}
                                allowNegative={false}
                                fixedDecimalScale={value !== 0}
                                allowLeadingZeros={false}
                                onFocus={e => {
                                    e.target.select();
                                }}
                                onChange={( e ) => { numberOnChange( e ); }}
                                onBlur={( e ) => { numberOnChange( e ); }}
                            // {...rest}
                            />

                            {secondaryOption && secondaryOption}
                        </div>
                    </div>
                ) : (
                    <div className={`${classNames}`}>
                        {label && <Label size='sm' className='font-weight-bolder'>{label}</Label>}
                        <div >
                            <NumberFormat
                                className={`form-control-sm form-control text-right ${invalid && 'border-danger'} `}
                                displayType="input"
                                value={value}
                                name={name}
                                decimalScale={decimalScale}
                                allowNegative={false}
                                fixedDecimalScale={value !== 0}
                                allowLeadingZeros={false}
                                onFocus={e => {
                                    e.target.select();
                                }}
                                onChange={( e ) => { numberOnChange( e ); }}
                                onBlur={( e ) => { numberOnChange( e ); }}
                            // {...rest}
                            />
                            {secondaryOption && secondaryOption}
                        </div>
                    </div>
                )
            }

        </>
    );
};

// / ** PropTypes
ErpNumberInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.number.isRequired,
    decimalScale: PropTypes.number.isRequired,
    classNames: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    secondaryOption: PropTypes.node,
    sideBySide: PropTypes.bool,
    invalid: PropTypes.bool
};

// ** Default Props
ErpNumberInput.defaultProps = {
    decimalScale: 0,
    sideBySide: true,
    invalid: false
};
