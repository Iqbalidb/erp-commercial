import 'react-slidedown/lib/slidedown.css';

const AdvancedSearchBox = ( { children, isOpen } ) => {
    return (
        <div hidden={isOpen} className="search-box-root">
            {/* <SlideDown> */}
            <div className='search-box'  >

                {children}


            </div>
            {/* </SlideDown> */}

        </div>

    );
};

export default AdvancedSearchBox;