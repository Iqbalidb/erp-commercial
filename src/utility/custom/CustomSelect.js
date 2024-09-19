import React from 'react';
import { CustomInput } from 'reactstrap';

const CustomSelect = ( { options, value, onChange, id, placeholder, name } ) => {
    return (
        <div>
            <CustomInput
                bsSize="sm"
                className='form-control mx-50'
                name={name}
                type='select'
                placeholder={placeholder || 'Select'}
                id={id}
                value={value?.label || ''}
                onChange={onChange}


            >
                {options.map( ( option, index ) => {
                    return (
                        <option key={index} value={option?.value || ''}>{option?.label}</option>
                    );
                }
                )
                }
            </CustomInput>

        </div>
    );
};

export default CustomSelect;