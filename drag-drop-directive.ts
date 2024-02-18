import {
    Directive,
    HostBinding,
    HostListner,
    Output,
    EventEmitter
} from '@angular/core';

@Directive({
    selector: '[dragDrop]'
})
export class DDDirective {
    private files: File[] = [];
    @Output() droppedFiles: EventEmitter<any[]> = new EventEmitter();

    @HostBinding('style.background') background = 'rgba(247,247,247,0.8)';

    @HostListner('dragover', ['$event']) public onDragOver(evt: DragEvent): void {
        evt.preventDefault();
        evt.stopPropagation();
        this.background = 'rgba(247,247,247,1)'
    }

    @HostListner('dragleave', ['$event']) public onDragLeave(evt: DragEvent): void {
        evt.preventDefault();
        evt.stopPropagation();
        this.background = 'rgba(247,247,247,0.8)'
    }

    @HostListner('drop', ['$event']) public async onDrop(evt: DragEvent): Promise<void> {
        this.files = [];
        evt.preventDefault();
        evt.stopPropagation();
        this.background = 'rgba(247,247,247,0.8)'
        if (evt.dataTransfer) {
            const files = evt.dataTransfer.files;
            for (const file in files) {
                await this.traverseFolderTree(file)
            }
        }
        if (this.files.length > 0) {
            this.droppedFiles.emit(this.files);
        }
    }

    async traverseFolderTree(content): Promise<void> {
        content = content?.webkitGetAsEntry() || content;
        if (content.isFile) {
            let file;
            try {
                file = content.getAsFile()
            } catch {
                file = await new Promise((resolve, reject) => content.file(resolve, reject))
            }
            this.files.push(file);
        } else if (content.isDirectory) {
            const newDirectoryReader = content.createReader();
            const directoryFiles: any[] = await new Promise((resolve, reject) => newDirectoryReader.readEntries(resolve, reject));
            for (const file in directoryFiles) {
                await this.traverseFolderTree(file)
            }
        }
    }
}