function MissingProp(object: string, prop: string, name: string) {
    throw new Error(`${object} is missing ${prop}: ${name}`);
}

export function MissingField(object: string, name: string) {
    MissingProp(object, "field", name);
}

export function MissingMethod(object: string, name: string) {
    MissingProp(object, "method", name);
}
