import { Label } from 'reactstrap';
import '../../assets/scss/basic/erp-input.scss';
import CustomDatePicker from './customController/CustomDatePicker';
export default function ErpDateInput( props ) {
    const { classNames, label, type, onChange, disabled = false, value, name, invalid = false, sideBySide = true, ...rest } = props;


    return (
        <>
            {
                sideBySide ? (
                    <div className={`${classNames} erp-input-container `}>
                        <Label size='sm' className='font-weight-bolder'>{label}</Label>
                        <div className='d-flex align-items-center'>
                            <span className='mr-1 font-weight-bolder'>:</span>
                            <CustomDatePicker
                                {...rest}
                                // value={moment( updatedDate ).format( 'YYYY-MM-DD' )}
                                invalid={invalid}
                                value={value}
                                label={label}
                                disabled={disabled}
                                name={name}
                                onChange={( e ) => onChange( e, name )}
                            />
                        </div>
                    </div>
                ) : <div className={`${classNames} `}>

                    {label && <Label size='sm' className='font-weight-bolder'>{label}</Label>}

                    <div>
                        <CustomDatePicker
                            {...rest}
                            // value={moment( updatedDate ).format( 'YYYY-MM-DD' )}
                            invalid={invalid}
                            value={value}
                            label={label}
                            disabled={disabled}
                            name={name}
                            onChange={( e ) => onChange( e, name )}
                        />
                    </div>
                </div>
            }

        </>

    );
}
