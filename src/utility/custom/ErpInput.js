import { Input, Label } from "reactstrap";
import '../../assets/scss/basic/erp-input.scss';

export const ErpInput = ( props ) => {
    const { onChange, classNames, type = 'text', label, secondaryOption, sideBySide = true, ...rest } = props;
    // console.log( type, ':', value );
    return (
        <>
            {
                sideBySide ? (
                    <div className={`${classNames} erp-input-container `}>
                        <Label size='sm' className='font-weight-bolder'>{label}</Label>
                        <div className='d-flex align-items-center'>
                            <span className='mr-1 font-weight-bolder'>:</span>
                            <Input
                                type={type}
                                className={`${type === 'number' && 'text-right'}`}
                                {...rest}
                                label={label}
                                bsSize='sm'
                                onChange={( e ) => onChange( e )}

                            />

                            {secondaryOption && secondaryOption}
                        </div>
                    </div>
                ) : (
                    <div className={`${classNames}`}>
                        {label && <Label size='sm' className='font-weight-bolder'>{label}</Label>}
                        <div >
                            <Input
                                type={type}
                                className={`${type === 'number' && 'text-right'}`}
                                {...rest}
                                label={label}
                                bsSize='sm'
                                onChange={( e ) => onChange( e )}

                            />
                            {secondaryOption && secondaryOption}
                        </div>
                    </div>
                )
            }

        </>
    );
};