import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DDDirective } from './drag-drop.directive';

@Component({
    template: `<div dragDrop (droppedFiles)="droppedFiles($event)"></div>`
})
class DummyComponent {
    public droppedFileList: File[] = [];
    public droppedFiles(evt: File[]) {
        this.droppedFileList.push(...evt)
    }
}

describe('Drag Drop Directive', () => {
    let fixture: ComponentFixture<DummyComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DDDirective, DummyComponent]
        });
        fixture = TestBed.createComponent(DummyComponent);
    });

    it('should create an instance', () => {
        const directive = new DDDirective();
        expect(directive).toBeTruthy();
    });

    it('should initialize dragDrop directive without errors', () => {
        expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should apply dragDrop directive', () => {
        const divElement = fixture.debugElement.query(By.css('div'));
        expect(divElement).toBeTruthy();
        fixture.detectChanges();
        expect(divElement.nativeElement.style.backgroundColor).toBe('rgba(247, 247, 247, 0.8)');
    });

    it('should handle dragOver event', () => {
        const divElement = fixture.debugElement.query(By.css('div'));
        const dragOverEvent = new DragEvent('dragover', { bubbles: true });
        divElement.nativeElement.dispatchEvent(dragOverEvent);
        fixture.detectChanges();
        expect(divElement.nativeElement.style.backgroundColor).toBe('rgb(247, 247, 247)');
    });

    it('should handle dragleave event', () => {
        const divElement = fixture.debugElement.query(By.css('div'));
        const dragLeaveEvent = new DragEvent('dragleave', { bubbles: true });
        divElement.nativeElement.dispatchEvent(dragLeaveEvent);
        fixture.detectChanges();
        expect(divElement.nativeElement.style.backgroundColor).toBe('rgba(247, 247, 247, 0.8)');
    });


    it('should handle drop event with files', fakeAsync(() => {
        const mockFiles = [
            new File(['file content A'], 'fileA.txt', { type: 'text/plain' }),
            new File(['file content B'], 'fileB.txt', { type: 'text/plain' },)
        ];

        const Direc: any = new File(['file content C'], 'fileC.txt', { type: 'text/plain' })
        const directoryEntry = {
            isFile: false,
            isDirectory: true,
            createReader: jasmine.createSpy('createReader').and.callFake(() => {
                return {
                  readEntries: jasmine.createSpy('readEntries').and.callFake((resolve,_)=>{
                    const imageData = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
                    const blob = new Blob([imageData], { type: 'image/png' });
                    const file: any = new File([blob], 'mock_image.png', { type: 'image/png' });
                    const directoryFile = {
                            isFile: true,
                            isDirectory: false,
                    }
                    file['webkitGetAsEntry'] = () => directoryFile;
                    resolve([
                        file
                    ])
                  }),
                };
            }),
        };
        Direc['webkitGetAsEntry'] = () => directoryEntry;
        mockFiles.push(Direc);

        const dataTransfer = new DataTransfer();
        for (const file of mockFiles) {
            dataTransfer.items.add(file);
        }
        // Create a mock drop event
        const divElement = fixture.debugElement.query(By.css('div'));
        const dropEvent = new DragEvent('drop', {
            bubbles: true,
            dataTransfer: dataTransfer,
        });
        divElement.nativeElement.dispatchEvent(dropEvent);
        fixture.detectChanges();
        tick(3000);
        expect(fixture.componentInstance.droppedFileList.length).toBe(3);
    }));

    it('should handle drop event with files when directory content is not resolved', fakeAsync(() => {
        const mockFiles = [new File(['file content A'], 'fileA.txt', { type: 'text/plain' })];
        const Direc: any = new File(['file content C'], 'fileC.txt', { type: 'text/plain' })
        const directoryEntry = {
            isFile: false,
            isDirectory: true,
            createReader: jasmine.createSpy('createReader').and.callFake(() => {
                return {
                  readEntries: jasmine.createSpy('readEntries').and.callFake((_,reject)=>{
                    reject()
                  }),
                };
            }),
        };
        Direc['webkitGetAsEntry'] = () => directoryEntry;
        mockFiles.push(Direc);

        const dataTransfer = new DataTransfer();
        for (const file of mockFiles) {
            dataTransfer.items.add(file);
        }
        // Create a mock drop event
        const divElement = fixture.debugElement.query(By.css('div'));
        const dropEvent = new DragEvent('drop', {
            bubbles: true,
            dataTransfer: dataTransfer,
        });
        divElement.nativeElement.dispatchEvent(dropEvent);
        fixture.detectChanges();
        tick(3000);
        expect(fixture.componentInstance.droppedFileList.length).toBe(1);
    }));
});