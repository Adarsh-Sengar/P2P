import React from 'react';
import { Table, Button } from 'react-bootstrap';

function ButtonWithLabels(props) {
    const sep = '/?/';
    console.log('PROPS IN BUTTON WITH LABELS')
    console.log(props)
    return (
        <Table bordered>
        <tbody class="ButtonWithLabels">
            <tr>
                { props.labels.map( el =>
                    <td key={el}>{el}</td>
                )}
                <td class="ButtonWithLabelsButtonContainer">
                    <Button 
                        class="rightEndButton" 
                        onClick={props.onClick} 
                        key={'button__'+props.buttonLabel}
                        value={props.labels.join(sep)}
                        >{props.buttonLabel}
                    </Button>
                </td>
            </tr>
        </tbody>
        </Table>
    )
}


function SingleButton(props) {
    return (
        <div class='SingleButtonContainer'>
            <Button size="lg"
                onClick={props.onClick}
            >{props.label}</Button>
        </div>
    )
}

export {
    ButtonWithLabels,
    SingleButton
}