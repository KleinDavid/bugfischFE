export class DesignerBindingManger {
    private static instance: DesignerBindingManger

    bindings: Binding[] = [];

    public static getInstance(): DesignerBindingManger {
        if (!this.instance) {
            this.instance = new DesignerBindingManger();
        }
        return this.instance;
    }

    setBinding(bindingName: string, bindingValue: string = ''): void {
        let binding = this.bindings.find(b => b.name == bindingName);
        if (binding) {
            binding.value = binding.value !== '' ? binding.value : bindingValue;
        } else {
            this.bindings.push(new Binding(bindingName, bindingValue));
        }
    }

    setBindingValue(bindingName: string, bindingValue: string): void {
        let binding = this.bindings.find(b => b.name == bindingName);
        if (binding) {
            binding.value = bindingValue;
        }
    }

    deleteBindingByName(bindingName: string) {
        this.bindings = this.bindings.filter(b => b.name !== bindingName);
    }

    deleteBinding(binding: Binding) {
        this.bindings = this.bindings.filter(b => b !== binding);
    }

    findAndSetBindingsInString(bindingString: string): Binding[] {
        let foundBindings = []
        let bindingList = bindingString.split('{$');
        if (bindingList.length > 1) {
            for (let i = 1; i < bindingList.length; i++) {
                let valueNameList = bindingList[i].split('}');
                if (valueNameList.length > 1) {
                    let valueName = '{$' + valueNameList[0] + '}';
                    this.setBinding(valueName);
                    foundBindings.push(valueName)
                }
            }
        }
        return this.bindings.filter(b => foundBindings.includes(b.name))
    }

    replaceBindingsByValueInString(bindingString: string): string {
        this.bindings.forEach(b => {
            bindingString = bindingString.replace(b.name, b.value);
        });
        return bindingString;
    }

}

export class Binding {
    name: string;
    value: string;
    countOfUse: number = 0;
    constructor(name: string, value: string = '') {
        this.name = name;
        this.value = value;
    }
}