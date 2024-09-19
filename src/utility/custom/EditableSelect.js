import { PropTypes } from 'prop-types';
import { useState } from "react";
import ReactSelect, { components } from "react-select";
import CreatableSelect from 'react-select/creatable';
import { Input } from "reactstrap";
import { selectThemeColors } from '../Utils';
import CustomToolTip from "./CustomToolTip";

const ReactEditableSelect = ( props ) => {
    const { isCreatable, valueOnChange, value, isToolTrip, position, id } = props;
    const [isMenuOpen, setIsMenuOpen] = useState( false );
    const [searchKey, setSearchKey] = useState( value?.label ?? '' );

    // console.log( searchKey );

    const handleOnChange = ( data, e ) => {
        valueOnChange( data, e );
        setSearchKey( data?.label ?? '' );
    };

    const handleMenuOpen = ( condition ) => {
        setIsMenuOpen( condition );

        // setSearchKey( value?.label ?? '' );
    };


    const ValueContainer = ( inputProps ) => {
        const { children, selectProps } = inputProps;
        const { onInputChange, inputValue, onBlur } = selectProps;
        const handleChange = ( v ) => {
            onInputChange( v );
            setIsMenuOpen( true );
        };

        const handleOpn = ( condition ) => {
            // console.log( condition );
        };
        return (
            <components.ValueContainer {...inputProps}>

                <Input
                    hidden={!isMenuOpen}
                    id='fdfkd'
                    autoFocus
                    className='shadow-none border-0 p-0   w-100'
                    // style={styles}
                    onChange={( e ) => { handleChange( e.target.value ); }}
                    value={inputValue}
                    onBlur={() => handleOpn( isMenuOpen )}

                    onFocus={() => { handleMenuOpen( true ); }}
                    bsSize='sm'
                // onBlurCapture={() => { setIsMenuOpen( true ); }}

                />


                {!isMenuOpen &&
                    <div >
                        {children}
                    </div>
                }


            </components.ValueContainer>
        );
    };


    const inputOnChange = ( newValue ) => {
        setSearchKey( newValue );
    };

    console.log( isMenuOpen );

    return (
        <div>
            {
                isCreatable ? (
                    <CreatableSelect
                        theme={selectThemeColors}
                        classNamePrefix='dropdown'
                        className="erp-dropdown-select w-100"
                        isClearable

                        menuPosition='fixed'
                        inputValue={searchKey}
                        onInputChange={( newValue ) => { inputOnChange( newValue ); }}
                        onChange={( data, e ) => { handleOnChange( data, e ); }}
                        components={{
                            ValueContainer,
                            SingleValue: () => {
                                return null;
                            }
                        }}
                        menuIsOpen={isMenuOpen}
                        onMenuClose={() => { handleMenuOpen( false ); }}
                        onMenuOpen={() => { handleMenuOpen( true ); }}
                        {...props}
                    />
                ) : (
                    <ReactSelect
                        theme={selectThemeColors}
                        classNamePrefix='dropdown'
                        className="erp-dropdown-select w-100"
                        isClearable
                        menuPosition='fixed'
                        inputValue={searchKey}
                        onInputChange={( newValue ) => { inputOnChange( newValue ); }}
                        onChange={( data, e ) => { handleOnChange( data, e ); }}
                        components={{
                            ValueContainer,
                            DropdownIndicator: () => {
                                return null;
                            }

                            // SingleValue: () => {
                            //     return null;
                            // }
                        }}
                        onBlur={() => { handleMenuOpen( !isMenuOpen ); }}
                        menuIsOpen={isMenuOpen}
                        onMenuClose={() => { handleMenuOpen( false ); }}
                        onMenuOpen={() => { handleMenuOpen( true ); }}
                        {...props}
                    />
                )
            }

            {
                ( value && isToolTrip ) && (
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

export default ReactEditableSelect;


// ** Default Props
ReactEditableSelect.defaultProps = {
    position: 'right',
    isToolTrip: false,
    isCreatable: false
    // value: {}
};

// ** PropTypes
ReactEditableSelect.propTypes = {
    // value: PropTypes.obj,
    options: PropTypes.array,
    name: PropTypes.string,
    isCreatable: PropTypes.bool,
    valueOnChange: PropTypes.func,
    position: PropTypes.string,
    id: PropTypes.string.isRequired,
    value: PropTypes.object
};
