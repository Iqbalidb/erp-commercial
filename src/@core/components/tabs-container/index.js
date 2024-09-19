/*
     Title: Custom Tab
     Description: Custom Tab
     Author: Aimun nahar
     Date: 10-June-2023
     Modified: 10-June-2023
*/
import { useState } from 'react';
import SlideDown from 'react-slidedown';
import 'react-slidedown/lib/slidedown.css';
import '../../../assets/scss/basic/tabs-container/tabs.scss';

export default function TabContainer( props ) {
    const { tabs, checkIfRestricted, onClick } = props;
    const [left, setLeft] = useState( 0 );
    const [tabActive, setTabActive] = useState( 0 );
    const height = 30;

    const handleTabIndex = ( i, tab ) => {
        if ( checkIfRestricted ) {
            // it's checking whether the selected tab button is restricted or not
            const restrictedTabButton = checkIfRestricted( tabs[i] );
            if ( !restrictedTabButton ) {
                //if not then proceed further
                setTabActive( i );
                // getting the before array elements of selected index
                const updatedArray = tabs.slice( 0, i );
                // getting the sum of before array element's width to know how far this slider should move
                const move = updatedArray.reduce( ( sum, current ) => sum + parseInt( current.width ), 0 );
                setLeft( move );
            }
        } else {
            setTabActive( i );
            const updatedArray = tabs.slice( 0, i );
            const move = updatedArray.reduce( ( sum, current ) => sum + parseInt( current.width ), 0 );
            setLeft( move );
        }

        onClick && onClick( tab );
    };


    return (
        <div className='tab-form'>
            <div className="tab-container mb-1 ">
                {
                    tabs.map( ( tab, i ) => {
                        return (
                            <button
                                key={i}
                                style={{ width: parseInt( tab.width ) || 50 }}
                                className={`${tabActive === i && 'active'} tab-btn`}
                                onClick={( e ) => handleTabIndex( i, tab )}>
                                {tab.name}
                            </button>
                        );
                    }


                    )
                }

                {/* slider button */}
                <button
                    className="slider"
                    style=
                    {{
                        width: parseInt( tabs[tabActive].width ) || 100,
                        height,
                        left,
                        clipPath: tabActive === 0 ? 'polygon(0 0, 100% 0, 91% 100%, 0 100%)' : 'polygon(9% 0, 100% 0, 91% 100%, 0 100%)'
                    }}
                >
                </button>
            </div>
            <SlideDown>
                <div className='tab-content'>
                    {props.children[tabActive]}
                </div>
            </SlideDown>

        </div >
    );
}
