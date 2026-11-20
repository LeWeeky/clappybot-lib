export interface ActionProps {
    dm?: boolean;
    any_guild?: boolean;
    parse: (...args: any[]) => Promise<void>;
}