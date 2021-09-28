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

export const attributesSnakeToCamelCase = <T = Object>(obj: Object): T => {
    return Object.assign({}, ...Object.entries(obj)
        .map(([key, value]) => {
            return { [snakeToCamelCase(key)]: value }
        }));
}

export const attributesCamelToSnakeCase = <T = Object>(obj: Object): T => {
    return Object.assign({}, ...Object.entries(obj)
        .map(([key, value]) => {
            return { [camelToSnakeCase(key)]: value }
        }));
}

export const recursiveObjectTo = <T = Object>(obj: Object, func: (str: string) => string): T => {
    if (typeof (obj) != "object") return obj;

    for (var oldName in obj) {
        // converte aqui
        const newName = func(oldName);

        if (newName != oldName) {
            // Verifique o nome da propriedade antiga para evitar um ReferenceError no modo estrito.
            if (obj.hasOwnProperty(oldName)) {
                obj[newName] = obj[oldName];
                delete obj[oldName];
            }
        }

        // Recursão
        if (typeof (obj[newName]) == "object") {
            obj[newName] = recursiveObjectTo(obj[newName], func);
        }

    }
    return obj as T;
}

export const Util = {
    snakeToCamelCase,
    camelToSnakeCase,
    attributesSnakeToCamelCase,
    attributesCamelToSnakeCase,
    recursiveObjectTo
}