import { Label } from "reactstrap";
import '../../assets/scss/basic/erp-input.scss';
import CustomToolTip from "./CustomToolTip";
import LabelBox from "./LabelBox";
import ToolTipComponent from "./ToolTipComponent";

export const ErpDetailInputTooltip = ( props ) => {
    const { id, classNames, invalid = false, type = "text", position = "top", component = null, label, secondaryOption, value, sideBySide = true } = props;

    return (
        <>
            {
                sideBySide ? (
                    <div className={`${classNames} erp-input-container `}>
                        <Label className='font-weight-bolder'>{label}</Label>
                        <div className='d-flex align-items-center'>
                            <span className='mr-1 font-weight-bolder'>:</span>
                            <LabelBox isInvalid={invalid} id={id} text={value} />
                            {
                                type === "component" ? (

                                    <ToolTipComponent position={position} id={id} component={component} />
                                ) : (

                                        value?.length ? <CustomToolTip id={id} value={value} /> : null


                                )
                            }

                            {secondaryOption && secondaryOption}
                        </div>
                    </div>
                ) : (
                    <div className={`${classNames}`}>
                        {label && <Label className='font-weight-bolder'>{label}</Label>}
                        <div className='d-flex align-items-center'>
                            <LabelBox isInvalid={invalid} id={id} text={value} />
                            {
                                type === "component" ? (
                                    <ToolTipComponent id={id} component={component} />
                                    ) : (

                                            value?.length ? <CustomToolTip id={id} value={value} /> : null


                                )
                            }

                            {secondaryOption && secondaryOption}
                        </div>
                    </div>
                )
            }

        </>
    );
};