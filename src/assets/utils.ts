export const randomString = (tamanho: number, chars: string) => {
    let mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('1') > -1) mask += '0123456789';
    if (chars.indexOf('#') > -1) mask += '!@#$%&';
    let result = '';
    for (let i = tamanho; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}

export const snakeToCamelCase = (str: string): string => {
    return str.replace(
        /([-_][a-z])/g,
        (group: string) => group.toUpperCase().replace('-', '').replace('_', '')
    );
}

export const camelToSnakeCase = (str: string) => {
    return str.replace(
        /[A-Z]/g,
        (letter: string) => `_${letter.toLowerCase()}`);
}

export const attributesSnakeToCamelCase = <T>(obj: Object): Object | T => {
    return Object.assign({}, ...Object.entries(obj)
        .map(([key, value]) => {
            return { [snakeToCamelCase(key)]: value }
        }));
}

export const attributesCamelToSnakeCase = <T>(obj: Object): Object | T => {
    return Object.assign({}, ...Object.entries(obj)
        .map(([key, value]) => {
            return { [camelToSnakeCase(key)]: value }
        }));
}


export const Util = {
    randomString,
    snakeToCamelCase,
    camelToSnakeCase,
    attributesSnakeToCamelCase,
    attributesCamelToSnakeCase
}