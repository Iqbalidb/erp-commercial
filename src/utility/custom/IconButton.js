import PropTypes from 'prop-types';
import { MoreHorizontal } from "react-feather";
import { Button, Label, UncontrolledTooltip } from "reactstrap";

const IconButton = ( props ) => {
    const {
        id,
        disabled,
        color,
        classNames,
        onClick,
        label,
        placement,
        icon,
        hidden,
        isBlock,
        outline,
        tag,
        htmlFor
    } = props;
    return (
        <>
            <Button.Ripple

                id={id}
                size="sm"
                htmlFor={id}
                outline={outline}
                hidden={hidden}
                tag={tag}
                className={`btn-icon ${( !isBlock || hidden ) && 'p-0'}   ${classNames}`}
                color={color}
                disabled={disabled}
                onClick={onClick}
            >
                {icon}
            </Button.Ripple>
            {
                !hidden && (
                    <UncontrolledTooltip

                        // autohide={true}
                        target={id}
                        placement={placement}
                    >
                        {label}
                    </UncontrolledTooltip>
                )
            }

        </>
    );
};


export default IconButton;

// ** Default Props
IconButton.defaultProps = {
    disabled: false,
    hidden: false,
    isBlock: false,
    outline: false,
    classNames: '',
    placement: 'auto',
    tag: Label,

    label: 'Button',
    color: 'flat-primary',
    icon: <MoreHorizontal size={16} />
};

// ** PropTypes
IconButton.propTypes = {
    id: PropTypes.string.isRequired,
    placement: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    isBlock: PropTypes.bool,
    color: PropTypes.string,
    classNames: PropTypes.string,
    icon: PropTypes.node.isRequired
};
