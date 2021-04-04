import { config } from './config';
import i18next from 'i18next';

import {
    // imports pt-br
    generalBR,
    messagesBR,
    codesBR,
} from './translation';

const options = {
    interpolation: {
        escapeValue: false
    },
    lng: config.language as string,
    resources: {
        pt_br: {
            // exports pt-br
            general: generalBR,
            messages: messagesBR,
            codes: codesBR,
        }
    }
};

i18next.init(options);

function t(key: string, options?: any) {
    if (!!options) {
        return i18next.t(key, options);
    }
    return i18next.t(key);
}

export { t };
export default i18next;
