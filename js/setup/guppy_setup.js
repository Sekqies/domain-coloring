import { loadGuppy } from './guppy_setup.js';
import { loadHover } from './hover.js';


function load() {
    loadGuppy();
    loadHover();
    init();
}

export { load }