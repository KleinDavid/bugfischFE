import { DesignerFileManager } from './designerFileManager';

export class DesignerBindingManager {
    private static instance: DesignerBindingManager;
    private isEditing = false;
    private fileManager = DesignerFileManager.getInstance();

    editStartBindingString = '';

    bindings: Binding[] = [];

    public static getInstance(): DesignerBindingManager {
        if (!this.instance) {
            this.instance = new DesignerBindingManager();
        }
        return this.instance;
    }

    setBinding(bindingName: string, bindingValue: string = '', isImageBinding = false): void {
        let binding = this.bindings.find(b => b.name == bindingName);
        if (binding) {
            binding.value = binding.value !== '' ? binding.value : bindingValue;
        } else {
            this.bindings.push(new Binding(bindingName, bindingValue, !this.isEditing, isImageBinding));
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

    findAndSetBindingsInString(bindingString: string, ofImage: boolean = false): Binding[] {
        let foundBindings = []
        let bindingList = bindingString.split('{$');
        if (bindingList.length > 1) {
            for (let i = 1; i < bindingList.length; i++) {
                let valueNameList = bindingList[i].split('}');
                if (valueNameList.length > 1) {
                    let valueName = '{$' + valueNameList[0] + '}';
                    this.setBinding(valueName, '', ofImage);
                    foundBindings.push(valueName)
                }
            }
        }
        return this.bindings.filter(b => foundBindings.includes(b.name));
    }

    findBindingsInString(bindingString: string) {
        let foundBindings = []
        let bindingList = bindingString.split('{$');
        if (bindingList.length > 1) {
            for (let i = 1; i < bindingList.length; i++) {
                let valueNameList = bindingList[i].split('}');
                if (valueNameList.length > 1) {
                    let valueName = '{$' + valueNameList[0] + '}';
                    foundBindings.push(valueName)
                }
            }
        }
        return this.bindings.filter(b => foundBindings.includes(b.name));
    }

    replaceBindingsByValueInString(bindingString: string): string {
        this.bindings.forEach(b => {
            bindingString = bindingString.replace(b.name, b.value);
        });
        return this.fileManager.replaceImagePathBySrcInString(bindingString);
    }

    startEditingBindings(bindingString: string): void {
        this.editStartBindingString = bindingString;
        this.isEditing = true;
    }

    endEditingBindings(bindingString: string): void {
        this.isEditing = false;
        this.findAndSetBindingsInString(bindingString).forEach(b => { b.constant = true });
        this.bindings = this.bindings.filter(b => b.constant);
        let allNewBindings = this.findBindingsInString(bindingString);
        let allOldBindings = this.findBindingsInString(this.editStartBindingString);
        allNewBindings.concat(allOldBindings).forEach(b => {
            const countBefore = this.editStartBindingString.split(b.name).length - 1;
            const countAfter = bindingString.split(b.name).length - 1;
            b.countOfUse += countAfter - countBefore;
        });
    }

    countBindingInString(binding: string, bindingString: string) {

    }
}

export class Binding {
    name: string;
    value: string;
    countOfUse: number = 0;
    constant = true;
    ofImage = false;

    constructor(name: string, value: string = '', constant: boolean = true, ofImage: boolean = false) {
        this.name = name;
        this.value = value;
        this.constant = constant;
        this.ofImage = ofImage;
    }
}