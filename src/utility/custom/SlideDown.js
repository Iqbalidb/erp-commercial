import React from 'react';
import SlideDown from 'react-slidedown';
import 'react-slidedown/lib/slidedown.css';

const AdvancedSearchBox = ( { children, isOpen } ) => {
    return (
        <div hidden={isOpen} className="my-dropdown-slidedown">
            <SlideDown>
                {children}
            </SlideDown>

        </div>

    );
};

export default AdvancedSearchBox;