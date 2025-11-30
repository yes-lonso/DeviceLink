export interface Action {
    label?: string;
    icon?: string;
    color?: string;
    flat?: boolean;
    class?: string;
    handler: (val?: any) => void;
    disabled?: boolean;
    tooltip?: string;
    type?: 'button' | 'input' | 'select' | 'menu' | 'dropdown';
    value?: string;
    placeholder?: string;
    inputConfig?: Record<string, any>;
    options?: any[];
    items?: Action[];
    update?: (val: any) => void;
}
