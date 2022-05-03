import * as _ from 'lodash';
import './style.css';

function component(): HTMLDivElement {
    const element: HTMLDivElement = document.createElement('div');

    // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello')

    return element;
}

document.body.appendChild(component());
