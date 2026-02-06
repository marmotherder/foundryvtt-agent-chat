export enum Type {
    TYPE_UNSPECIFIED = "TYPE_UNSPECIFIED",
    STRING = "STRING",
    NUMBER = "NUMBER",
    INTEGER = "INTEGER",
    BOOLEAN = "BOOLEAN",
    ARRAY = "ARRAY",
    OBJECT = "OBJECT",
    NULL = "NULL"
}

export type Arguments<K extends keyof any, T> = {
    [P in K]: T;
};

export interface FunctionToolParameter {
    title?: string;
    type?: Type;
    description?: string;
    example?: string;
    properties?: Record<string, Arguments<string, unknown>>;
    propertyOrdering?: string[];
}

export interface FunctionTool {
    name: string;
    description: string;
    parameters: FunctionToolParameter;
    callTool: (args: Arguments<string, unknown>) => Promise<string>;
}
