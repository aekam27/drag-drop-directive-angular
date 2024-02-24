import {
    Directive,
    HostBinding,
    HostListener,
    Output,
    EventEmitter
} from '@angular/core';

@Directive({
    selector: '[dragDrop]'
})
export class DDDirective {
    private files: File[] = [];
    @Output() droppedFiles: EventEmitter<File[]> = new EventEmitter();

    @HostBinding('style.backgroundColor') backgroundColor = 'rgba(247, 247, 247, 0.8)';

    @HostListener('dragover', ['$event']) public onDragOver(evt: DragEvent): void {
        evt.preventDefault();
        evt.stopPropagation();
        this.backgroundColor = 'rgb(247, 247, 247)'
    }

    @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent): void {
        evt.preventDefault();
        evt.stopPropagation();
        this.backgroundColor = 'rgba(247, 247, 247, 0.8)'
    }

    @HostListener('drop', ['$event']) public async onDrop(evt: DragEvent): Promise<void> {
        this.files = [];
        evt.preventDefault();
        evt.stopPropagation();
        this.backgroundColor = 'rgba(247, 247, 247, 0.8)'
        if (evt.dataTransfer) {
            const files = evt.dataTransfer.files;
            for (let i =0; i<files.length; i++) {
                try {
                    await this.traverseFolderTree(files[i])
                }catch (err) {
                    console.error(`Error while traversing the file ${files[i]?.name ?? files[i]}`);
                }    
            }
        }
        if (this.files.length > 0) {
            this.droppedFiles.emit(this.files);
        }
    }

    async traverseFolderTree(content:any): Promise<void> {
        if (content?.webkitGetAsEntry) {
            content = content.webkitGetAsEntry();
            if (content.isFile) {
                this.files.push(content);
            } else if (content.isDirectory) {
                let directoryFiles: any[] = [];
                try {
                    const newDirectoryReader = content.createReader();
                    directoryFiles = await new Promise((resolve, reject) => newDirectoryReader.readEntries(resolve, reject));
                }catch (err){
                    console.error('Error while reading directory content')
                }
                for (const file of directoryFiles) {
                    try {
                        await this.traverseFolderTree(file)
                    }catch (err) {
                        console.error(`Error while traversing the file ${file?.name ?? file}`);
                    }
                }
            }
        }  else {
            this.files.push(content);
        }
        
    }
}