import React from 'react';
import { ButtonWithLabels } from './buttonInputs.jsx'


function ButtonWithLabelsList(props) {
    return (
        <div className="buttonWithLabelsListContainer">
            { props.elements.map( el =>
                    <ButtonWithLabels
                        buttonLabel={el.buttonLabel}
                        labels={el.labels}
                        onClick={el.onClick}
                        key={el.labels[0]}
                    ></ButtonWithLabels>
                )}
        </div>
    )
}

export {
    ButtonWithLabelsList
}