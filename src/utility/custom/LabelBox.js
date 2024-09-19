import { Input } from 'reactstrap';
import './label.scss';
const LabelBox = ( { id, text, isInvalid = false, isComponentBase = false } ) => {
    return (
        <>
            {
                isComponentBase ? (
                    <div id={id} className={isInvalid ? `invalid-label-box` : `label-box w-100`}>
                        {text ?? ''}
                    </div>
                ) : (
                    <Input
                        id={id}
                        disabled
                        bsSize="sm"
                        invalid={isInvalid}
                        value={text ?? ''}
                        onChange={( e ) => { e.preventDefault(); }}
                    />
                )
            }


        </>

    );
};

export default LabelBox;