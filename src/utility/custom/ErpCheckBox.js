const { Label } = require( "reactstrap" );

const CheckBoxInput = ( props ) => {
    const { marginTop, label, classNames, onChange, name, checked, ...rest } = props;
    return (
        <div className='general-form-container'>
            <div className={`${classNames} checkbox-input-container `}>
                <input
                    type='checkbox'
                    name={name}
                    onChange={( e ) => onChange( e )}
                    checked={checked}
                    {...rest}
                />
                <Label check size='sm' className='font-weight-bolder' > {label}</Label>
            </div>
        </div>
    );
};
export default CheckBoxInput;