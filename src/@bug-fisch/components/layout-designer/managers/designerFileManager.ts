import { DesignerBindingManager } from './designerBindingManager';
import { Subject, Observable } from 'rxjs';

export class DesignerFileManager {
    private static instance: DesignerFileManager;

    fileList: DesignerFile[] = [];

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
        return new DesignerFile('defaultImage', 'assets/default-image.png', '', DesignerFileType.IMAGE);
    }

    getFileByName(fileName: string): DesignerFile {
        return this.fileList.find(f => f.name === fileName);
    }

    getAllImageFiles(): DesignerFile[] {
        return this.fileList.filter(f => f.fileType === DesignerFileType.IMAGE);
    }

    uploadFile(): Observable<string>{
        let file = new DesignerFile('');
        this.fileList.push(file);
        file.upload();
        return file.getPathObservible();
    }

    // getImageSrcByPath(path: string): string {
    //     let file = this.fileList.find(f => f.path === this.bindingManager.replaceBindingsByValueInString(path));
    //     return file ? file.src : 'assets/default-image.png'
    // }

    replaceImagePathBySrcInString(pathString: string): string {
        this.fileList.forEach(f => {
            pathString = pathString.replace(f.path, f.src);
        })
        return pathString;
    }
}

export class DesignerFile {
    name: string;
    src: string = '';
    path: string = '';
    fileType: DesignerFileType;
    isDefault: boolean = true;

    private chanceSubject: Subject<string> = new Subject<string>();

    constructor(fileName: string, fileSrc: string = '', filePath: string = '', fileType: DesignerFileType = DesignerFileType.IMAGE) {
        this.name = fileName;
        this.src = fileSrc;
        this.path = filePath;
        this.fileType = fileType;
    }

    getPath(): string {
        return
    }

    upload(): void {
        let el = document.createElement('input');
        el.accept = 'image/*';
        el.type = 'file';
        el.onchange = this.handleInputChange.bind(this);
        
        console.log(el);
        el.click();
        //<input id="imageUploader" display="none" hidden type="file" accept="image/*" (change)="handleInputChange($event)" />
    }

    private handleInputChange(e: any) {
        var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        var pattern = /image-*/;
        var reader = new FileReader();
        
        if (!file.type.match(pattern)) {
          alert('invalid format');
          return;
        }
        this.name = file.name;
        this.path = 'assets/' + this.name;
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsDataURL(file);
      }
    
      private handleReaderLoaded(e: any): void {
        this.src = e.target.result;
        this.chanceSubject.next(this.path);
        // this.createObject(new Position(this.idCard.position.x, this.idCard.position.y), reader.result)
      }

      getPathObservible() : Observable<string> {
          return this.chanceSubject.asObservable();
      }
}

export enum DesignerFileType {
    IMAGE,
    FONT
}