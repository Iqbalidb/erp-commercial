import Select from 'react-select/creatable';
import { Label } from 'reactstrap';
// import '../../assets/scss/basic/erp-input.scss';
import "../../assets/scss/basic/erp-input.scss";
import { selectThemeColors } from '../Utils';

export default function ErpCreatableSelect( props ) {
    const { label, classNames, className, onChange, component, menuPlacement = 'auto', sideBySide = true, secondaryOption, size = 'sm', ...rest } = props;
    return (

        <>
            {
                sideBySide ? <div className={`${classNames} ${size === 'lg' ? 'large-erp-input-container' : 'erp-input-container'}`} >
                    <Label size='sm' className='font-weight-bolder text-black' style={{ color: 'black', fontWeight: "bold" }}>{label}</Label>
                    <div className='d-flex align-items-center'>
                        <span className='erp-select-span font-weight-bolder'>:</span>
                        {
                            component ? <Select
                                {...rest}
                                menuPlacement={menuPlacement}
                                className={`w-100 ${className}`}
                                classNamePrefix='dropdown'
                                components={{ MenuList: component }}
                                theme={selectThemeColors}
                                isCreatable={true}

                            /> : <Select
                                {...rest}
                                maxMenuHeight={200}
                                menuPlacement={menuPlacement}
                                className={`w-100 ${className}`}
                                classNamePrefix='dropdown'
                                theme={selectThemeColors}
                                isCreatable={true}

                                onChange={( data, e ) => {
                                    onChange( data, e );
                                }}
                            />
                        }

                        {secondaryOption && secondaryOption}
                    </div>
                </div > : <div className={`${classNames}`} >
                    {label && <Label size='sm' className='fw-bolder text-black'>{label}</Label>}
                    <div className='d-flex align-items-center'>
                        {
                            component ? <Select
                                {...rest}
                                menuPlacement={menuPlacement}
                                className={`w-100 ${className}`}
                                classNamePrefix='dropdown'
                                components={{ MenuList: component }}
                                isCreatable={true}

                                theme={selectThemeColors}

                            /> : <Select
                                {...rest}
                                maxMenuHeight={200}
                                menuPlacement={menuPlacement}
                                className={`w-100 ${className}`}
                                classNamePrefix='dropdown'
                                theme={selectThemeColors}
                                isCreatable={true}

                                onChange={( data, e ) => {
                                    onChange( data, e );
                                }}
                            />
                        }

                        {secondaryOption && secondaryOption}
                    </div>
                </div >
            }
        </>


    );
}
