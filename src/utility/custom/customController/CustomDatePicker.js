/*
   Title: Custom Date Picker
   Description: Custom Date Picker
   Author: Iqbal Hossain
   Date: 06-February-2022
   Modified: 06-February-2022
*/

import '@styles/react/libs/flatpickr/flatpickr.scss';
import PropTypes from 'prop-types';
import { Fragment, useState } from 'react';
import { X } from 'react-feather';
import Flatpickr from 'react-flatpickr';
import { Label } from 'reactstrap';

const CustomDatePicker = props => {
  const { name, title, value, onChange, minDate, maxDate, mode = 'single', isClearable = false, placeholder, invalid = false, disabled = false, className, ...rest } = props;
  const [dateValue, setDateValue] = useState( value );
  // console.log( 'custom-date-picker', value );
  const handleClear = () => {
    if ( mode === 'single' ) {
      onChange( null );
    } else {
      onChange( [] );
    }
  };
  return (
    <Fragment>
      {title && <Label for={title}>{title}</Label>}
      <div className={`${invalid ? 'border-danger rounded w-100' : 'w-100'} ${className} flatpicker-container`}>
        <Flatpickr
          name={name}
          value={value}
          placeholder={placeholder}
          id="hf-picker"
          // className="form-control-sm form-control "
          className={`${disabled ? 'flatpickr-container-disable' : 'flatpickr-container-enable'} form-control-sm form-control`}
          onChange={onChange}
          disabled={disabled}
          options={{
            // altInput: true,
            dateFormat: "j-M-Y",
            mode,
            // dateFormat: "Y",

            // altFormat: "DD-MMM-YYYY",
            maxDate,
            minDate
            // parseDate: ( datestr, format ) => {
            //   return moment( datestr, format, true ).toDate();
            // },
            // formatDate: ( date, format, locale ) => {
            //   return moment( date ).format( format );
            // }

          }}
          {...rest}
        >

        </Flatpickr>
        {value?.length && isClearable ? <span className='clear-icon' onClick={handleClear}>
          <X size={16} />
        </span> : null}
      </div>

    </Fragment>
  );
};

CustomDatePicker.defaultProps = {
  placeholder: '',
  mode: 'single',
  disabled: false
};

CustomDatePicker.propTypes = {
  value: PropTypes.any,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  mode: PropTypes.string
};

export default CustomDatePicker;
