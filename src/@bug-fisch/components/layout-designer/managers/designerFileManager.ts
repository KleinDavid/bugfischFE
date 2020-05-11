import { DesignerBindingManger } from './designerBindingManager';

export class DesignerFileManager {
    private static instance: DesignerFileManager;
    private bindingManager: DesignerBindingManger = DesignerBindingManger.getInstance();
    private defaultImage: DesignerFile;

    private fileList: DesignerFile[] = [];

    public static getInstance(): DesignerFileManager {
        if (!this.instance) {
            this.instance = new DesignerFileManager();
        }
        return this.instance;
    }

    private constructor() { 

    }

    addImageFile(fileName: string, fileSrc: string = ''): void {
        let oldFile = this.fileList.find(f => f.name === fileName);
        if (oldFile) {
            oldFile.src = fileSrc;
        } else {
            this.fileList.push(new DesignerFile(fileName, fileSrc));
        }
    }

    getDefaultImage(): DesignerFile {
        return new DesignerFile('defaultImage', '', DesignerFileType.IMAGE);
    }

    getFileByName(fileName: string): DesignerFile {
        return this.fileList.find(f => f.name === fileName);
    }

    getImageSrcByPath(path: string): string {
        return this.fileList.find(f => f.path === path).src;
    }

    getAllImageFiles(): DesignerFile[] {
        return this.fileList.filter(f => f.fileType === DesignerFileType.IMAGE);
    }
}

export class DesignerFile {
    name: string;
    src: string = '';
    path: string = '';
    fileType: DesignerFileType;

    constructor(fileName: string, fileSrc: string = '', fileType: DesignerFileType = DesignerFileType.IMAGE) {
        this.name = fileName;
        this.src = fileSrc;
        this.fileType = fileType;
    }

    getPath(): string {
        return
    }
}

export enum DesignerFileType {
    IMAGE,
    FONT
}